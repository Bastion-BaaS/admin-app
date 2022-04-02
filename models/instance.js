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
  FileBucketName: {
    type: String,
    require: [true, 'A BucketName is required']
  },
  CCFBucketName: {
    type: String,
    require: [true, 'A BucketName is required']
  },
}, {timestamps: true});

module.exports = mongoose.model('Instance', instanceSchema);
