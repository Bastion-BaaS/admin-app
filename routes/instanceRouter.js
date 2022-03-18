const express = require ('express');
const instanceRouter = express.Router();
const instanceController = require('../controllers/instanceController');

instanceRouter.post('/createBaaS', instanceController.createBaaS);
instanceRouter.delete('/destroyBaaS/:id', instanceController.destroyBaaS);
instanceRouter.get('/getBaaSInstances', instanceController.getBaaSInstances);
instanceRouter.get('/getBaaSInstance/:id', instanceController.getBaaSInstance);

module.exports = instanceRouter;