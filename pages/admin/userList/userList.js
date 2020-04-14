// pages/admin/userList/userList.js
const app = getApp()
const ajax = require("../../../utils/myAjax.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: "",
    noMore: false,
    resultList: null,
    pageRequest: 0,
    pageSize: 10,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          height: res.windowHeight
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.loadMore();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


  refresh: function(){
    console.log("redresh")
    var that = this
    that.setData({
      pageRequest: 0,
    })

    ajax.requestWithAuth({
      url: '/admin/user/userList',
      method: 'POST',
      data: {
        pageRequest: that.data.pageRequest,
        pageSize: that.data.pageSize,
      },
      success: res => {
        console.log(res.data)
        that.setData({
          resultList: res.data.resultList,
          pageRequest: that.data.pageRequest + 1,
          totalNum: res.data.totalNum,
        })
        if (res.data.resultList.length < 10){
          that.setData({
            noMore: true,
          })
        }
      },
      fail: err => {
        console.log(err)
      }
    })
  },

  loadMore: function(){
    console.log("loadMore")
    var that = this

    ajax.requestWithAuth({
      url: '/admin/user/userList',
      method: 'POST',
      data: {
        pageRequest: that.data.pageRequest,
        pageSize: that.data.pageSize,
      },
      success: res => {
        console.log(res.data)
        that.setData({
          resultList: res.data.resultList,
          pageRequest: that.data.pageRequest + 1,
          totalNum: res.data.totalNum,
        })
        if (res.data.resultList.length < 10) {
          that.setData({
            noMore: true,
          })
        }
        console.log(that.data.noMore)
      },
      fail: err => {
        console.log(err)
      }
    })
  }
})