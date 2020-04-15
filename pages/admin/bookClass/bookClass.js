// pages/admin/bookClass/bookClass.js
const app = getApp()
const ajax = require("../../../utils/myAjax.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{
      id: 'id',
      name: 'name',
      open: false,
      pages: ['subName', 'subName2'],
      pagesId: ["1", "2"]
    }]
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
    this.getBookClass();
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

  getBookClass: function() {
    var that = this;
    ajax.requestWithAuth({
      url: '/admin/bookClass/all',
      method: 'POST',
      data: {},
      success: res => {
        console.log(res.data);
        that.setData({
          list: res.data.list,
        })
      },
      fail: err => {
        console.log(err);
      }
    })
  },

  newBookClass: function() {
    wx.navigateTo({
      url: '../bookClassNew/bookClassNew',
    })
  },

  // 
  kindToggle: function(e) {
    var that = this;
    var id = e.currentTarget.id;
    var listTmp = that.data.list;
    for (var i = 0, len = listTmp.length; i < len; ++i) {
      if (listTmp[i].id == id) {
        listTmp[i].open = !listTmp[i].open
      } else {
        listTmp[i].open = false
      }
    }
    that.setData({
      list: listTmp
    });
  }
})