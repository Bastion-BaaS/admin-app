const express = require ('express');
const instanceRouter = express.Router();
const instanceController = require('../controllers/instanceController');

instanceRouter.post('/', instanceController.createBaaS);
instanceRouter.delete('/:stackName', instanceController.destroyBaaS);
instanceRouter.get('/', instanceController.getBaaSInstances);
instanceRouter.get('/:stackName', instanceController.getBaaSInstance);

module.exports = instanceRouter;