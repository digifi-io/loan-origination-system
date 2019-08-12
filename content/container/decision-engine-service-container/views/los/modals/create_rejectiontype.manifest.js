'use strict';
const moment = require('moment');
const pluralize = require('pluralize');
const utilities = require('../../../utilities');
const styles = utilities.views.constants.styles;
const randomKey = Math.random;

module.exports = {
  'containers': {
    '/los/applicationrejectiontypes/new': {
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
              url: '/los/api/applicationrejectiontypes',
              options: {
                headers: {},
                method: 'POST',
              },
              responseCallback: 'func:window.setHeaders',
              successCallback: [ 'func:window.closeModalAndCreateNotification', 'func:this.props.refresh' ],
              successProps: [ {
                text: 'Changes saved successfully!',
                timeout: 10000,
                type: 'success',
              }, {} ]
            },
            validations: [ {
              'name': 'value',
              'constraints': {
                'value': {
                  'presence': {
                    'message': '^Rejection Type is required.',
                  },
                },
              },
            }, ],
            formgroups: [ {
              gridProps: {
                key: randomKey(),
              },
              formElements: [ {
                name: 'value',
                label: 'Rejection Type',
              },],
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
            },],
          },
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