const express = require ('express');
const cloudCodeRouter = express.Router();
const cloudCodeController = require('../controllers/cloudCodeController');

cloudCodeRouter.delete('/:stackName/:id', cloudCodeController.deleteCloudCodeFunction);
cloudCodeRouter.get('/:stackName/', cloudCodeController.getCloudCodeFunctions);
cloudCodeRouter.post('/:stackName', cloudCodeController.createCloudCodeFunction);

module.exports = cloudCodeRouter;