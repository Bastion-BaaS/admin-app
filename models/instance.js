const mongoose = require('mongoose');

const instanceSchema = new mongoose.Schema({
    StackName: {
        type: String
    },
    StackId: {
        type: String,
        required: [true, 'The StackId is required']
    }
}, {timestamps: true});

module.exports = mongoose.model('Instance', instanceSchema);