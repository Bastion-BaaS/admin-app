const axios = require('axios');
const HttpError = require('../models/httpError');
const { createURL } = require('../utils/helper');

const getCollections = (req, res, next) => {
  const stackName = req.params.stackName;

  const url = createURL(stackName, '/collections');
  return axios.get(url, req.axiosConfig)
    .then(response => res.json(response.data))
    .catch(err => next(new HttpError(err, 500)));
};

const getCollection = (req, res, next) => {
  const stackName = req.params.stackName;
  const name = req.params.name;

  const url = createURL(stackName, `/collections/${name}`);
  return axios.get(url, req.axiosConfig)
    .then(response => res.json(response.data))
    .catch(err => next(new HttpError(err, 500)));
};

const createCollection = (req, res, next) => {
  const stackName = req.params.stackName;

  const url = createURL(stackName, '/collections');
  return axios.post(url, req.body, req.axiosConfig)
    .then(response => res.status(201).json(response.data))
    .catch(err => next(new HttpError(err, 500)));
}

const deleteCollection = (req, res, next) => {
  const stackName = req.params.stackName;
  const name = req.params.name;

  const url = createURL(stackName, `/collections/${name}`);
  return axios.delete(url, req.axiosConfig)
    .then(response => res.status(204).json(response.data))
    .catch(err => next(new HttpError(err, 500)));
};

exports.getCollections = getCollections;
exports.getCollection = getCollection;
exports.createCollection = createCollection;
exports.deleteCollection = deleteCollection;
