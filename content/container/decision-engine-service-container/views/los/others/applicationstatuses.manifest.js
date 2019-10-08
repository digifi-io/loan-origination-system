'use strict';

const periodic = require('periodicjs');
const utilities = require('../../../utilities');
const cardprops = utilities.views.shared.props.cardprops;
const styles = utilities.views.constants.styles;
const references = utilities.views.constants.references;
const plainHeaderTitle = utilities.views.shared.component.layoutComponents.plainHeaderTitle;
const plainGlobalButtonBar = utilities.views.shared.component.globalButtonBar.plainGlobalButtonBar;
const losTabs = utilities.views.los.components.losTabs;
let randomKey = Math.random;

module.exports = {
  containers: {
    '/los/others/applicationstatuses': {
      layout: {
        component: 'div',
        privileges: [ 101, 102, 103, ],
        props: {
          style: styles.pageContainer,
        },
        children: [
          losTabs('Other'),
          {
            component: 'div',
            props: {
              style: {
                margin: '1rem 0px 1.5rem',
              },
            },
          },
          plainGlobalButtonBar({
            left: [ {
              component: 'ResponsiveButton',
              props: {
                onClick: 'func:this.props.createModal',
                onclickProps: {
                  title: 'Add Status',
                  pathname: '/los/applicationstatuses/new',
                },
                buttonProps: {
                  color: 'isSuccess',
                },
              },
              children: 'ADD STATUS',
            }, {
              component: 'ResponsiveButton',
              props: {
                onClick: 'func:this.props.createModal',
                onclickProps: {
                  title: 'Add Rejection Type',
                  pathname: '/los/applicationrejectiontypes/new',
                },
                buttonProps: {
                  color: 'isSuccess',
                },
              },
              children: 'ADD REJECTION TYPE',
            }, ],
            right: [],
          }),
          {
            component: 'Container',
            props: {
              style: {
                display: 'flex',
              },
            },
            children: [{
              component: 'ResponsiveForm',
              asyncprops: {
                formdata: ['data',],
              },
              hasWindowFunc: true,
              props: {
                style: {
                  // width: '70%',
                },
                ref: 'func:window.addRef',
                flattenFormData: true,
                footergroups: false,
                useFormOptions: true,
                onChange: 'func:window.checkPopulation',
                onSubmit: {
                  url: '/los/api/applicationstatuses/configure_application_statuses',
                  options: {
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    method: 'PUT',
                  },
                  successProps: {
                    type: 'success',
                    text: 'Changes saved successfully!',
                    timeout: 10000,
                  },
                  successCallback: 'func:window.editFormSuccessCallback',
                },
                formgroups: [{
                  gridProps: {
                    key: randomKey(),
                    // className: 'minimum_rules',
                  },
                  card: {
                    props: cardprops({
                      cardTitle: 'Application Statuses',
                    }),
                  },
                  formElements: [
                    {
                      type: 'layout',
                      name: 'updated_statusrows',
                      value: {
                        component: 'div',
                      },
                    },
                    {
                      type: 'dndtable',
                      name: 'statusrows',
                      hasWindowFunction: true,
                      submitOnChange: true,
                      handleRowUpdate: 'func:window.handleRowUpdate',
                      flattenRowData: true,
                      useInputRows: false,
                      addNewRows: false,
                      passProps: {
                        className: 'dnd-text-table',
                        itemHeight: 45,
                      },
                      ignoreTableHeaders: ['_id', ],
                      headers: [{
                        label: 'Order',
                        headerColumnProps: {
                          // style: {
                          //   width: '30%'
                          // },
                        },
                        columnProps: {
                          style: {
                            overflow: 'visible',
                          },
                        },
                        sortid: 'order',
                        sortable: true,
                      },
                      {
                        label: 'Status Name',
                        sortid: 'name',
                        sortable: true,
                      }, {
                        label: 'Description',
                        sortid: 'description',
                        sortable: true,
                      }, {
                        label: 'Last Updated',
                        sortid: 'updatedat',
                        sortable: true,
                      }, {
                        label: 'Pipeline Display',
                        sortid: 'active',
                        sortable: true,
                      }, {
                        label: ' ',
                        sortid: 'buttons',
                        sortable: false,
                        columnProps: {
                          style: {
                            width: '90px',
                            // textAlign: 'left',
                          },
                        },
                      }, ],
                    }, ],
                }, ],
              },
            }, {
              component: 'ResponsiveCard',
              props: cardprops({
                cardTitle: 'Rejection Types',
                cardStyle: {
                  width: '30%',
                  minWidth: '30%',
                  marginLeft: '10px',
                },
              }),
              children: [ {
                component: 'ResponsiveTable',
                props: {
                  flattenRowData: true,
                  limit: 20,
                  hasPagination: false,
                  // simplePagination: true,
                  headerLinkProps: {
                    style: {
                      textDecoration: 'none',
                      // color: styles.colors.darkGreyText,
                    },
                  },
                  headers: [ {
                    label: 'Rejection Type',
                    sortid: 'type',
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
                    buttons: [ {
                      passProps: {
                        buttonProps: {
                          icon: 'fa fa-pencil',
                          className: '__icon_button',
                        },
                        onClick: 'func:this.props.createModal',
                        onclickProps: {
                          title: 'Edit Rejection Type',
                          pathname: '/los/applicationrejectiontypes/:orgid/:index',
                          params: [ { key: ':orgid', val: 'orgid', }, { key: ':index', val: 'index', }, ],
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
                        onclickBaseUrl: '/los/api/applicationrejectiontypes/:orgid/:index?method=delete',
                        onclickLinkParams: [ { key: ':orgid', val: 'orgid', }, { key: ':index', val: 'index', }, ],
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
                          title: 'Delete Rejection Type',
                          textContent: [ {
                            component: 'p',
                            children: 'Do you want to permanently delete this Rejection Type?',
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
                  },],
                },
                asyncprops: {
                  'rows': [
                    'data', 'rejectionrows',
                  ],
                  'numPages': [
                    'data', 'rejectionNumPages',
                  ],
                  'numItems': [
                    'data', 'rejectionNumItems',
                  ],
                },
              },
              ],
            },],
          },
        ],
      },
      resources: {
        data: '/los/api/applicationstatuses?paginate=true',
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
      callbacks: [ 'func:window.updateGlobalSearchBar', ],
      onFinish: 'render',
      pageData: {
        title: 'DigiFi | Loan Acquisition Platform',
        navLabel: 'Loan Acquisition Platform',
      },
    },
  },
};