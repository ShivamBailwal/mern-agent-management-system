const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const Agent = require('../models/Agent');
const DistributedList = require('../models/DistributedList');
const auth = require('../middleware/auth');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.csv', '.xlsx', '.xls'];
  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error('Only CSV, XLSX, and XLS files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Helper function to parse CSV file
const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        // Normalize column names (case insensitive)
        const normalizedData = {};
        Object.keys(data).forEach(key => {
          const normalizedKey = key.toLowerCase().trim();
          if (normalizedKey.includes('firstname') || normalizedKey.includes('first_name') || normalizedKey.includes('first name')) {
            normalizedData.firstName = data[key];
          } else if (normalizedKey.includes('phone') || normalizedKey.includes('mobile')) {
            normalizedData.phone = data[key];
          } else if (normalizedKey.includes('notes') || normalizedKey.includes('note')) {
            normalizedData.notes = data[key] || '';
          }
        });

        if (normalizedData.firstName && normalizedData.phone) {
          results.push(normalizedData);
        }
      })
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
};

// Helper function to parse Excel file
const parseExcel = (filePath) => {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    const results = [];
    data.forEach(row => {
      const normalizedData = {};
      Object.keys(row).forEach(key => {
        const normalizedKey = key.toLowerCase().trim();
        if (normalizedKey.includes('firstname') || normalizedKey.includes('first_name') || normalizedKey.includes('first name')) {
          normalizedData.firstName = row[key];
        } else if (normalizedKey.includes('phone') || normalizedKey.includes('mobile')) {
          normalizedData.phone = row[key];
        } else if (normalizedKey.includes('notes') || normalizedKey.includes('note')) {
          normalizedData.notes = row[key] || '';
        }
      });

      if (normalizedData.firstName && normalizedData.phone) {
        results.push(normalizedData);
      }
    });

    return results;
  } catch (error) {
    throw new Error('Error parsing Excel file: ' + error.message);
  }
};

// Helper function to distribute data among agents
const distributeData = (data, agents) => {
  const agentCount = agents.length;
  const itemsPerAgent = Math.floor(data.length / agentCount);
  const remainder = data.length % agentCount;

  const distribution = [];
  let currentIndex = 0;

  agents.forEach((agent, index) => {
    const itemsForThisAgent = itemsPerAgent + (index < remainder ? 1 : 0);
    const agentData = data.slice(currentIndex, currentIndex + itemsForThisAgent);

    distribution.push({
      agentId: agent._id,
      agentName: agent.name,
      records: agentData
    });

    currentIndex += itemsForThisAgent;
  });

  return distribution;
};

// @route   POST /api/upload
// @desc    Upload CSV/Excel file and distribute among agents
// @access  Private
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    let parsedData = [];

    // Parse file based on extension
    if (fileExtension === '.csv') {
      parsedData = await parseCSV(filePath);
    } else if (fileExtension === '.xlsx' || fileExtension === '.xls') {
      parsedData = parseExcel(filePath);
    }

    if (parsedData.length === 0) {
      // Clean up uploaded file
      fs.unlinkSync(filePath);
      return res.status(400).json({
        message: 'No valid data found in file. Please ensure the file contains FirstName, Phone, and Notes columns.'
      });
    }

    // Get all active agents
    const agents = await Agent.find({ isActive: true }).limit(5);
    if (agents.length === 0) {
      // Clean up uploaded file
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: 'No active agents found. Please create agents first.' });
    }

    // Distribute data among agents
    const distributedData = distributeData(parsedData, agents);

    // Save distributed list to database
    const distributedList = new DistributedList({
      fileName: req.file.originalname,
      totalRecords: parsedData.length,
      distributedData: distributedData,
      uploadedBy: req.user._id
    });

    await distributedList.save();

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.json({
      message: 'File uploaded and distributed successfully',
      distributedList: {
        id: distributedList._id,
        fileName: distributedList.fileName,
        totalRecords: distributedList.totalRecords,
        distributedData: distributedList.distributedData,
        createdAt: distributedList.createdAt
      }
    });
  } catch (error) {
    // Clean up uploaded file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.error(error);
    if (error.message.includes('Only CSV, XLSX, and XLS files are allowed')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error processing file: ' + error.message });
  }
});

// @route   GET /api/upload/distributions
// @desc    Get all distributed lists
// @access  Private
router.get('/distributions', auth, async (req, res) => {
  try {
    const distributions = await DistributedList.find()
      .populate('uploadedBy', 'email')
      .sort({ createdAt: -1 });

    res.json(distributions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/upload/distributions/:id
// @desc    Get specific distributed list
// @access  Private
router.get('/distributions/:id', auth, async (req, res) => {
  try {
    const distribution = await DistributedList.findById(req.params.id)
      .populate('uploadedBy', 'email');

    if (!distribution) {
      return res.status(404).json({ message: 'Distribution not found' });
    }

    res.json(distribution);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
