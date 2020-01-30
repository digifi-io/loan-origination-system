'use strict';

const AWS = require('aws-sdk');
const periodic = require('periodicjs');
const THEMESETTINGS = periodic.settings.container['decision-engine-service-container'];
const machineLearningSettings = periodic.settings.container['decision-engine-service-container'].machinelearning;
const utilities = require('../utilities');
const mlcrons = utilities.mlcrons;
const Promisie = require('promisie');

class AmazonCloud {
  constructor() {
    this.AWS = AWS;
    this.configure();
    this.useMLCrons();
  }
  
  configure() {
    const aws_configs = periodic.settings.extensions['periodicjs.ext.packagecloud'].client;
    AWS.config.update({
      region: aws_configs.region,
    });
    AWS.config.setPromisesDependency(require('promisie'));
    periodic.aws = {};
    AWS.config.credentials = new AWS.Credentials(THEMESETTINGS.sagemaker.key, THEMESETTINGS.sagemaker.secret, null);
    AWS.config.credentials = new AWS.Credentials(aws_configs.accessKeyId, aws_configs.accessKey, null);
    periodic.aws.s3 = new AWS.S3();
  }
  
  useMLCrons() {
    if (!machineLearningSettings.use_mlcrons) return;
    periodic.aws.sagemaker = new AWS.SageMaker();
    periodic.aws.sagemakerruntime = new AWS.SageMakerRuntime();
    periodic.aws.sagemaker_bucket = THEMESETTINGS.sagemaker.bucket;
    periodic.aws.machinelearning = new AWS.MachineLearning();
    const machinelearning = periodic.aws.machinelearning;
    const s3 = periodic.aws.s3;
    mlcrons.sageMaker();
    mlcrons.digifi();
    mlcrons.modelSelectionUpdater();

    setInterval(() => {
      mlcrons.overallModelUpdater();
    }, 5000);

    setInterval(async () => {
      const redisClient = periodic.app.locals.redisClient;
      const getAllKeys = Promisie.promisify(redisClient.keys).bind(redisClient);
      const getValues = Promisie.promisify(redisClient.hgetall).bind(redisClient);
      const allKeys = await getAllKeys(`${periodic.environment}_ml_preprocessing:*`);
      const allValues = await Promise.all(allKeys.map(key => getValues(key)));
      allValues.forEach(mlmodel => {
        mlcrons.preTrainingProcess({ mlmodel, });
        redisClient.del(`${periodic.environment}_ml_preprocessing:${mlmodel._id.toString()}`);
      });
    }, 15000);
    
    setInterval(() => {
      periodic.app.locals.redisClient.keys(`${periodic.environment}_ml_aws:*`, function (err, model_keys) {
        if (model_keys.length) {
          let data_sources = {};
          let ml_models = {};
          let upload_datasources = {};
          let getValueAsync = (model_key) => new Promise((resolve, reject) => {
            try {
              periodic.app.locals.redisClient.hgetall(model_key, function (err, results) {
                return resolve(results);
              });
            } catch (err) {
              return reject(err);
            }
          });
          let getValues = model_keys.map(model_key => getValueAsync(model_key));
          Promise.all(getValues)
            .then(values => {
              model_keys.forEach((model_key, idx) => {
                let current_model = values[idx];
                if (current_model && current_model.status === 'datasource_cleanup' && !current_model.data_source_training_status) {
                  upload_datasources[current_model._id] = current_model;
                }
                if (current_model && !current_model.model_id) return;
                if (current_model && current_model.data_source_training_status === 'true' && current_model.data_source_testing_status === 'true' && current_model.ml_model_status === 'false') {
                  ml_models[current_model.model_id] = current_model;
                } else if (current_model && (current_model.data_source_training_status === 'false' || current_model.data_source_testing_status === 'false')) {
                  data_sources[current_model.model_id] = current_model;
                } else if (current_model && current_model.data_source_training_status === 'true' && current_model.data_source_testing_status === 'true' && current_model.ml_model_status === 'true') {
                  return;
                }
                mlcrons.checkDataSources(machinelearning, data_sources);
                mlcrons.checkMLModels(machinelearning, ml_models);
                mlcrons.batchUpdater({ s3, machinelearning, });
                mlcrons.modelUpdater();
              });
            });
        } else {
          mlcrons.batchUpdater({ s3, machinelearning, });
          mlcrons.modelUpdater();
        }
      });
    }, machineLearningSettings.cron_interval || 60000);
  }  

  async downloadDocument({ file, }) {
    const s3 = periodic.aws.s3;
    const container_name = periodic.settings.extensions['periodicjs.ext.packagecloud'].container.name;
    const s3Params = {
      Bucket: `${container_name}`,
      Key: file.fileurl,
    };
    return await s3.getObject(s3Params).promise();
  }
}

module.exports = {
  AmazonCloud,
};