const express = require ('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');

userRouter.post('/:stackName/users', userController.createUser);
userRouter.delete('/:stackName/users/:id', userController.deleteUser);
userRouter.get('/:stackName/users', userController.getUsers);
userRouter.get('/:stackName/users/:id', userController.getUser);
userRouter.put('/:stackName/users/:id', userController.putUser);

module.exports = userRouter;