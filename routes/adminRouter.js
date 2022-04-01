const express = require ('express');
const adminRouter = express.Router();
const adminController = require('../controllers/adminController');
const { checkAuthenticated } = require('../utils/adminAuth');

adminRouter.post('/login', adminController.login);
adminRouter.post('/logout', adminController.logout);
adminRouter.post('/check', checkAuthenticated, adminController.check);

module.exports = adminRouter;
