const mongoose = require('mongoose');

const rulePrioritySchema = new mongoose.Schema({
    Current: {
        type: Number,
        required: [true, 'The CurrentPriority is required']
    }
}, { timestamps: true });

module.exports = mongoose.model('RulePriority', rulePrioritySchema);