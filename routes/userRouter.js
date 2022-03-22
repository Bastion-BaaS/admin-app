const express = require ('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');
const { addApiKey } = require('../utils/middleware');

userRouter.post('/:stackName', addApiKey, userController.createUser);
userRouter.delete('/:stackName/:id', addApiKey, userController.deleteUser);
userRouter.get('/:stackName', addApiKey, userController.getUsers);
userRouter.get('/:stackName/:id', addApiKey, userController.getUser);
userRouter.put('/:stackName/:id', addApiKey, userController.putUser);

module.exports = userRouter;