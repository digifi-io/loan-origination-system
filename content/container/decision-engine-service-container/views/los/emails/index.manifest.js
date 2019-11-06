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
    '/los/emails': {
      layout: {
        component: 'div',
        privileges: [101, 102, 103, ],
        props: {
          style: styles.pageContainer,
        },
        children: [
          losTabs('emails'),
          {
            component: 'div',
            props: {
              style: {
                margin: '1rem 0px 1.5rem',
              },
            },
          },
          plainGlobalButtonBar({
            left: [{
              component: 'ResponsiveButton',
              asyncprops: {
                onclickPropObject: ['taskdata', 'application', ],
              },
              props: {
                onClick: 'func:this.props.createModal',
                onclickProps: {
                  title: 'Send Email',
                //   pathname: '/los/tasks/new',
                //   params: [{ key: ':id', val: '_id', }, ],
                },
                buttonProps: {
                  color: 'isSuccess',
                },
              },
              children: 'SEND EMAIL',
            }, ],
            right: [
            ],
          }),
          {
            component: 'Container',
            props: {
              style: {},
            },
            children: [{
              component: 'ResponsiveCard',
              props: cardprops({
                cardTitle: 'Email History',
              }),
              children: [{
                component: 'ResponsiveTable',
                asyncprops: {
                  rows: ['taskdata', 'rows', ],
                  numItems: ['taskdata', 'numItems', ],
                  numPages: ['taskdata', 'numPages', ],
                  filterButtons: ['taskdata', 'filterButtons', ],
                },
                props: {
                  useRowProps: true,
                  label: ' ',
                  dataMap: [{
                    'key': 'rows',
                    value: 'rows',
                  }, {
                    'key': 'numItems',
                    value: 'numItems',
                  }, {
                    'key': 'numPages',
                    value: 'numPages',
                  },
                  ],
                  limit: 50,
                  filterSearch: true,
                  simplePagination: true,
                  useHeaderFilters: true,
                  hasPagination: true,
                  calculatePagination: true,
                  baseUrl: '/los/api/tasks?paginate=true',
                  flattenRowData: true,
                  useInputRows: true,
                  addNewRows: false,
                  'tableSearch': true,
                  'simpleSearchFilter': true,
                  filterSearchProps: {
                    icon: 'fa fa-search',
                    hasIconRight: false,
                    className: 'global-table-search',
                    placeholder: 'SEARCH EMAILS',
                  },
                  ignoreTableHeaders: ['_id', ],
                  headers: [{
                    label: 'Date',
                    sortid: 'date',
                    sortable: false,
                  }, {
                    label: 'From',
                    sortid: 'from',
                    sortable: false,
                    headerColumnProps: {
                      style: {
                        // width: '15%',
                      },
                    },
                    columnProps: {
                      style: {
                      },
                    },
                  }, {
                    label: 'To',
                    sortid: 'to',
                    sortable: false,
                  }, {
                    label: 'Subject',
                    sortid: 'subject',
                    sortable: false,
                  }, {
                    label: 'Body',
                    sortid: 'body',
                    sortable: false,
                  }, {
                    label: '',
                    sortid: 'attachement',
                    sortable: false,
                  }, 
                  {
                    label: '',
                    headerColumnProps: {
                      style: {
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
                        // onClick: 'func:this.props.createModal',
                        // onclickProps: {
                        //   title: 'Edit Task',
                        //   pathname: '/los/tasks/:id',
                        //   params: [{ 'key': ':id', 'val': '_id', }, ],
                        // },
                      },
                    }, {
                      passProps: {
                        buttonProps: {
                          icon: 'fas fa-reply',
                          className: '__icon_button green',
                        },
                        // onClick: 'func:this.props.fetchAction',
                        // onclickBaseUrl: '/los/api/tasks/:id?done=true',
                        onclickLinkParams: [{ 'key': ':id', 'val': '_id', }, ],
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
                      },
                    }, {
                      passProps: {
                        buttonProps: {
                          icon: 'fa fa-trash',
                          color: 'isDanger',
                          className: '__icon_button',
                        },
                        onClick: 'func:this.props.fetchAction',
                        onclickBaseUrl: '/los/api/email/:id',
                        onclickLinkParams: [{ 'key': ':id', 'val': '_id', }, ],
                        fetchProps: {
                          method: 'DELETE',
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
                          title: 'Delete Task',
                          textContent: [{
                            component: 'p',
                            children: 'Do you want to delete this task?',
                            props: {
                              style: {
                                textAlign: 'left',
                                marginBottom: '1.5rem',
                              },
                            },
                          },
                          ],
                        }),
                      },
                    },
                    ],
                  },
                  ],
                },
              }, ],
            }, ],
          },
        ],
      },
      resources: {
        checkdata: {
          url: '/auth/run_checks',
          options: {
            onSuccess: ['func:window.redirect', ],
            onError: ['func:this.props.logoutUser', 'func:window.redirect', ],
            blocking: true,
            renderOnError: false,
          },
        },
      },
      callbacks: ['func:window.updateGlobalSearchBar', ],
      onFinish: 'render',
      pageData: {
        title: 'DigiFi | Lending CRM',
        navLabel: 'Lending CRM',
      },
    },
  },
};