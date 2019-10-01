'use strict';

const guideLinks = {
  models: {
    modelTraining: 'https://docs.digifi.io/docs/model-training-and-evaluation',
    basicInformation:'https://docs.digifi.io/docs/model-training-and-evaluation#section-step-1-basic-information',
    selectType: 'https://docs.digifi.io/docs/model-training-and-evaluation#section-step-2-select-model-type',
    historicalData: 'https://docs.digifi.io/docs/model-training-and-evaluation#section-step-3-upload-historical-data',
    reviewTrain: 'https://docs.digifi.io/docs/model-training-and-evaluation#section-step-4-review-train',
    individualProcessing: 'https://docs.digifi.io/docs/generating-ml-model-predictions#section-interface-processing-individual',
    batchProcessing: 'https://docs.digifi.io/docs/generating-ml-model-predictions#section-interface-processing-batch',
    evaluation: 'https://docs.digifi.io/docs/model-training-and-evaluation#section-model-evaluation',
    modelSelection: 'https://docs.digifi.io/docs/model-training-and-evaluation#section-automl-modeling-process',
  },
  ocr: {
    templates: 'https://docs.digifi.io/docs/templates',
    individualProcessing: 'https://docs.digifi.io/docs/processing-1#section-interface-processing-individual',
    batchProcessing: 'https://docs.digifi.io/docs/processing-1#section-interface-processing-batch',
  },
  rulesEngine: {
    variables: 'https://docs.digifi.io/docs/decision-automation-strategies#section-data-structuring',
    strategies: 'https://docs.digifi.io/docs/decision-automation-strategies#section-creating-a-new-strategy',
    strategiesDetailProcessFlow: 'https://docs.digifi.io/docs/decision-automation-strategies#section-implementing-a-decision-flow',
    strategiesDetailRules: 'https://docs.digifi.io/docs/decision-automation-strategies#section-adding-rules-logic',
    strategiesDetailVersions: 'https://docs.digifi.io/docs/decision-automation-strategies#section-versions-locking',
    individualProcessing: 'https://docs.digifi.io/docs/processing-rules-engine#section-interface-processing-individual',
    batchProcessing: 'https://docs.digifi.io/docs/processing-rules-engine#section-interface-processing-batch',
    APIProcessing: 'https://docs.digifi.io/docs/processing-rules-engine#section-api-processing',
  },
  optimization: {
    '/data_sources': 'https://docs.digifi.io/docs/adding-a-data-source',
    '/data_sources/:id': 'https://docs.digifi.io/docs/adding-a-data-source',
    '/artificialintelligence': 'https://docs.digifi.io/docs/model-training-and-evaluation',
    '/mlmodels/:id': 'https://docs.digifi.io/docs/model-training-and-evaluation',
    '/analysis': 'https://docs.digifi.io/docs/evaluating-predictive-power',
  },
  simulation: {
    '/test_cases': 'https://docs.digifi.io/docs/reusable-cases',
    '/test_cases/:id/detail': 'https://docs.digifi.io/docs/reusable-cases',
    '/simulation': 'https://docs.digifi.io/docs/running-strategies',
    '/analysis': 'https://docs.digifi.io/docs/analyze-results',
  },
  integration: {
    '/dataintegrations': 'https://docs.digifi.io/docs/data-integrations',
    '/dataintegrations/:id/overview': 'https://docs.digifi.io/docs/data-integrations',
    '/dataintegrations/:id/data_setup': 'https://docs.digifi.io/docs/data-integrations',
    '/api_request': 'https://docs.digifi.io/docs/api-request',
    '/api_response': 'https://docs.digifi.io/docs/api-response',
  },
  companySettings: {
    productManagement: 'https://docs.digifi.io/docs/overview-of-company-settings',
    billingManagement: 'https://docs.digifi.io/docs/overview-of-company-settings',
    userManagement: 'https://docs.digifi.io/docs/overview-of-company-settings',
    apiSetup: 'https://docs.digifi.io/docs/api-setup',
  },
  account: {
    profile: 'https://docs.digifi.io/docs/overview-of-my-account',
  },
}; 

module.exports = {
  guideLinks,
};