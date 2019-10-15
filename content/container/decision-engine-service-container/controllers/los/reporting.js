'use strict';

const periodic = require('periodicjs');
const THEMESETTINGS = periodic.settings.container[ 'decision-engine-service-container' ];
const logger = periodic.logger;
const utilities = require('../../utilities');
const LOS_CONSTANTS = utilities.constants.LOS;
const AGGREGATION_QUERY_FUNCTIONS = LOS_CONSTANTS.AGGREGATION_QUERY_FUNCTIONS;
const helpers = utilities.helpers;
const transformhelpers = utilities.transformhelpers;
const ObjectId = require('mongodb').ObjectID;

async function getReportingData(req, res, next) {
  try {
    req.controllerData = req.controllerData || {};
    const collectionName = req.query && req.query.collection || 'losapplication';
    const user = req.user || {};
    const organization = (user && user.association && user.association.organization) ? user.association.organization : {};
    const organizationId = (req.params && req.params.org) ? ObjectId(req.params.org) : organization._id;
    const Aggregationmodel = periodic.datas.get(`standard_${collectionName}`);
    const query = req.query || {};
    const aggregationQueryFunction = AGGREGATION_QUERY_FUNCTIONS[`${query.collection || 'losapplication'}`];
    const aggregationQuery = aggregationQueryFunction ? aggregationQueryFunction({ organization: organizationId, ...query }) : null;
    if (aggregationQuery) {
      const aggregateData = await Aggregationmodel.model.aggregate(aggregationQuery);
      req.controllerData.data = aggregateData;
    }
    return next();
  } catch (e) {
    logger.warn('getReportingData:', e.message);
    res.status(500).send({ message: `Error in getReportingData: ${e.message}` });
  }
}

async function getFilterCategories(req, res, next) {
  try {
    req.controllerData = req.controllerData || {};
    if (req.query.filterCategory && req.query.filterCategory !== 'total') {
      const filterCategoryModelName = `standard_los${req.query.filterCategory}`;
      const user = req.user || {};
      const organization = (user && user.association && user.association.organization) ? user.association.organization : {};
      const organizationId = (req.params && req.params.org) ? ObjectId(req.params.org) : organization._id;
      const Filtermodel = periodic.datas.get(filterCategoryModelName);
      const filterDocuments = await Filtermodel.model.find({ organization: organizationId }).lean();
      const [filterCategories, filterCategoryMap] = filterDocuments.reduce((acc, categoryObj) => {
        acc[0].push(categoryObj.name);
        acc[1][categoryObj._id.toString()] = categoryObj.name;
        return acc;
      }, [[], {}]);
      req.controllerData.filterCategories = filterCategories;
      req.controllerData.filterCategoryMap = filterCategoryMap;
    }
    return next();
  } catch (e) {
    logger.warn('getFilterCategories:', e.message);
    res.status(500).send({ message: `Error in getFilterCategories: ${e.message}` });
  }
}

function downloadCSV(req, res) {
  try {
    if (req.controllerData && req.controllerData.download_content) {
      res.set('Content-Type', 'text/csv');
      res.attachment(`${req.controllerData.name}_${new Date()}.csv`);
      res.status(200).send(req.controllerData.download_content).end();
    } else {
      res.status(500).send({ message: 'Could not download reporting data.', });
    }
  } catch (e) {
    res.status(500).send({ message: `Could not download reporting data: ${e.message}`, });
  }
}

module.exports = {
  getFilterCategories,
  getReportingData,
  downloadCSV,
};