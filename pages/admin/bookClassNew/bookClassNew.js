// pages/admin/bookClassNew/bookClassNew.js
const app = getApp()
const ajax = require("../../../utils/myAjax.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    fatherName: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("newClass", options)
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

  bindSendBtn: function() {
    var that = this;
    ajax.requestWithAuth({
      url: '/admin/bookClass/add',
      method: 'POST',
      data: {
        name: that.data.name,
        fatherName: that.data.fatherName,
      },
      success: res => {
        console.log(res.data);
        if(res.data.state === "ok"){
          this.selectComponent("#toast").toastShow("添加成功", "fa-check", 1000);
        }else{
          this.selectComponent("#toast").toastShow("添加失败", "fa-remove", 1000);
        }
      },
      fail: err => {
        console.log(err);
      }
    })
  },

  bindClassInput: function(e) {
    this.setData({
      name: e.detail.value
    })
  },

  bindFatherInput: function(e) {
    this.setData({
      fatherName: e.detail.value
    })
  }
})