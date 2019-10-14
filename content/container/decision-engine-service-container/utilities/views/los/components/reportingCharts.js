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
        return moment(currentDate).format('MM/YYYY');
      });
    case 'yearly': 
      currentDate.setFullYear(currentDate.getFullYear() - 5); // set to 5 years ago
      return Array.from({ length: 5}, (_, i) => {
        currentDate.setFullYear(currentDate.getFullYear() + 1);
        return moment(currentDate).format('YYYY');
      });
  }
}

function __generateDataMap(data, baseDataRow = {}, filterCategoryMap) {
  return data.reduce((acc, row, i) => {
    const { date, filterCategory = null } = row._id;
    acc[date] = acc[date] || { ...baseDataRow, date };
    if (filterCategory) {
      const categoryName = filterCategoryMap[filterCategory] || `Other_${i}`;
      acc[date][categoryName] = row.outputVal;
    } else {
      acc[date]['Total'] = row.outputVal;
    }
    return acc;
  }, {});
}

function generateReportingChart(options) {
  try {

    const { legend, measurement, frequency, filterCategories, data, filterCategoryMap } = options;
    const baseDataRow = {};
    filterCategories.forEach((category) => baseDataRow[category] = 0);
    const dataMap = __generateDataMap(data, baseDataRow, filterCategoryMap);
    const chartData = __generateApplicationDates(frequency).map((date, i) => dataMap[date] || { date, ...baseDataRow });
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
        width: 1250,
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
              dy: 60,
            },
          },
        }, {
          component: 'recharts.YAxis',
          hasWindowFunc: true,
          props: {
            tickCount: 5,
            // domain: [ 0, yMax, ],
            allowDataOverflow: true,
            tickFormatter: (measurement === 'volume') ? 'func:window.chartDollarFormatter' : 'func:window.chartCountFormatter',
            label: {
              value: LABELMAP[measurement],
              angle: '-90',
              dx: -30,
              offset: 0,
              position: 'insideLeft',
            },
          },
        }, {
          component: 'recharts.Tooltip',
          hasWindowFunc: true,
          props: {
            formatter: (measurement === 'volume') ? 'func:window.chartDollarFormatter' : 'func:window.chartCountFormatter',
            itemSorter: 'func:window.tooltipItemSorter',
            itemStyle: {
              margin: 0,
              padding: 0,
            },
          },
        }, ...chartBars ],
    }]
  } catch(e) {
    return e;
  }
}

module.exports = {
  generateReportingChart,
}