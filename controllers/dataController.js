const axios = require('axios');
const HttpError = require('../models/httpError');
const { createURL } = require('../utils/helper');

const getAll = (req, res, next) => {
  const stackName = req.params.stackName;
  const collectionName = req.params.collectionName;

};

const getOne = (req, res, next) => {
  const stackName = req.params.stackName;
  const collectionName = req.params.collectionName;
  const id = req.params.id;

};

const createOne = (req, res, next) => {
  const stackName = req.params.stackName;
  const collectionName = req.params.collectionName;

};

const putOne = (req, res, next) => {
  const stackName = req.params.stackName;
  const collectionName = req.params.collectionName;
  const id = req.params.id;

};

const patchOne = (req, res, next) => {
  const stackName = req.params.stackName;
  const collectionName = req.params.collectionName;
  const id = req.params.id;

};

const deleteOne = (req, res, next) => {
  const stackName = req.params.stackName;
  const collectionName = req.params.collectionName;
  const id = req.params.id;

};

exports.getAll = getAll;
exports.getOne = getOne;
exports.createOne = createOne;
exports.putOne = putOne;
exports.patchOne = patchOne;
exports.deleteOne = deleteOne;