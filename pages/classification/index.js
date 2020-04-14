// pages/classification/index.js
const app = getApp();
const ajax = require("../../utils/myAjax.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAdmin: false,
    // 管理员图书管理
    manageList: [{
        "name": "图书查询",
      "url": "../admin/bookSearch/bookSearch"
      },
      {
        "name": "图书列表",
        "url": "../admin/bookList/bookList"
      },
      {
        "name": "图书统计",
        "url": "../admin/bookGraph/bookGraph"
      },
      {
        "name": "新增图书",
        "url": "../admin/bookNew/bookNew"
      }
    ]
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
    this.setData({
      isAdmin: app.globalData.isAdmin,
    })
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

  }
})