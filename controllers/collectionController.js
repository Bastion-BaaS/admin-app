const axios = require('axios');
const HttpError = require('../models/httpError');

const createURL = (stackName, path) => {
  return `http://app-server.${stackName}:3001/server/${stackName}${path}`;
};

const getCollections = (req, res, next) => {
  const stackName = req.params.stackName;

};

const getCollection = (req, res, next) => {
  const stackName = req.params.stackName;
  const id = req.params.id;

};

const deleteCollection = (req, res, next) => {
  const stackName = req.params.stackName;
  const id = req.params.id;

};

exports.getCollections = getCollections;
exports.getCollection = getCollection;
exports.deleteCollection = deleteCollection;