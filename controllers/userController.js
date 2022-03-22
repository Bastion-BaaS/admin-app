const axios = require('axios');
const HttpError = require('../models/httpError');
const { createURL } = require('../utils/helper');

const getUsers = (req, res, next) => {
  const stackName = req.params.stackName;

  const url = createURL(stackName, '/users');
  axios.get(url)
    .then(response => res.json(response.data))
    .catch(err => next(new HttpError(err, 500)));
};

const getUser = (req, res, next) => {
  const stackName = req.params.stackName;
  const id = req.params.id;

  const url = createURL(stackName, `/users/${id}`);
  axios.get(url)
    .then(response => res.json(response.data))
    .catch(err => next(new HttpError(err, 500)));
};

const createUser = (req, res, next) => {
  const stackName = req.params.stackName;

  const url = createURL(stackName, '/users');
  axios.post(url, req.body)
    .then(response => res.status(201).json(response.data))
    .catch(err => next(new HttpError(err, 500)));
};

const putUser = (req, res, next) => {
  const stackName = req.params.stackName;
  const id = req.params.id;

  const url = createURL(stackName, `/users/${id}`);
  axios.put(url, req.body)
    .then(response => res.status(201).json(response.data))
    .catch(err => next(new HttpError(err, 500)));
};

const deleteUser = (req, res, next) => {
  const stackName = req.params.stackName;
  const id = req.params.id;

  const url = createURL(stackName, `/users/${id}`);
  axios.delete(url)
    .then(response => res.status(204).json(response.data))
    .catch(err => next(new HttpError(err, 500)));
};

exports.getUsers = getUsers;
exports.getUser = getUser;
exports.createUser = createUser;
exports.putUser = putUser;
exports.deleteUser = deleteUser;