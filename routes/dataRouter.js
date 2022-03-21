const express = require ('express');
const dataRouter = express.Router();
const dataController = require('../controllers/dataController');

dbRouter.post('/:stackName/createOne', dataController.createOne);
dbRouter.delete('/:stackName/deleteOne/:id', dataController.deleteOne);
dbRouter.get('/:stackName/getAll', dataController.getAll);
dbRouter.get('/:stackName/getOne/:id', dataController.getOne);
dbRouter.put('/:stackName/putOne/:id', dataController.putOne);
dbRouter.patch('/:stackName/patchOne/:id', dataController.patchOne);

module.exports = dataRouter;