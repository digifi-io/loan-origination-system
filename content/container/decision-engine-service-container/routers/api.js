'use strict';

const periodic = require('periodicjs');
const APIRouter = periodic.express.Router();
const controllers = require('../controllers');
const LAPRouters = require('./lap/index.js');
const apiController = controllers.api;
const ocrController = controllers.ocr;
const authController = controllers.auth;
const clientController = controllers.client;
const fileController = controllers.file;
const paymentController = controllers.payment;
const optimizationController = controllers.optimization;
const mlController = controllers.ml;
const simulationController = controllers.simulation;
const organizationController = controllers.organization;
const integrationController = controllers.integration;
const losController = controllers.los;
const transformController = controllers.transform;
const isClientAuthenticated = periodic.controllers.extension.get('periodicjs.ext.oauth2server').auth.isClientAuthenticated;
const ensureApiAuthenticated = periodic.controllers.extension.get('periodicjs.ext.oauth2server').auth.ensureApiAuthenticated;

APIRouter.get('/api_tabs',
  ensureApiAuthenticated,
  apiController.getVariables,
  transformController.pretransform,
  organizationController.getOrg,
  apiController.apiTabs,
  apiController.sendResponse);

APIRouter.get('/download_request/:format/text_recognition/:id/:type',
  ensureApiAuthenticated,
  authController.adminOnly,
  clientController.getClientByOrg,
  apiController.apiDownload);

APIRouter.get('/download_request/:format/machine_learning/:id/:type',
  ensureApiAuthenticated,
  authController.adminOnly,
  clientController.getClientByOrg,
  mlController.getModel,
  transformController.posttransform,
  apiController.apiDownload);

APIRouter.get('/download_request/:format/rules_engine/:id/:type',
  ensureApiAuthenticated,
  authController.adminOnly,
  clientController.getClientByOrg,
  simulationController.getStrategyDisplayNames,
  integrationController.getDataIntegrations,
  integrationController.initializeStrategyForSimulationCompilation,
  transformController.posttransform,
  apiController.apiDownload);

APIRouter.get('/download_response/:format/:client_id',
  ensureApiAuthenticated,
  authController.adminOnly,
  apiController.apiTabs,
  apiController.apiDownload);

APIRouter.get('/hiddendata',
  ensureApiAuthenticated,
  organizationController.getOrg,
  apiController.hiddenData,
  apiController.sendResponse);

APIRouter.get('/download_api_modal',
  ensureApiAuthenticated,
  integrationController.getStrategies,
  mlController.getCompleteModels,
  transformController.posttransform,
  apiController.sendResponse);

APIRouter.post('/v2/ml_rules_engine',
  isClientAuthenticated,
  transformController.pretransform,
  organizationController.APIgetOrg,
  apiController.checkPublicKey,
  apiController.getApiStrategy,
  integrationController.getDataIntegrations,
  integrationController.getVMParsers,
  integrationController.assignVMParserToDataIntegrations,
  apiController.initializeStrategyForApiCompilation,
  paymentController.checkOrganizationStatus,
  paymentController.setRequestTypeAndCost,
  apiController.stageRequest,
  apiController.fetchAllDocumentTemplatesFromAWS,
  apiController.runApiProcessEngine,
  apiController.formatResponse,
  fileController.createFiles,
  paymentController.stageAPITransactionForCreation,
  paymentController.addTransaction,
  apiController.createCaseRecord,
  transformController.posttransform,
  apiController.sendResponse);

APIRouter.post('/v2/rules_engine_batch',
  isClientAuthenticated,
  transformController.pretransform,
  organizationController.APIgetOrg,
  apiController.checkPublicKey,
  apiController.limitMaxStrategies,
  apiController.batchStageStrategies,
  apiController.getBatchAPIStrategies,
  integrationController.getDataIntegrations,
  apiController.batchInitializeStrategiesForCompilation,
  paymentController.checkOrganizationStatus,
  paymentController.setRequestTypeAndCost,
  integrationController.getVMParsers,
  integrationController.assignVMParserToDataIntegrations,
  apiController.batchRunAPIProcessEngine,
  apiController.batchFormatResponse,
  apiController.createCasesAndBatchRecord,
  paymentController.stageAPITransactionForCreation,
  paymentController.addTransaction,
  transformController.posttransform,
  apiController.sendResponse);

APIRouter.post('/v2/machine_learning_batch',
  isClientAuthenticated,
  transformController.pretransform,
  organizationController.APIgetOrg,
  apiController.checkPublicKey,
  apiController.limitMaxStrategies,
  paymentController.checkOrganizationStatus,
  paymentController.setRequestTypeAndCost,
  mlController.batchGetModels,
  mlController.getBatchApiScoreAnalysisDocs,
  mlController.predictBatchMLCase,
  apiController.batchFormatMLResponse,
  paymentController.stageAPITransactionForCreation,
  paymentController.addTransaction,
  transformController.posttransform,
  apiController.sendResponse);

APIRouter.post('/v2/ml_models',
  isClientAuthenticated,
  organizationController.APIgetOrg,
  apiController.checkPublicKey,
  paymentController.checkOrganizationStatus,
  paymentController.setRequestTypeAndCost,
  transformController.pretransform,
  mlController.getModelByName,
  mlController.getScoreAnalysisDocument,
  apiController.mlVariableCheck,
  mlController.predictSingleMLCase,
  paymentController.stageAPITransactionForCreation,
  paymentController.addTransaction,
  transformController.posttransform,
  apiController.sendResponse);

APIRouter.post('/v2/ocr',
  ocrController.getUploadedDocuments,
  isClientAuthenticated,
  organizationController.APIgetOrg,
  ocrController.checkTemplateFieldsExist,
  ocrController.createLocalPDF,
  ocrController.generateLocalImageFiles,
  ocrController.getTemplate,
  ocrController.retrieveTextExtractionResults,
  paymentController.setRequestTypeAndCost,
  ocrController.cleanTextExtractionResults,
  ocrController.assignFieldsFromTextExtractionResults,
  ocrController.clearTempPDFandImageFiles,
  paymentController.stageAPITransactionForCreation,
  paymentController.addTransaction,
  apiController.formatIndividualOCRResponse,
  apiController.sendResponse);

APIRouter.post('/v2/docusign/:id',
  isClientAuthenticated,
  organizationController.APIgetOrg,
  losController.doc.saveSignedDocusign,
  losController.doc.createDocument,
  apiController.sendSuccess
);

APIRouter.post('/v2/ml_vision',
  isClientAuthenticated,
  organizationController.APIgetOrg,
  apiController.checkPublicKey,
  apiController.checkStrategyExists,
  paymentController.checkOrganizationStatus,
  paymentController.setRequestTypeAndCost,
  apiController.stageRequest,
  paymentController.stageAPITransactionForCreation,
  paymentController.addTransaction,
  apiController.sendResponse);

APIRouter.post('/v2/los/customers',
  isClientAuthenticated,
  transformController.pretransform,
  organizationController.APIgetOrg,
  apiController.checkPublicKey,
  losController.customer.createCustomer,
  losController.customer.updatePrimaryContact,
  apiController.sendResponse);

APIRouter.post('/v2/los/applications',
  isClientAuthenticated,
  organizationController.APIgetOrg,
  apiController.checkPublicKey,
  apiController.getLosProductByName,
  apiController.getLosApplicationLabelsByName,
  transformController.pretransform,
  apiController.createAPIApplication,
  apiController.sendResponse);

APIRouter.use('/v2/lap/applications', LAPRouters.ApplicationRouter);
APIRouter.use('/v2/lap/companies', LAPRouters.CompanyRouter);
APIRouter.use('/v2/lap/communications', LAPRouters.CommunicationRouter);
APIRouter.use('/v2/lap/documents', LAPRouters.DocumentRouter);
APIRouter.use('/v2/lap/intermediaries', LAPRouters.IntermediaryRouter);
APIRouter.use('/v2/lap/people', LAPRouters.PersonRouter);
APIRouter.use('/v2/rules_engine_results', LAPRouters.CaseRouter);
APIRouter.use('/v2/lap/tasks', LAPRouters.TaskRouter);
APIRouter.put('/v2/los/applications/:id',
  isClientAuthenticated,
  organizationController.APIgetOrg,
  apiController.checkPublicKey,
  apiController.updateApplication,
  apiController.sendResponse);

module.exports = APIRouter;