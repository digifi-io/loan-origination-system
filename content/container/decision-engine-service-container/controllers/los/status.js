'use strict';

const periodic = require('periodicjs');
const THEMESETTINGS = periodic.settings.container[ 'decision-engine-service-container' ];
const logger = periodic.logger;
const utilities = require('../../utilities');
const helpers = utilities.helpers;
const transformhelpers = utilities.transformhelpers;

async function retrieveLosStatusesFromOrg(req, res, next) {
  try {
    req.controllerData = req.controllerData || {};
    const LosStatus = periodic.datas.get('standard_losstatus');
    const user = req.user || {};
    const organization = (user && user.association && user.association.organization) ? user.association.organization : {};
    if (organization.los && organization.los.statuses.length) {
      let populatedStatuses = await Promise.all(organization.los.statuses.map(async (id) => {
        return await LosStatus.model.findOne({ _id: id.toString() });
      }))

      populatedStatuses = populatedStatuses.filter(status => Boolean(status.active));
      req.controllerData.los_statuses = populatedStatuses || [];
      next();
    } else {
      res.status(500).send({ message: 'Could not retrieve organization-specific LOS statuses' });
    }
  } catch (e) {
    req.error = e;
    return req;
  }
}

async function getLosStatuses(req, res, next) {
  try {
    req.controllerData = req.controllerData || {};
    const LosStatus = periodic.datas.get('standard_losstatus');
    const user = req.user || {};
    const organization = (user && user.association && user.association.organization && user.association.organization._id) ? user.association.organization._id.toString() : 'organization';
    let populatedStatuses = await LosStatus.model.find({ organization });
    populatedStatuses = populatedStatuses.map(status => status.toJSON ? status.toJSON() : status);
    req.controllerData.los_statuses = populatedStatuses || [];
    next();
  } catch (e) {
    req.error = e;
    return req;
  }
}


async function getLosStatus(req, res, next) {
  try {
    const LosStatus = periodic.datas.get('standard_losstatus');
    const user = req.user || {};
    const organization = (user && user.association && user.association.organization && user.association.organization._id) ? user.association.organization._id.toString() : 'organization';
    const losstatus = await LosStatus.model.findOne({ _id: req.params.id, organization }).lean();
    req.controllerData.losstatus = losstatus;
    next();
  } catch (e) {
    logger.warn(e.message);
    next(e);
  }
}

async function updateLosStatus(req, res, next) {
  try {
    const LosStatus = periodic.datas.get('standard_losstatus');
    const user = req.user || {};
    const organization = (user && user.association && user.association.organization && user.association.organization._id) ? user.association.organization._id.toString() : 'organization';
    if (req.body) {
      req.body.updatedat = new Date();
      await LosStatus.model.updateOne({ _id: req.params.id, organization }, { $set: req.body });
    }
    next();
  } catch (e) {
    logger.warn(e.message);
    next(e);
  }
}

async function updateLosStatusPipelines(req, res, next) {
  try {
    const Organization = periodic.datas.get('standard_organization');
    const user = req.user || {};
    const organization = (user && user.association && user.association.organization && user.association.organization._id) ? user.association.organization._id.toString() : 'organization';
    if (req.body && Array.isArray(req.body.updated_statusrows) && req.body.updated_statusrows.length) {
      const updatedLosStatuses = req.body.updated_statusrows.map(row => row._id.toString());
      await Organization.model.updateOne({ _id: organization }, { $set: { 'los.statuses': updatedLosStatuses }});
    }
    next();
  } catch (e) {
    logger.warn(e.message);
    next(e);
  }
}

async function deleteStatus(req, res, next) {
  try {
    const Status = periodic.datas.get('standard_losstatus');
    req.controllerData = req.controllerData || {};
    await Status.model.deleteOne({ _id: req.params.id });
    next();
  } catch (e) {
    logger.warn(e.message);
    next(e);
  }
}

async function removeStatusFromOrganization(req, res, next) {
  try {
    const Organization = periodic.datas.get('standard_organization');
    req.controllerData = req.controllerData || {};
    const user = req.user || {};
    const organization = (user && user.association && user.association.organization && user.association.organization._id) ? user.association.organization._id.toString() : 'organization';
    if (req.params.id) await Organization.model.updateOne({ _id: organization }, { $pull: { 'los.statuses': req.params.id } });
    next();
  } catch (e) {
    logger.warn(e.message);
    next(e);
  }
}

async function createStatus(req, res, next) {
  try {
    const Status = periodic.datas.get('standard_losstatus');
    req.controllerData = req.controllerData || {};
    const user = req.user || {};
    const organization = (user && user.association && user.association.organization && user.association.organization._id) ? user.association.organization._id.toString() : 'organization';
    let newdoc = req.body;
    newdoc.user = {};
    newdoc.user.creator = `${user.first_name} ${user.last_name}`;
    newdoc.user.updater = `${user.first_name} ${user.last_name}`;
    newdoc.organization = organization;
    let created;
    created = await Status.create({ newdoc: Object.assign({ organization, }, newdoc), });
    req.controllerData.status = created;
    next();
  } catch (e) {
    logger.warn(e.message);
    next(e);
  }
}

async function addStatusToOrganization(req, res, next) {
  try {
    const Organization = periodic.datas.get('standard_organization');
    req.controllerData = req.controllerData || {};
    const user = req.user || {};
    const organization = (user && user.association && user.association.organization && user.association.organization._id) ? user.association.organization._id.toString() : 'organization';
    if (req.controllerData.status) {
      await Organization.model.updateOne({ _id: organization }, { $push: { 'los.statuses': req.controllerData.status._id.toString() }});
    }
    next();
  } catch (e) {
    logger.warn(e.message);
    next(e);
  }
}


module.exports = {
  addStatusToOrganization,
  createStatus,
  deleteStatus,
  retrieveLosStatusesFromOrg,
  getLosStatuses,
  getLosStatus,
  removeStatusFromOrganization,
  updateLosStatus,
  updateLosStatusPipelines,
};