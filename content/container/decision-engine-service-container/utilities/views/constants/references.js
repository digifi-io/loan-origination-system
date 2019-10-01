'use strict';

const guideLinks = {
  models: {
    historicalData: 'https://docs.digifi.io/docs/adding-a-data-source',
    modelTraining: 'https://docs.digifi.io/docs/model-training-and-evaluation',
    evaluation: 'https://docs.digifi.io/docs/evaluating-predictive-power',
    individualProcessing: 'https://docs.digifi.io/docs/individual-processing-1',
    batchProcessing: 'https://docs.digifi.io/docs/batch-processing-1',
    modelSelection: 'https://docs.digifi.io/docs/evaluating-predictive-power',
  },
  vision: {
    templates: 'https://docs.digifi.io/docs/templates',
    individualProcessing: 'https://docs.digifi.io/docs/individual-processing-tr',
    batchProcessing: 'https://docs.digifi.io/docs/batch-processing-tr',
  },
  rulesEngine: {
    variables: 'https://docs.digifi.io/docs/decision-automation-strategies#section-data-structuring',
    // strategies: 'https://docs.digifi.io/docs/creating-editing-strategies',
    strategiesDetailProcessFlow: 'https://docs.digifi.io/docs/decision-automation-strategies#section-implementing-a-decision-flow',
    strategiesDetailRules: 'https://docs.digifi.io/docs/decision-automation-strategies#section-adding-rules-logic',
    strategiesDetailVersions: 'https://docs.digifi.io/docs/decision-automation-strategies#section-versions-locking',
    individualProcessing: 'https://docs.digifi.io/docs/processing-rules-engine#section-interface-processing-individual',
    batchProcessing: 'https://docs.digifi.io/docs/processing-rules-engine#section-interface-processing-batch',
    APIProcessing: 'https://docs.digifi.io/docs/processing-rules-engine#section-api-processing',
  },
  decision: {
    '/strategies/all': 'https://docs.digifi.io/docs/decision-automation-strategies#section-creating-a-new-strategy',
    '/variables/:id/detail': 'https://docs.digifi.io/docs/decision-automation-strategies#section-data-structuring',
    '/strategies/:id/overview': 'https://docs.digifi.io/docs/decision-automation-strategies#section-implementing-a-decision-flow',
    '/strategies/:id/versions': 'https://docs.digifi.io/docs/decision-automation-strategies#section-versions-locking',
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
    myAccount: 'https://docs.digifi.io/docs/overview-of-my-account',
  },
}; 

module.exports = {
  guideLinks,
};