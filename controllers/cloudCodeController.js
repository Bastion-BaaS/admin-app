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
    return res.status(200).json(response.data);
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
  const ccfBucketName = instanceObj.CCFBucketName;

  let roleResult;
  try {
    roleResult = await ccf.getRoleCCFArn();
  } catch(err) {
    next(new HttpError(err, 500));
  }

  try {
    await ccf.uploadZipToS3(ccfBucketName, ccfName, file);
  } catch (err) {
    return next(new HttpError(err, 500));
  }

  try {
    await ccf.createLambda(ccfName, ccfBucketName, roleResult?.Role.Arn);
  } catch (err) {
    return next(new HttpError(err, 500));
  }

  const url = createURL(stackName, `/ccfs/${ccfName}/created`);

  try {
    let response = await axios.post(url, {}, req.axiosConfig);
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
  const ccfBucketName = instanceObj.CCFBucketName;

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
