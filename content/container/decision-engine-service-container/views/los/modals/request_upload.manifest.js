'use strict';
const moment = require('moment');
const pluralize = require('pluralize');
const utilities = require('../../../utilities');
const styles = utilities.views.constants.styles;
const randomKey = Math.random;

module.exports = {
  'containers': {
    '/los/applications/:id/request_upload': {
      layout: {
        privileges: [ 101, 102, 103 ],
        component: 'Container',
        props: {},
        children: [ {
          component: 'ResponsiveForm',
          asyncprops: {
            formdata: [ 'requestuploaddata', 'data'],
          },
          props: {
            flattenFormData: true,
            footergroups: false,
            setInitialValues: false,
            'onSubmit': {
              url: '/los/api/applications/:id/send_document_upload_request',
              options: {
                headers: {},
                method: 'POST',
              },
              params: [ {
                key: ':id',
                val: 'applicationId',
              }, ],
              responseCallback: 'func:window.setHeaders',
              successCallback: [ 'func:window.closeModalAndCreateNotification', 'func:this.props.refresh' ],
              successProps: [ {
                text: 'Changes saved successfully!',
                timeout: 10000,
                type: 'success',
              }, {} ]
            },
            validations: [ {
              'name': 'from',
              'constraints': {
                'from': {
                  'presence': {
                    'message': '^Sender email is required.',
                  },
                },
              },
            }, {
              'name': 'subject',
              'constraints': {
                'subject': {
                  'presence': {
                    'message': '^Email subject is required.',
                  },
                },
              },
            }, {
              'name': 'email',
              'constraints': {
                'email': {
                  'presence': {
                    'message': '^Email address is required.',
                  },
                },
              },
            }, {
              'name': 'description',
              'constraints': {
                'description': {
                  'presence': {
                    'message': '^Document description is required.',
                  },
                },
              },
            }, ],
            formgroups: [ {
              gridProps: {
                key: randomKey(),
              },
              formElements: [ {
                name: 'from',
                label: 'From',
              },],
            }, {
              gridProps: {
                key: randomKey(),
              },
              formElements: [ {
                name: 'subject',
                label: 'Subject',
              }, ],
            }, {
              gridProps: {
                key: randomKey(),
              },
              formElements: [ {
                name: 'email',
                label: 'Email Address',
              },],
            }, {
              gridProps: {
                key: randomKey(),
              },
              formElements: [ {
                name: 'description',
                label: 'Document Description',
                type: 'textarea'
              },],
            }, {
              gridProps: {
                key: randomKey(),
                className: 'modal-footer-btns',
              },
              formElements: [ {
                type: 'submit',
                value: 'SEND EMAIL',
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
        requestuploaddata: '/los/api/applications/:id/request_upload',
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