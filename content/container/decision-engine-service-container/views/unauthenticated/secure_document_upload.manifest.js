'use strict';

const periodic = require('periodicjs');
const utilities = require('../../utilities');
const styles = utilities.views.constants.styles;
const THEMESETTINGS = periodic.settings.container['decision-engine-service-container'];
const randomKey = Math.random;

module.exports = {
  containers: {
    '/secure_customer_document_upload/:id/:org': {
      layout: {
        component: 'div',
        props: {},
        children: [{
          component: 'Container',
          props: {
            className: 'login responsive',
          },
          children: [{
            component: 'Hero',
            props: {
              style: Object.assign({}, styles.pages.login, {
                display: 'block',
              }),
            },
            children: [{
              component: 'HeroBody',
              props: {
                style: {
                  flex: 0,
                  alignSelf: 'center',
                },
              },
              children: [{
                component: 'Box',
                props: {
                  style: {
                    maxWidth: '800px',
                    margin: '0 auto',
                    'borderRadius': '12px',
                    'overflow': 'hidden',
                    'padding': '0',
                    'boxShadow': '0px 0px 90px 10px rgba(17, 17, 17, 0.34)',
                  },
                },
                children: [{
                  component: 'Columns',
                  props: {
                    'isGapless': true,
                    style: {
                      'height': '100%',
                    },
                  },
                  children: [{
                    component: 'Column',
                    props: {
                      size: 'isHalf',
                      style: {
                        'background': 'linear-gradient(30deg, black, grey)',
                      },
                    },
                    children: [{
                      component: 'div',
                      props: {
                        style: {
                          padding: '40px 30px'
                        }
                      },
                      children: [{
                        component: 'Title',
                        props: {
                          size: 'is4',
                          style: {
                            'color': 'white',
                            'fontWeight': '500',
                            fontSize: '28px',
                            marginBottom: '0px',
                          },
                        },
                        asyncprops: {
                          _children: ['data', 'orgName'],
                        },
                      },
                      {
                        component: 'span',
                        props: {
                          style: {
                            display: 'inline-block',
                            'backgroundColor': 'white',
                            'border': '0 none',
                            'color': 'white',
                            'height': '3px',
                            'width': '100px',
                            marginTop: '2rem',
                            marginBottom: '2rem',
                          },
                        },
                      },
                      {
                        component: 'Subtitle',
                        props: {
                          size: 'is6',
                          style: {
                            'color': 'white',
                            'fontWeight': '500',
                            fontSize: '20px',
                            lineHeight: 'normal',
                          },
                        },
                        children: 'Secure File Upload Center',
                      }, ],
                    },
                    {
                      component: 'div',
                      props: {
                        className: 'hide-mobile',
                        style: {
                          'backgroundImage': 'url(/images/elements/orange-graph-lines.svg)',
                          'backgroundSize': '100%',
                          'minWidth': '100%',
                          'flex': '1 1 auto',
                          minHeight: '16.5rem',
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'bottom',
                        },
                      },
                    },
                    ],
                  },
                  {
                    component: 'Column',
                    props: {
                      size: 'isHalf',
                      style: {
                        color: styles.colors.defaultDarkText,
                      },
                    },
                    children: [
                      {
                        component: 'Container',
                        props: {
                          style: {
                            padding: '2rem 1rem',
                          },
                        },
                        children: [{
                          component: 'ul',
                          props: {
                            style: {
                              paddingLeft: '1.5rem',
                              marginBottom: '2rem',
                            },
                          },
                          children: [{
                            component: 'li',
                            children: 'Please upload documents by selecting them below.  To upload multiple documents, repeat the process.',
                          }, {
                            component: 'li',
                            children: 'The following file formats are accepted: .pdf, .txt, .word, .xls, .xlsx, .ppt, .pptx, .png, .jpg, .gif',
                          }, {
                            component: 'li',
                            children: 'The maximum file size is 10MB',
                          }, ],
                        }, {
                          component: 'ResponsiveForm',
                          asyncprops: {
                            formdata: ['data'],
                          },
                          props: {
                            flattenFormData: true,
                            footergroups: false,
                            setInitialValues: false,
                            'onSubmit': {
                              url: '/los/api/applications/:id/secure_customer_document_upload',
                              options: {
                                headers: {},
                                method: 'POST',
                              },
                              params: [{
                                key: ':id',
                                val: 'applicationId',
                              }, ],
                              responseCallback: 'func:window.setHeaders',
                              successCallback: ['func:window.closeModalAndCreateNotification',],
                              successProps: [{
                                text: 'File uploaded successfully!',
                                timeout: 10000,
                                type: 'success',
                              }, {}, ],
                            },
                            hiddenFields: [ {
                              form_name: 'organization',
                              form_val: 'organization',
                            }, ],
                            validations: [],
                            formgroups: [{
                              gridProps: {
                                key: randomKey(),
                              },
                              formElements: [{
                                name: 'file',
                                label: 'File Selection',
                                type: 'file',
                              }, ],
                            }, {
                              gridProps: {
                                key: randomKey(),
                                style: {
                                  textAlign: 'center',
                                  marginTop: '2rem',
                                },
                              },
                              formElements: [{
                                type: 'submit',
                                value: 'UPLOAD DOCUMENT',
                                passProps: {
                                  color: 'isPrimary',
                                },
                                layoutProps: {},
                              }, ],
                            }, ],
                          },
                        }, ],
                      },
                    ],
                  },
                  ],
                }, ],
              }, ],
            }, ],
          }, ],
        }, ],
      },
      'resources': {
        'data': '/los/api/applications/secure_customer_document_upload/:id/:org',
      },
      callbacks: [],
      onFinish: 'render',
      pageData: {
        title: 'DigiFi | Secure Document Upload',
        navLabel: 'Secure Document Upload',
      },
    },
  },
};
