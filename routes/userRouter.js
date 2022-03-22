const express = require ('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');
const { addApiKey } = require('../utils/middleware');

userRouter.post('/:stackName/users', addApiKey, userController.createUser);
userRouter.delete('/:stackName/users/:id', addApiKey, userController.deleteUser);
userRouter.get('/:stackName/users', addApiKey, userController.getUsers);
userRouter.get('/:stackName/users/:id', addApiKey, userController.getUser);
userRouter.put('/:stackName/users/:id', addApiKey, userController.putUser);

module.exports = userRouter;