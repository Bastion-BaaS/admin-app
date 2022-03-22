const axios = require('axios');
const HttpError = require('../models/httpError');
const { createURL } = require('../utils/helper');

const getCloudCodeFunctions = (req, res, next) => {
  const stackName = req.params.stackName;
};

const createCloudCodeFunction = (req, res, next) => {
  const stackName = req.params.stackName;
};

const deleteCloudCodeFunction = (req, res, next) => {
  const stackName = req.params.stackName;
};

exports.createCloudCodeFunction = createCloudCodeFunction;
exports.getCloudCodeFunctions = getCloudCodeFunctions;
exports.deleteCloudCodeFunction = deleteCloudCodeFunction;