'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const scheme = {
  id: ObjectId,
  createdat: {
    type: Date,
    default: Date.now,
  },
  updatedat: {
    type: Date,
    default: Date.now,
  },
  name: {
    index: true,
    type: String,
  },
  description: String,
  active: {
    default: false,
    type: Boolean,
  },
  user: {
    creator: String,
    updater: String,
  },
  organization: {
    index: true,
    type: ObjectId,
    ref: 'Organization',
  },
  status_requirements: [String],
  filter_categories: [String],
};

module.exports = {
  scheme,
  options: {},
  coreDataOptions: {
    track_changes: false,
    docid: [ '_id', ],
    sort: { createdat: -1, },
    search: [ 'name' ],
    population: '',
  },
};