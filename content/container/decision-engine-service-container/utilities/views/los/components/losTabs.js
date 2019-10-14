'use strict';

/** Create Loan Acquisition Platform tabs  */

const appGlobalTabs = require('../../shared/component/appGlobalTabs').appGlobalTabs;

module.exports = function (tabname) {
  let tabs = [ 
  //   {
  //   label: 'Dashboard',
  //   location: '',
  //   icon: 'chart bar',
  // },
    {
      label: 'Applications',
      location: 'applicationsdashboard',
      icon: 'file alternate',
    }, {
      label: 'Customers',
      icon: 'user',
      dropdown: [{
        name: 'Companies',
        icon: 'building',
        location: '/los/companies',
      },
      {
        name: 'People',
        location: '/los/people',
        icon: 'user',
      }, ],
    }, {
      label: 'Intermediaries',
      location: 'intermediaries',
      icon: 'fas fa-seedling',
    }, {
      label: 'Tasks',
      location: 'tasks',
      icon: 'check square',
    }, {
      label: 'Reporting',
      location: 'reporting',
      icon: 'fas fa-robot',
    }, {
      label: 'Settings',
      icon: 'ellipsis horizontal',
      dropdown: [{
        name: 'Workflow Configuration',
        location: '/los/settings/applicationstatuses',
      }, {
        name: 'Task Automation Bots',
        location: '/los/settings/taskbots',
      }, {
        name: 'Application Labels',
        location: '/los/settings/applicationlabels',
      }, {
        name: 'Document Creation Templates',
        location: '/los/settings/templates',
      }, {
        name: 'Loan Product Templates',
        location: '/los/settings/products',
      }, {
        name: 'Customer & Intermediary Templates',
        location: '/los/settings/customer_templates',
      }, 
      ],
    },
  ];
  return appGlobalTabs(tabs, tabname, 'los');
};