const axios = require('axios');
const Instance = require('../models/instance');
const HttpError = require('../models/httpError');
const { createURL } = require('../utils/helper');
const ccf = require('../aws/ccf');

const getCloudCodeFunctions = async (req, res, next) => {
  const stackName = req.params.stackName;

  const url = createURL(stackName, '/ccfs');
  try {
    let response = await axios.get(url, req.axiosConfig);
    res.status(201).json(response.data);
  } catch(err) {
    next(new HttpError(err, 500));
  }
};

const createCloudCodeFunction = async (req, res, next) => {
  const stackName = req.params.stackName;
  const ccfName = req.body?.fileName;
  const file = req.body?.file;
  if(!ccfName || !file || !stackName) {
    next(new HttpError('Insufficient information', 500));
  }

  let instanceObj;
  try {
    instanceObj = await Instance.findOne({ StackName: stackName })
  } catch(err) {
    next(new HttpError(err, 500))
  }
  // Hard code a bucket name for testing
  const ccfBucketName = instanceObj.BucketName;

  let roleResult;
  try {
    roleResult = await ccf.getRoleCCFArn();
  } catch(err) {
    next(new HttpError(err, 500));
  }

  let s3Result;
  try {
    s3Result = await ccf.uploadZipToS3(ccfBucketName, file, ccfName);
  } catch(err) {
    next(new HttpError(err, 500));
  }

  let lambdaResult;
  try {
    lambdaResult = await ccf.createLambda(ccfName, ccfBucketName, roleResult?.Role.Arn);
  } catch(err) {
    next(new HttpError(err, 500));
  }

  const request = { name: ccfName };
  const url = createURL(stackName, '/ccfs/created');
  try {
    let response = await axios.post(url, request, req.axiosConfig);
    res.status(201).json(response.data);
  } catch(err) {
    next(new HttpError(err, 500));
  }
};

const deleteCloudCodeFunction = async (req, res, next) => {
  const stackName = req.params.stackName;
  const ccfName = req.params.ccfName;

  let instanceObj;
  try {
    instanceObj = await Instance.findOne({ StackName: stackName })
  } catch(err) {
    next(new HttpError(err, 500));
  }

  // For testing use a hard coded bucket name
  const ccfBucketName = instanceObj.BucketName;

  let result
  try {
    result = await ccf.removeLambda(ccfName, ccfBucketName);
  } catch(err) {
    next(new HttpError(err, 500));
  }

  const url = createURL(stackName, `/ccfs/${ccfName}`);
  try {
    let response = await axios.delete(url, req.axiosConfig);
    res.status(201).json({ message: 'deletion complete' });
  } catch(err) {
    next(new HttpError(err, 500));
  }
};

exports.createCloudCodeFunction = createCloudCodeFunction;
exports.getCloudCodeFunctions = getCloudCodeFunctions;
exports.deleteCloudCodeFunction = deleteCloudCodeFunction;
