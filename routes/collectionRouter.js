const express = require ('express');
const collectionRouter = express.Router();
const collectionController = require('../controllers/collectionController');

collectionRouter.delete('/:stackName/:id', collectionController.deleteCollection);
collectionRouter.get('/:stackName/', collectionController.getCollections);
collectionRouter.get('/:stackName/:id', collectionController.getCollection);

module.exports = collectionRouter;