const express = require('express');
const Joi = require('joi');
const Agent = require('../models/Agent');
const auth = require('../middleware/auth');
const router = express.Router();

// Validation schema
const agentSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  mobile: Joi.string().required(),
  password: Joi.string().min(6).required()
});

// @route   GET /api/agents
// @desc    Get all agents
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const agents = await Agent.find().select('-password').sort({ createdAt: -1 });
    res.json(agents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/agents
// @desc    Create new agent
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    // Validate input
    const { error } = agentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, email, mobile, password } = req.body;

    // Check if agent already exists
    const existingAgent = await Agent.findOne({ email });
    if (existingAgent) {
      return res.status(400).json({ message: 'Agent with this email already exists' });
    }

    // Create new agent
    const agent = new Agent({
      name,
      email,
      mobile,
      password
    });

    await agent.save();

    // Return agent without password
    const { password: _, ...agentData } = agent.toObject();
    res.status(201).json({
      message: 'Agent created successfully',
      agent: agentData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/agents/:id
// @desc    Get agent by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id).select('-password');
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    res.json(agent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/agents/:id
// @desc    Update agent
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, email, mobile, isActive } = req.body;

    const agent = await Agent.findById(req.params.id);
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    // Check if email is being changed and already exists
    if (email && email !== agent.email) {
      const existingAgent = await Agent.findOne({ email });
      if (existingAgent) {
        return res.status(400).json({ message: 'Agent with this email already exists' });
      }
    }

    // Update agent fields
    if (name) agent.name = name;
    if (email) agent.email = email;
    if (mobile) agent.mobile = mobile;
    if (isActive !== undefined) agent.isActive = isActive;

    await agent.save();

    // Return agent without password
    const { password: _, ...agentData } = agent.toObject();
    res.json({
      message: 'Agent updated successfully',
      agent: agentData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/agents/:id
// @desc    Delete agent
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    await Agent.findByIdAndDelete(req.params.id);
    res.json({ message: 'Agent deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
