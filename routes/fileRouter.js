const express = require ('express');
const fileRouter = express.Router();
const fileController = require('../controllers/fileController');
const { addApiKey } = require('../utils/middleware');

fileRouter.get('/:stackName', addApiKey, fileController.getFiles);
fileRouter.get('/:stackName/:id', addApiKey, fileController.getFile);

module.exports = fileRouter;