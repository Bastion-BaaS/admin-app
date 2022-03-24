const aws = require('aws-sdk');
const nanoid = require('nanoid');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const cloudformation = new aws.CloudFormation();
const Instance = require('../models/instance');
const HttpError = require('../models/httpError');
const { createParams, isValidStackName } = require('../utils/helper');
const TemplateBody = fs.readFileSync(path.resolve(__dirname, '../utils/bastion-development.yaml'), 'utf8');

const createBaaS = (req, res, next) => {
  const stackName = req.body?.name;
  if (!isValidStackName(stackName)) {
    return next(new HttpError(new Error("Invalid stack name. Only use letters, numbers, '_', and '-'.")), 500);
  }
  const apiKey = nanoid.nanoid();
  const bucketName = `${stackName}-bucket-${crypto.randomBytes(10).toString('hex')}`.toLowerCase();

  createParams(stackName, apiKey, TemplateBody, bucketName)
    .then(params => {
      cloudformation.createStack(params, (err, data) => {
        if (err) {
          return next(new HttpError(err, 500));
        }

        const newInstance = {
          StackName: stackName,
          StackId: data.StackId,
          ApiKey: apiKey,
          BucketName: bucketName,
        }

        Instance.create(newInstance)
          .then(createdInstance => res.status(201).json(createdInstance))
          .catch(err => next(new HttpError(err, 500)));
      });
    })
    .catch(err => next(err));
};

const destroyBaaS = (req, res, next) => {
  const stackName = req.params.stackName;
  Instance.findOne({ StackName: stackName })
    .then(instance => {
      const params = { StackName: instance.StackName };
      cloudformation.deleteStack(params, (err, data) => {
        if (err) {
          return next(new HttpError(err, 500));
        }
        
        Instance.findOneAndDelete({ StackName: stackName })
          .then(result => res.status(204).json(result))
          .catch(err => next(new HttpError(err, 500)));
      });
    })
    .catch(err => next(new HttpError(err, 500)));
};

const getBaaSInstances = (req, res, next) => {
  Instance.find({})
    .then(instances => res.json(instances))
    .catch(err => next(new HttpError(err, 500)));
};

const getBaaSInstance = (req, res, next) => {
  const stackName = req.params.stackName;
  Instance.findOne({ StackName: stackName })
    .then(instance => res.status(200).json(instance))
    .catch(err => next(new HttpError(err, 500)));
};

exports.createBaaS = createBaaS;
exports.destroyBaaS = destroyBaaS;
exports.getBaaSInstances = getBaaSInstances;
exports.getBaaSInstance = getBaaSInstance;
