const express = require ('express');
const dbRouter = express.Router();
const dbController = require('../controllers/dbController');

dbRouter.post('/createmodel', dbController.createModel);
dbRouter.delete('/destroymodel/:id', dbController.deleteModel);
dbRouter.get('/getAllModels', dbController.getAllModels);
dbRouter.get('/getModel/:id', dbController.getModel);
dbRouter.put('/updateModel/:id', dbController.updateModel);

module.exports = dbRouter;