const express = require ('express');
const dataRouter = express.Router();
const dataController = require('../controllers/dataController');
const { addApiKey } = require('../utils/middleware');

dataRouter.post('/:stackName/:collectionName', addApiKey, dataController.createOne);
dataRouter.delete('/:stackName/:collectionName/:id', addApiKey, dataController.deleteOne);
dataRouter.get('/:stackName/:collectionName', addApiKey, dataController.getAll);
dataRouter.get('/:stackName/:collectionName/:id', addApiKey, dataController.getOne);
dataRouter.put('/:stackName/:collectionName/:id', addApiKey, dataController.putOne);
dataRouter.patch('/:stackName/:collectionName/:id', addApiKey, dataController.patchOne);

module.exports = dataRouter;