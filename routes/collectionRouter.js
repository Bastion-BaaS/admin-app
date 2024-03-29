const express = require ('express');
const collectionRouter = express.Router();
const collectionController = require('../controllers/collectionController');
const { addApiKey } = require('../utils/middleware');

collectionRouter.delete('/:stackName/:name', addApiKey, collectionController.deleteCollection);
collectionRouter.get('/:stackName/', addApiKey, collectionController.getCollections);
collectionRouter.get('/:stackName/:name', addApiKey, collectionController.getCollection);
collectionRouter.post('/:stackName', addApiKey, collectionController.createCollection);

module.exports = collectionRouter;
