// pages/admin/orderMoney/orderMoney.js
const app = getApp()
var Charts = require('../../../utils/wxcharts.js')
const ajax = require("../../../utils/myAjax.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    lineChart: '',
    totalIn: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    totalEarning: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getData();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  getData: function(e) {
    var that = this;
    console.log("getData", e);
    ajax.requestWithAuth({
      url: '/admin/order/moneyGraph',
      method: 'POST',
      data: {
        year: this.data.year,
      },
      success: res => {
        console.log("getDataRes", res);
        if (res.data.state === "ok") {
          that.setData({
            totalEarning: res.data.totalEarning,
            totalIn: res.data.totalIn,
          })
        }

        that.lineShow();
      },
      fail: err => {
        console.log("getDataErr", err);
      }
    })

  },

  lineShow: function() {
    var windowWidth = '',
      windowHeight = ''; //定义宽高
    try {
      var res1 = wx.getSystemInfoSync(); //试图获取屏幕宽高数据
      windowWidth = res1.windowWidth * 700 / 750
      windowHeight = res1.windowWidth * 500 / 750
    } catch (e) {
      console.error('getSystemInfoSync failed!'); //如果获取失败
    }

    this.data.lineChart = new Charts({
      canvasId: 'lineCanvas',
      type: 'line',
      animation: true, //是否开启动画
      categories: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
      series: [{
        name: '总收入',
        data: this.data.totalIn,
        format: function(val) {
          return val.toFixed(2);
        }
      }, {
        name: '净收入',
        data: this.data.totalEarning,
        format: function(val) {
          return val.toFixed(2);
        }
      }, ],
      xAxis: { //是否隐藏x轴分割线
        disableGrid: true,
      },
      yAxis: {
        title: '单位(元)',
        format: function(val) {
          return val.toFixed(2);
        },
      },
      width: windowWidth, //图表展示内容宽度
      height: windowHeight, //图表展示内容高度
      dataLabel: true, //是否在图表上直接显示数据
      dataPointShape: true, //是否在图标上显示数据点标志
      extra: {
        lineStyle: 'curve' //曲线
      },
    });
  },

  touchHandler: function(e) {
    this.data.lineChart.showToolTip(e, {
      // background: '#7cb5ec',
      format: function(item, category) {
        return category + '月 ' + item.name + ':' + item.data
      }
    });
  }
})