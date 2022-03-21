const axios = require('axios');
const HttpError = require('../models/httpError');
const { createURL } = require('../utils/helper');

const getAll = (req, res, next) => {
  const stackName = req.params.stackName;
  const collectionName = req.params.collectionName;

  const url = createURL(stackName, `/data/${collectionName}`);
  axios.get(url)
    .then(response => res.json(response.data))
    .catch(err => next(new HttpError(err, 500)));
};

const getOne = (req, res, next) => {
  const stackName = req.params.stackName;
  const collectionName = req.params.collectionName;
  const id = req.params.id;

  const url = createURL(stackName, `/data/${collectionName}/${id}`);
  axios.get(url)
    .then(response => res.json(response.data))
    .catch(err => next(new HttpError(err, 500)));
};

const createOne = (req, res, next) => {
  const stackName = req.params.stackName;
  const collectionName = req.params.collectionName;

  const url = createURL(stackName, `/data/${collectionName}/${id}`);
  axios.post(url, req.body)
    .then(response => res.status(201).json(response.data))
    .catch(err => next(new HttpError(err, 500)));
};

const putOne = (req, res, next) => {
  const stackName = req.params.stackName;
  const collectionName = req.params.collectionName;
  const id = req.params.id;

  const url = createURL(stackName, `/data/${collectionName}/${id}`);
  axios.put(url, req.body)
    .then(response => res.status(201).json(response.data))
    .catch(err => next(new HttpError(err, 500)));
};

const patchOne = (req, res, next) => {
  const stackName = req.params.stackName;
  const collectionName = req.params.collectionName;
  const id = req.params.id;

  const url = createURL(stackName, `/data/${collectionName}/${id}`);
  axios.patch(url, req.body)
    .then(response => res.status(201).json(response.data))
    .catch(err => next(new HttpError(err, 500)));
};

const deleteOne = (req, res, next) => {
  const stackName = req.params.stackName;
  const collectionName = req.params.collectionName;
  const id = req.params.id;

  const url = createURL(stackName, `/data/${collectionName}/${id}`);
  axios.get(url)
    .then(response => res.status(204).json(response.data))
    .catch(err => next(new HttpError(err, 500)));
};

exports.getAll = getAll;
exports.getOne = getOne;
exports.createOne = createOne;
exports.putOne = putOne;
exports.patchOne = patchOne;
exports.deleteOne = deleteOne;