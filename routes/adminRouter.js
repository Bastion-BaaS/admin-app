const express = require ('express');
const adminRouter = express.Router();
const adminController = require('../controllers/adminController');

adminRouter.post('/login', adminController.login);
adminRouter.post('/logout', adminController.logout);

module.exports = adminRouter;
