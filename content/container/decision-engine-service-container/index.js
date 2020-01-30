'use strict';
const periodic = require('periodicjs');
var CronJob = require('cron').CronJob;
const utilities = require('./utilities');
const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const numeral = require('numeral');
const Promisie = require('promisie');
const readFile = Promisie.promisify(fs.readFile);
const writeFile = Promisie.promisify(fs.writeFile);
const logger = periodic.logger;
const exec = require('child_process').exec;
const THEMESETTINGS = periodic.settings.container[ 'decision-engine-service-container' ];
const redis = require('redis');
const CREDIT_PIPELINE = require('@digifi-los/credit-process');
const util = require('util');
const AmazonCloud = require('./cloud').AmazonCloud;
let os = require('os');
const mongodb = require('mongodb');
const streamBuffers = require('stream-buffers');
const ObjectId = mongodb.ObjectID;
const hostname = os.hostname();
let vision;

const mlcrons = utilities.mlcrons;
let credit_engine = CREDIT_PIPELINE(periodic);
require('convertjson2xml').singleton({
  trim: true,
  hideUndefinedTag: true,
  nullValueTag: 'full',
  emptyStringTag: 'full',
});

function promisifyClientConnect(uri, db) {
  return new Promise((resolve, reject) => {
    try {
      const client = new mongodb.MongoClient(THEMESETTINGS.gridfs.uri, { useNewUrlParser : true });
      client.connect(async function (err) {
        if (err) logger.warn(err);
        else {
          const db = client.db(THEMESETTINGS.gridfs.db);
          const bucket = new mongodb.GridFSBucket(db);
          periodic.gridfs = { db, bucket };
          return resolve(true);
        }
      })
    } catch (err) {
      return reject(err)
    }
  });
}

module.exports = () => {
  periodic.status.on('configuration-complete', async (status) => {
    await promisifyClientConnect(THEMESETTINGS.gridfs.uri, THEMESETTINGS.gridfs.db);
    let reactAppSettings = periodic.settings.extensions[ '@digifi-los/reactapp' ];
    let port = reactAppSettings.session.port;
    let host = reactAppSettings.session.host;
    periodic.app.locals.redisClient = redis.createClient(port, host);
    periodic.app.locals.redisClient.auth(reactAppSettings.session.auth, (err, res) => logger.warn);
    periodic.app.locals.redisClient.on('connect', () => {
      logger.silly('REDIS CONNECTED');
    });
    let updateGlobalRulesVariables = require('./crons/update_rules_variables.cron')(periodic);    
    updateGlobalRulesVariables();

    let basename = periodic.settings.extensions[ 'periodicjs.ext.reactapp' ].basename;
    periodic.app.locals.THEMESETTINGS = Object.assign(THEMESETTINGS, {
      basename,
    });
    const cloudProviders = {
      AWS: AmazonCloud,
      Azure: null,
    };
    periodic.app.locals.strategiesCache = {};

    let servers = periodic.servers;
    let httpServer = servers.get('http')
    let httpsServer = servers.get('https')
    httpServer.keepAliveTimeout = 0;
    httpsServer.keepAliveTimeout = 0;
    periodic.servers.set('http', httpServer);
    periodic.servers.set('https', httpsServer);
    const cloudProvider = cloudProviders[process.env.CLOUD || 'AWS'];
    periodic.cloud = new cloudProvider();

    let googleVisionSettings = periodic.settings.container[ 'decision-engine-service-container' ].googlevision;
    window.process = global.process;
    vision = require('@google-cloud/vision').v1p3beta1;
    periodic.googlevision = new vision.ImageAnnotatorClient({
      credentials: {
        client_email: googleVisionSettings.client_email,
        private_key: googleVisionSettings.key,
      },
      projectId: googleVisionSettings.project_id,
    });

    exec('npm run sass', (err, stdout, stderr) => {
      if (err) logger.error('Unable to npm run sass', err);
      logger.silly(`stdout: ${stdout}`);
      logger.silly(`stderr: ${stderr}`);
    });
    exec('npm run watch', (err, stdout, stderr) => {
      if (err) logger.error('Unable to npm run watch', err);
      logger.silly(`stdout: ${stdout}`);
      logger.silly(`stderr: ${stderr}`);
    });
  });
  return Promise.resolve();
};
