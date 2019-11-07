'use strict';
const moment = require('moment');
const pluralize = require('pluralize');
const utilities = require('../../../utilities');
const styles = utilities.views.constants.styles;
const randomKey = Math.random;

module.exports = {
  'containers': {
    '/los/applicationstatuses/new': {
      layout: {
        privileges: [ 101, 102, 103 ],
        component: 'Container',
        props: {},
        children: [ {
          component: 'ResponsiveForm',
          props: {
            // blockPageUI: true,
            // blockPageUILayout: styles.modalBlockPageUILayout,
            flattenFormData: true,
            footergroups: false,
            'onSubmit': {
              url: '/los/api/applicationstatuses?format=json',
              options: {
                method: 'POST',
              },
              successCallback: 'func:window.closeModalAndCreateNotification',
              successProps: {
                text: 'Changes saved successfully!',
                timeout: 10000,
                type: 'success',
              },
              responseCallback: 'func:this.props.refresh',
            },
            validations: [ {
              'name': 'name',
              'constraints': {
                'name': {
                  'presence': {
                    'message': '^Status Name is required.',
                  },
                },
              },
            }, {
              'name': 'active',
              'constraints': {
                'active': {
                  'presence': {
                    'message': '^Active field is required.',
                  },
                },
              },
            },],
            formgroups: [ {
              gridProps: {
                key: randomKey(),
              },
              formElements: [ {
                name: 'name',
                label: 'Status Name',
                errorIconRight: true,
                validateOnBlur: true,
                onBlur: true,
              }, ],
            }, {
              gridProps: {
                key: randomKey(),
              },
              formElements: [{
                name: 'active',
                type: 'dropdown',
                label: 'Active',
                passProps: {
                  selection: true,
                  fluid: true,
                },
                options: [{
                  value: true,
                  label: 'True'
                }, {
                  value: false,
                  label: 'False'
                }]
              },],
            }, {
              gridProps: {
                key: randomKey(),
              },
              formElements: [{
                name: 'status_requirements',
                label: 'Status Requirements',
                type: 'combobox',
              }, ],
            }, {
              gridProps: {
                key: randomKey(),
              },
              formElements: [{
                name: 'filter_categories',
                label: 'Pre-Selected Loan Information Filter Categories',
                type: 'combobox',
              }, ],
            }, {
              gridProps: {
                key: randomKey(),
                className: 'modal-footer-btns',
              },
              formElements: [ {
                type: 'submit',
                value: 'CREATE STATUS',
                passProps: {
                  color: 'isSuccess',
                },
                layoutProps: {},
              }, ],
            },
            ],
          },
          asyncprops: {},
        },
        ],
      },
      'resources': {
        checkdata: {
          url: '/auth/run_checks',
          options: {
            onSuccess: [ 'func:window.redirect', ],
            onError: [ 'func:this.props.logoutUser', 'func:window.redirect', ],
            blocking: true,
            renderOnError: false,
          },
        },
      },
      callbacks: [ 'func:window.setHeaders', ],
      'onFinish': 'render',
    },
  },
};