const express = require ('express');
const dataRouter = express.Router();
const dataController = require('../controllers/dataController');

dataRouter.post('/:stackName/:collectionName', dataController.createOne);
dataRouter.delete('/:stackName/:collectionName/:id', dataController.deleteOne);
dataRouter.get('/:stackName/:collectionName', dataController.getAll);
dataRouter.get('/:stackName/:collectionName/:id', dataController.getOne);
dataRouter.put('/:stackName/:collectionName/:id', dataController.putOne);
dataRouter.patch('/:stackName/:collectionName/:id', dataController.patchOne);

module.exports = dataRouter;