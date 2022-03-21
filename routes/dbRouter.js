const express = require ('express');
const dbRouter = express.Router();
const dbController = require('../controllers/dbController');

dbRouter.post('/:stackName/createmodel', dbController.createModel);
dbRouter.delete('/:stackName/destroymodel/:id', dbController.deleteModel);
dbRouter.get('/:stackName/getAllModels', dbController.getAllModels);
dbRouter.get('/:stackName/getModel/:id', dbController.getModel);
dbRouter.put('/:stackName/updateModel/:id', dbController.updateModel);

module.exports = dbRouter;