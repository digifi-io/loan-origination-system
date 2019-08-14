'use strict';
//ROUTER ONLY USED IN DEV ENVIRONMENTS
const periodic = require('periodicjs');
const CronRouter = periodic.express.Router();
const controllers = require('../controllers');
const authController = controllers.auth;
const isClientAuthenticated = periodic.controllers.extension.get('periodicjs.ext.oauth2server').auth.isClientAuthenticated;
const ensureApiAuthenticated = periodic.controllers.extension.get('periodicjs.ext.oauth2server').auth.ensureApiAuthenticated;
const paymentCron = require('../crons/run_payments.cron');

CronRouter.get('/payment',
  paymentCron(periodic),
  authController.handleControllerDataResponse);

module.exports = CronRouter;