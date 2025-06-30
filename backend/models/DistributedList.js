const mongoose = require('mongoose');

const distributedListSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true
  },
  totalRecords: {
    type: Number,
    required: true
  },
  distributedData: [{
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agent',
      required: true
    },
    agentName: {
      type: String,
      required: true
    },
    records: [{
      firstName: {
        type: String,
        required: true,
        trim: true
      },
      phone: {
        type: String,
        required: true,
        trim: true
      },
      notes: {
        type: String,
        trim: true,
        default: ''
      }
    }]
  }],
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DistributedList', distributedListSchema);
