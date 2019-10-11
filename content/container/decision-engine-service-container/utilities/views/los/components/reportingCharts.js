'use strict';
const CONSTANTS = require('../../../constants');
const capitalize = require('capitalize');
const moment = require('moment');
const numeral = require('numeral');
const util = require('util');
const COLORS = [ '#007aff', '#5c198e', '#00b050', '#68d7e3', '#ffa13b', '#ff6f72', ];
const LABELMAP = {
  'count': 'Application Count',
  'volume': 'Application Volume ($)'
}
const PROVIDER_LABEL = require('../../../constants/ml').PROVIDER_LABEL;
const PROVIDER_COLORS = require('../../../constants/ml').PROVIDER_COLORS;

function __generateApplicationDates(frequency) {
  const currentDate = new Date();
  switch (frequency) {
    case 'daily': 
      currentDate.setDate(currentDate.getDate() - 30); // sets to 30 days ago
      return Array.from({ length: 30}, (_, i) => { 
        currentDate.setDate(currentDate.getDate() + 1);
        return moment(currentDate).format('MM/DD/YYYY');
      });
    case 'monthly': 
      currentDate.setMonth(currentDate.getMonth() - 12); // sets to 12 months ago
      return Array.from({ length: 12}, (_, i) => { 
        currentDate.setMonth(currentDate.getMonth() + 1);
        return moment(currentDate).format('MM/YY');
      });
    case 'yearly': 
      currentDate.setYear(currentDate.getYear() - 5); // set to 5 years ago
      return Array.from({ length: 5}, (_, i) => {
        currentDate.setYear(currentDate.getYear() + 1);
        return moment(currentDate).format('YYYY');
      });
  }
}

function __generateDataMap(data, baseDataRow = {}) {
  return data.reduce((acc, row) => {
    const { date, filterCategory } = row._id;
    acc[date] = acc[date] || { ...baseDataRow };
    acc[date][filterCategory] = row.outputVal;
    return acc;
  }, {});
}

function generateReportingChart(options) {
  const { legend = true, measurement = 'volume', frequency = 'daily', filterCategories = ['New Opportunities', 'Data Gathering', 'Legal Documentation', 'Approved'], data = [{ 
    "_id" : {
      "date" : "10/10/2019",
      "filterCategory" : "New Opportunities"
    },
    "outputVal" : 165000
  }, { 
    "_id" : {
      "date" : "10/10/2019",
      "filterCategory" : "Data Gathering"
    },
    "outputVal" : 2000000
  }, { 
    "_id" : {
      "date" : "10/08/2019",
      "filterCategory" : "New Opportunities"
    },
    "outputVal" : 135000
  }, { 
    "_id" : {
      "date" : "10/07/2019",
      "filterCategory" : "Legal Documentation"
    },
    "outputVal" : 200000
  }, { 
    "_id" : {
      "date" : "10/06/2019",
      "filterCategory" : "Approved"
    },
    "outputVal" : 305000
  }, { 
    "_id" : {
      "date" : "10/05/2019",
      "filterCategory" : "Legal Documentation"
    },
    "outputVal" : 1000
  }, { 
    "_id" : {
      "date" : "10/04/2019",
      "filterCategory" : "Approved"
    },
    "outputVal" : 25000
  }, { 
    "_id" : {
      "date" : "10/03/2019",
      "filterCategory" : "Data Gathering"
    },
    "outputVal" : 1000000
  }] } = options;
  const baseDataRow = {
    date: null,
  }
  filterCategories.forEach((category) => baseDataRow[category] = null);
  const dataMap = __generateDataMap(data, baseDataRow);
  const chartData = __generateApplicationDates(frequency).map((date, i) => Object.assign({}, dataMap[date], { date }));
  const chartBars = filterCategories.map((categoryName, i) => {
    return {
      component: 'recharts.Bar',
      props: {
        dataKey: categoryName,
        name: categoryName,
        stackId: 'a',
        fill: COLORS[i],
        isAnimationActive: true,
      },
      children: [{
        component: 'recharts.Cell',
        props: {
          // fill: '#ccc',
        },
      }],
    }
  })

  return [{
    component: 'recharts.BarChart',
    props: {
      width: 980,
      height: 500,
      maxBarSize: 100,
      barCategoryGap: '10%',
      data: chartData,
    },
    children: [
      (legend) ? {
        component: 'recharts.Legend',
        props: {
          iconType: 'square',
          width: 150,
          style: {
          },
        },
      } : {},
      {
        component: 'recharts.XAxis',
        hasWindowComponent: true,
        props: {
          dataKey: 'date',
          interval: 0,
          tick: 'func:window.__ra_custom_elements.CustomAxisTick',
          windowCompProps: {
            // numTicks: 2,
          },
          label: {
            value: 'Application Date',
            offset: 0,
            // position: 'insideLeft',
          },
        },
      }, {
        component: 'recharts.YAxis',
        hasWindowFunc: true,
        props: {
          tickCount: 5,
          // domain: [ 0, yMax, ],
          allowDataOverflow: true,
          // tickFormatter: 'func:window.chartPercentageFormatter',
          label: {
            value: LABELMAP[measurement],
            angle: '-90',
            offset: 0,
            position: 'insideLeft',
          },
        },
      }, {
        component: 'recharts.Tooltip',
        hasWindowFunc: true,
        props: {
          // formatter: 'func:window.chartPercentageFormatter',
          itemSorter: 'func:window.tooltipItemSorter',
          itemStyle: {
            margin: 0,
            padding: 0,
          },
        },
      }, ...chartBars ],
  }]
}

module.exports = {
  generateReportingChart,
}