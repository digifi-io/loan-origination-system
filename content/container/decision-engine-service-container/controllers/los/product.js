'use strict';

const periodic = require('periodicjs');
const Promisie = require('promisie');
const logger = periodic.logger;
const utilities = require('../../utilities');

async function updateProduct(req, res, next) {
  try {
    req.controllerData = req.controllerData || {};
    const Product = periodic.datas.get('standard_losproduct');
    const organization = (req.user && req.user.association && req.user.association.organization) ? req.user.association.organization : null;
    req.controllerData.product = await Product.model.findOneAndUpdate({
      _id: req.params.id,
      organization: organization._id,
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