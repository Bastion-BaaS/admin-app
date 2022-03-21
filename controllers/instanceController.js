const aws = require('aws-sdk');
const nanoid = require('nanoid');

const cloudformation = new aws.CloudFormation();
const Instance = require('../models/instance');
const HttpError = require('../models/httpError');
const { createParams } = require('../utils/helper');

const createBaaS = async (req, res, next) => {
  const apiKey = nanoid.nanoid();
  let params;
  try {
    params = await createParams(req.body.name, apiKey);
  } catch (err) {
    return next(err);
  }

  cloudformation.createStack(params, (err, data) => {
    if (err) {
      return next(new HttpError(err, 500));
    }

    const newInstance = {
      StackName: req.body.name,
      StackId: data.StackId,
      ApiKey: apiKey,
    }

    Instance.create(newInstance)
      .then(createdInstance => res.status(200).json(createdInstance))
      .catch(err => next(new HttpError(err, 500)));
  });
};

const destroyBaaS = (req, res, next) => {
  Instance.findById(req.params.id)
    .then(instance => {
      const params = { StackName: instance.StackName };
      cloudformation.deleteStack(params, (err, data) => {
        if (err) {
          return next(new HttpError(err, 500));
        }
        
        Instance.findByIdAndDelete(req.params.id)
          .then(result => res.status(200).json(result))
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
  Instance.findById(req.params.id)
    .then(instance => res.status(200).json(instance))
    .catch(err => next(new HttpError(err, 500)));
};

exports.createBaaS = createBaaS;
exports.destroyBaaS = destroyBaaS;
exports.getBaaSInstances = getBaaSInstances;
exports.getBaaSInstance = getBaaSInstance;
