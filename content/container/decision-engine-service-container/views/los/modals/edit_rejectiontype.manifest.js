'use strict';
const moment = require('moment');
const pluralize = require('pluralize');
const utilities = require('../../../utilities');
const styles = utilities.views.constants.styles;
const randomKey = Math.random;

module.exports = {
  'containers': {
    '/los/applicationrejectiontypes/:orgid/:index': {
      layout: {
        privileges: [ 101, 102, 103 ],
        component: 'Container',
        props: {},
        children: [ {
          component: 'ResponsiveForm',
          asyncprops: {
            formdata: [ 'rejectiondata', 'rejectiontype' ],
          },
          props: {
            blockPageUI: true,
            blockPageUILayout: styles.modalBlockPageUILayout,
            flattenFormData: true,
            footergroups: false,
            setInitialValues: false,
            'onSubmit': {
              url: '/los/api/applicationrejectiontypes/:orgid/:index?method=edit',
              options: {
                headers: {},
                method: 'PUT',
              },
              params: [ {
                key: ':orgid',
                val: 'orgid',
              }, {
                key: ':index',
                val: 'index',
              } ],
              responseCallback: 'func:window.setHeaders',
              successCallback: [ 'func:window.closeModalAndCreateNotification', 'func:this.props.refresh' ],
              successProps: [ {
                text: 'Changes saved successfully!',
                timeout: 10000,
                type: 'success',
              }, {} ]
            },
            validations: [],
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
                value: 'SAVE CHANGES',
                passProps: {
                  color: 'isPrimary',
                },
                layoutProps: {},
              },
              ],
            },
            ],
          },
        },
        ],
      },
      'resources': {
        rejectiondata: '/los/api/applicationrejectiontypes/:orgid/:index?',
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