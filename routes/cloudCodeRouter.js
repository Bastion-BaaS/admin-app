const express = require ('express');
const cloudCodeRouter = express.Router();
const cloudCodeController = require('../controllers/cloudCodeController');
const { addApiKey } = require('../utils/middleware');

cloudCodeRouter.delete('/:stackName/:ccfName', addApiKey, cloudCodeController.deleteCloudCodeFunction);
cloudCodeRouter.get('/:stackName', addApiKey, cloudCodeController.getCloudCodeFunctions);
cloudCodeRouter.post('/:stackName', addApiKey, cloudCodeController.createCloudCodeFunction);

module.exports = cloudCodeRouter;
