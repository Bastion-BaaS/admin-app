const axios = require('axios');
const HttpError = require('../models/httpError');
const { createURL } = require('../utils/helper');

const getFiles = (req, res, next) => {
  const stackName = req.params.stackName;

  const url = createURL(stackName, '/files')
  return axios.get(url, req.axiosConfig)
    .then(response => res.json(response.data))
    .catch(err => next(new HttpError(err, 500)));
};

const getFile = (req, res, next) => {
  const stackName = req.params.stackName;
  const id = req.params.id;

  const url = createURL(stackName, `/files/${id}`)
  return axios.get(url, req.axiosConfig)
    .then(response => res.json(response.data))
    .catch(err => next(new HttpError(err, 500)));
};

exports.getFile = getFile;
exports.getFiles = getFiles;