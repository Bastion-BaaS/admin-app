const axios = require('axios');
const Instance = require('../models/instance');
const HttpError = require('../models/httpError');
const { createURL } = require('../utils/helper');
const ccf = require('../aws/ccf');

const getCloudCodeFunctions = (req, res, next) => {
  const stackName = req.params.stackName;
  const url = createURL(stackName, '/ccfs');
  axios.post(url, request, req.axiosConfig)
    .then(response => res.status(201).json(response.data))
    .catch(err => next(new HttpError(err, 500)));
};

const createCloudCodeFunction = async (req, res, next) => {
  const stackName = req.params.stackName;
  const ccfName = req.body?.name;
  if(!ccfName) {
    next(new HttpError('No CCF name provided', 500));
  }

  let instanceObj;
  Instance.findOne({ StackName: stackName })
    .then(instance => instanceObj = instance)
    .catch(err => next(new HttpError(err, 500)));
  const ccfBucketName = instanceObj.BucketName;

  let roleResult = ccf.getRoleCCFArn();
  if (roleResult.error) {
    next(new HttpError(roleResult.error, 500));
  }

  let s3Result = await ccf.uploadZipToS3(ccfBucketName, ccfName);
  if (s3Result.error) {
    next(new HttpError(s3Result.error, 500));
  }


  let lambdaResult = ccf.createLambda(ccfName, ccfBucketName);
  if (lambdaResult?.error) {
    next(new HttpError(lambdaResult.error, 500));
  }

  const request = { name: ccfName };
  const url = createURL(stackName, '/ccfs/created');
  axios.post(url, request, req.axiosConfig)
    .then(response => res.status(201).json(response.data))
    .catch(err => next(new HttpError(err, 500)));
};

const deleteCloudCodeFunction = (req, res, next) => {
  const stackName = req.params.stackName;
  const ccfName = req.params.ccfName;

  let instanceObj;
  Instance.findOne({ StackName: stackName })
    .then(instance => instanceObj = instance)
    .catch(err => next(new HttpError(err, 500)));
  const ccfBucketName = instanceObj.BucketName;

  let result = ccf.removeLambda(ccfName, ccfBucketName);
  if (result?.error) {
    next(new HttpError(result.error, 500));
  }

  const request = { name: ccfName };
  const url = createURL(stackName, `/ccfs/${ccfName}`);
  axios.delete(url, request, req.axiosConfig)
    .then(response => res.status(201).json(response.data))
    .catch(err => next(new HttpError(err, 500)));
};

exports.createCloudCodeFunction = createCloudCodeFunction;
exports.getCloudCodeFunctions = getCloudCodeFunctions;
exports.deleteCloudCodeFunction = deleteCloudCodeFunction;
