// pages/admin/bookClass/bookClass.js
const app = getApp()
const ajax = require("../../../utils/myAjax.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{
        id: 'form',
        name: '表单',
        open: false,
        pages: ['button', 'list', 'slideview', 'input', 'form', 'slider', 'uploader', '新增']
      },
      {
        id: 'widget',
        name: '基础组件',
        open: false,
        pages: ['article', 'badge', 'flex', 'footer', 'gallery', 'grid', 'icons', 'loading', 'loadmore', 'panel', 'preview', 'progress']
      },
      {
        id: 'feedback',
        name: '操作反馈',
        open: false,
        pages: ['actionsheet', 'dialog', 'half-screen-dialog', 'msg', 'picker', 'toast']
      },
      {
        id: 'nav',
        name: '导航相关',
        open: false,
        pages: ['navigation-bar', 'tabbar']
      },
      {
        id: 'search',
        name: '搜索相关',
        open: false,
        pages: ['searchbar']
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

  getBookClass: function(){
    var that = this;
    ajax.requestWithAuth({
      url: '/admin/bookClass/all',
      method: 'POST',
      data: {
      },
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

  newBookClass: function(){
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