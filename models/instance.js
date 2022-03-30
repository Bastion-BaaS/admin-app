const mongoose = require('mongoose');

const instanceSchema = new mongoose.Schema({
  StackName: {
    type: String,
    required: [true, 'The StackName is required']
  },
  StackId: {
    type: String,
    required: [true, 'The StackId is required']
  },
  ApiKey: {
    type: String,
    require: [true, 'The ApiKey is required']
  },
  BucketName: {
    type: String,
    require: [true, 'The BucketName is required']
  },
}, {timestamps: true});

module.exports = mongoose.model('Instance', instanceSchema);
