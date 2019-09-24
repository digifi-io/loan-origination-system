'use strict';

const periodic = require('periodicjs');
const Busboy = require('busboy');
const pdfFiller = require('pdffiller-stream');
const Promisie = require('promisie');
const Bluebird = require('bluebird');
const fs = Promisie.promisifyAll(require('fs-extra'));
const path = require('path');
const logger = periodic.logger;
const THEMESETTINGS = periodic.settings.container['decision-engine-service-container'];
const utilities = require('../../utilities');
const helpers = utilities.helpers;
const transformhelpers = utilities.transformhelpers;

async function updateProduct(req, res, next) {
  try {
    req.controllerData = req.controllerData || {};
    const Product = periodic.datas.get('standard_losproduct');
    const organizationId = req.user && req.user.association && req.user.association.organization && req.user.association.organization._id || null;
    req.controllerData.product = await Product.model.findOneAndUpdate({
      _id: req.params.id,
      organization: organizationId,
    }, req.body, {
      new: true,
    });
    if (!req.controllerData.product) throw new Error('Unable to find a product with this ID');
    return next();
  } catch (err) {
    logger.warn('updateProduct: ', err.message);
    return res.status(400).send({
      message: 'Unable to update product',
    });
  }
}

module.exports = {
  updateProduct,
};