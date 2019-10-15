'use strict';

const periodic = require('periodicjs');
const utilities = require('../../../utilities');
const cardprops = utilities.views.shared.props.cardprops;
const styles = utilities.views.constants.styles;
const references = utilities.views.constants.references;
const simpleAsyncHeaderTitle = utilities.views.shared.component.layoutComponents.simpleAsyncHeaderTitle;
const formGlobalButtonBar = utilities.views.shared.component.globalButtonBar.formGlobalButtonBar;
const formElements = utilities.views.shared.props.formElements.formElements;
const losTabs = utilities.views.los.components.losTabs;
const applicationsTabs = utilities.views.los.components.applicationsTabs;
let randomKey = Math.random;

module.exports = {
  containers: {
    '/los/settings/products/:id': {
      layout: {
        component: 'div',
        privileges: [ 101, 102, 103, ],
        props: {
          style: styles.pageContainer,
        },
        children: [
          losTabs('Settings'),
          simpleAsyncHeaderTitle({
            type: 'product',
            title: true,
          }),
          styles.fullPageDivider,
          {
            component: 'Container',
            props: {
            },
            children: [{
              component: 'ResponsiveForm',
              asyncprops: {
                formdata: ['productdata', 'product', ],
                rows: ['productdata', 'product', 'template_info', ],
              },
              props: {
                flattenFormData: true,
                footergroups: false,
                onSubmit: {
                  url: '/los/api/products/:id',
                  'options': {
                    'method': 'PUT',
                  },
                  params: [{
                    key: ':id',
                    val: '_id',
                  }, ],
                  successCallback: ['func:this.props.refresh', 'func:this.props.createNotification', ],
                  successProps: [null, {
                    type: 'success',
                    text: 'Changes saved successfully!',
                    timeout: 10000,
                  }, ],
                },
                validations: [],
                formgroups: [formGlobalButtonBar({
                  left: [],
                  right: [{
                    type: 'submit',
                    value: 'SAVE',
                    passProps: {
                      color: 'isPrimary',
                    },
                    layoutProps: {
                      className: 'global-button-save',
                    },
                  }, ],
                }), {
                  gridProps: {
                    key: randomKey(),
                  },
                  card: {
                    doubleCard: true,
                    leftDoubleCardColumn: {
                      style: {
                        display: 'flex',
                      },
                    },
                    rightDoubleCardColumn: {
                      style: {
                        display: 'flex',
                      },
                    },
                    leftCardProps: cardprops({
                      cardTitle: 'Overview Information',
                      cardStyle: {
                        marginBottom: 0,
                      },
                    }),
                    rightCardProps: cardprops({
                      cardTitle: 'Product Template (Loan Information)',
                      cardStyle: {
                        marginBottom: 0,
                      },
                    }),
                  },
                  formElements: [formElements({
                    twoColumns: true,
                    doubleCard: true,
                    left: [{
                      label: 'Product Name',
                      name: 'name',
                    }, {
                      name: 'customer_type',
                      label: 'Customer Type',
                      type: 'dropdown',
                      passProps: {
                        selection: true,
                        fluid: true,
                        search: false,
                        selectOnBlur: false,
                      },
                      options: [{
                        label: 'Person',
                        value: 'person',
                      }, {
                        label: 'Company',
                        value: 'company',
                      }, ],
                    }, {
                      customLabel: {
                        component: 'span',
                        children: [{
                          component: 'span',
                          children: 'Description',
                        }, {
                          component: 'span',
                          children: 'Optional',
                          props: {
                            style: {
                              fontStyle: 'italic',
                              marginLeft: '2px',
                              fontWeight: 'normal',
                              color: '#969696',
                            },
                          },
                        }, ],
                      },
                      name: 'description',
                      type: 'textarea',
                      placeholder: 'Description',
                      errorIconRight: true,
                      errorIcon: 'fa fa-exclamation',
                    }, {
                      label: 'Created',
                      name: 'createdat',
                      passProps: {
                        state: 'isDisabled',
                      },
                    }, {
                      label: 'Updated',
                      name: 'updatedat',
                      passProps: {
                        state: 'isDisabled',
                      },
                    }, ],
                    right: [{
                      type: 'layout',
                      value: {
                        component: 'div',
                        children: [{
                          component: 'ResponsiveTable',
                          thisprops: {
                            rows: ['rows'],
                          },
                          props: {
                            flattenRowData: true,
                            hasPagination: false,
                            headerLinkProps: {
                              style: {
                                textDecoration: 'none',
                              },
                            },
                            headers: [{
                              label: 'Description',
                              sortid: 'name',
                              sortable: false,
                            }, {
                              label: 'Type',
                              sortid: 'value_type',
                              sortable: false,
                            }, {
                              label: 'Default Value',
                              sortid: 'value',
                              sortable: false,
                            }, {
                              label: ' ',
                              headerColumnProps: {
                                style: {
                                  width: '80px',
                                },
                              },
                              columnProps: {
                                style: styles.buttonCellStyle,
                              },
                              buttons: [{
                                passProps: {
                                  buttonProps: {
                                    icon: 'fa fa-pencil',
                                    className: '__icon_button',
                                  },
                                  onClick: 'func:this.props.createModal',
                                  onclickProps: {
                                    title: 'Edit Item in Template',
                                    pathname: '/los/products/:id/edit_template_item/:idx',
                                    params: [{
                                      key: ':id',
                                      val: '_id',
                                    }, {
                                      key: ':idx',
                                      val: 'idx',
                                    }, ],
                                  },
                                },
                              }, {
                                passProps: {
                                  buttonProps: {
                                    icon: 'fa fa-trash',
                                    color: 'isDanger',
                                    className: '__icon_button',
                                  },
                                  onClick: 'func:this.props.fetchAction',
                                  onclickBaseUrl: '/los/api/products/:id/template/:idx?type=delete_template_item',
                                  onclickLinkParams: [{
                                    key: ':id',
                                    val: '_id',
                                  }, {
                                    key: ':idx',
                                    val: 'idx',
                                  }, ],
                                  fetchProps: {
                                    method: 'PUT',
                                  },
                                  successProps: {
                                    success: {
                                      notification: {
                                        text: 'Changes saved successfully!',
                                        timeout: 10000,
                                        type: 'success',
                                      },
                                    },
                                    successCallback: 'func:this.props.refresh',
                                  },
                                  confirmModal: Object.assign({}, styles.defaultconfirmModalStyle, {
                                    title: 'Delete Strategy',
                                    textContent: [{
                                      component: 'p',
                                      children: 'Do you want to permanently delete this Strategy?',
                                      props: {
                                        style: {
                                          textAlign: 'left',
                                          marginBottom: '1.5rem',
                                        },
                                      },
                                    }, ],
                                  }),
                                },
                              }, ],
                            }, ],
                          },
                        }, {
                          component: 'ResponsiveButton',
                          children: 'ADD ITEM',
                          thisprops: {
                            onclickPropObject: ['formdata'],
                          },
                          props: {
                            onClick: 'func:this.props.createModal',
                            onclickProps: {
                              title: 'Add Item To Template',
                              pathname: '/los/products/:id/add_template_item',
                              params: [{
                                key: ':id',
                                val: '_id',
                              }, ],
                            },
                            buttonProps: {
                              color: 'isSuccess',
                            },
                          },
                        }, ],
                      },
                    }, ],
                  }), ],
                },],
              },
            },
            ],
          },
        ],
      },
      resources: {
        productdata: '/los/api/products/:id',
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
      callbacks: [],
      onFinish: 'render',
      pageData: {
        title: 'DigiFi | Lending CRM',
        navLabel: 'Lending CRM',
      },
    },
  },
};