const express = require ('express');
const genericRouter = express.Router();
const config = require('../utils/config');
const db = require('../db');
const HttpError = require('../models/httpError');


// ROUTES TO BE REMOVED
const test = (req, res, next) => {
  res.json({ test: 'hi' });
}

const env = (req, res, next) => {
  res.json(config.APP_SERVER_PARAMS);
}

const configureRulePrio = async (req, res, next) => {
  const result = await db.setRulePriority();

  if (result === 'connected') {
    res.json({ status: 'Rule priority configured' });
  } else {
    next(new HttpError(result, 500));
  }
};

genericRouter.get('/', test);
genericRouter.get('/admin/', test);
genericRouter.get('/admin/env', env);
genericRouter.get('/admin/db', configureRulePrio);

module.exports = genericRouter;
