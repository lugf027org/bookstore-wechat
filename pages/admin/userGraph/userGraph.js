// pages/admin/userGraph/userGraph.js
const app = getApp()
const ajax = require("../../../utils/myAjax.js")
var wxCharts = require('../../../utils/wxcharts.js')
var lineChart = null;
var startPos = null;

Page({
  data: {
    years: ["2018", "2019", "2020"],
    yearIndex: 2,
    months: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
    monthIndex: 0,

    categories: null,
    userData: null,
  },

  touchHandler: function(e) {
    lineChart.scrollStart(e);
  },

  moveHandler: function(e) {
    lineChart.scroll(e);
  },

  touchEndHandler: function(e) {
    lineChart.scrollEnd(e);
    lineChart.showToolTip(e, {
      format: function(item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  },

  onLoad: function(e) {
    this.getUserData();
    console.log("onLoad", this.data);
    this.setLineChart();
  },

  setLineChart: function(e) {
    var that = this;
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: that.data.categories,
      animation: false,
      series: [{
        name: '用户新增注册数',
        data: that.data.userData,
        format: function(val, name) {
          // return val.toFixed(2) + '位';
          return val + '位'
        }
      }],
      xAxis: {
        disableGrid: false
      },
      yAxis: {
        title: '注册数',
        format: function(val) {
          // return val.toFixed(2);
          return val
        },
        min: 0
      },
      width: windowWidth,
      height: 200,
      dataLabel: true,
      dataPointShape: true,
      enableScroll: true,
      extra: {
        lineStyle: 'curve'
      }
    });
  },

  bindPickerChangeYear: function(e) {
    console.log('pickerYearChangeTo', e.detail.value)
    this.setData({
      yearIndex: e.detail.value
    })
    this.getUserData();
    this.setLineChart();
    // lineChart.categories = this.data.categories;
    // console.log("series", lineChart.series);
    // lineChart.series[0].data = this.data.userData;
  },

  bindPickerChangeMonth: function(e) {
    console.log('pickerMonthChangeTo', e.detail.value)
    this.setData({
      monthIndex: e.detail.value
    })
    this.getUserData();
    this.setLineChart();
    // lineChart.categories = this.data.categories;
    // console.log("series", lineChart.series);
    // lineChart.series[0].data = this.data.userData;
  },

  getUserData: function() {
    var that = this;
    var categories = [];
    var userData = [];
    var year = this.data.years[this.data.yearIndex];
    var month = this.data.months[this.data.monthIndex];

    for (var i = 0; i < 30; i++) {
      categories.push(year + '-' + month + '-' + (i + 1));
      userData.push(Math.ceil(Math.random() * (20 - 10) + 10));
    }

    that.setData({
      categories: categories,
      userData: userData
    })
    console.log("getUseInfo", that.data);
  }

});