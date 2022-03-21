const axios = require('axios');
const HttpError = require('../models/httpError');
const { createURL } = require('../utils/helper');

const createModel = (req, res, next) => {
  const stackName = req.params.stackName;
  const url = createURL(stackName, '/env');
  axios.get(url)
    .then(response => res.json(response.data))
    .catch(err => next(new HttpError(err, 500)));
};

const deleteModel = (req, res, next) => {
  const id = req.params.id;
  const stackName = req.params;
};

const updateModel = (req, res, next) => {
  const id = req.params.id;
  const stackName = req.params;
};

const getModel = (req, res, next) => {
  const id = req.params.id;
  const stackName = req.params;
};

const getAllModels = (req, res, next) => {
  const stackName = req.params;
};

exports.createModel = createModel;
exports.deleteModel = deleteModel;
exports.updateModel = updateModel;
exports.getModel = getModel;
exports.getAllModels = getAllModels;