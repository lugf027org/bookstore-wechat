// pages/admin/bookNew/bookNew.js
const app = getApp()
const ajax = require("../../../utils/myAjax.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    preFiles: [],
    introFiles: [],
    detailFiles: [],

    date: "2020-04-01",
    introLength: 0,
    fatherClasses: ["name", "name2"],
    classes: [{
      id: 'id',
      name: 'name',
      pages: ['subName', 'subName2'],
      pagesId: ["1", "2"]
    }, {
      id: 'id2',
      name: 'name2',
        pages: ['subName20', 'subName21', 'subName22', 'subName23'],
      pagesId: ["1", "2", "3", "4"]
    }],
    classIndex: 0,
    fatherClassIndex: 0,
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

  addBook: function(e) {

  },

  bindClassChange: function(e) {
    console.log('bindClassChange', e.detail.value);
    this.setData({
      classIndex: e.detail.value,
    })
  },

  bindFatherClassChange: function(e) {
    console.log('bindFatherClassChange', e.detail.value);
    this.setData({
      fatherClassIndex: e.detail.value,
      classIndex: 0,
    })
  },

  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },

  chooseIntroImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log("intro", res)
        that.setData({
          introFiles: that.data.introFiles.concat(res.tempFilePaths)
        });
      }
    })
  },
  previewIntroImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.introFiles // 需要预览的图片http链接列表
    })
  },

  chooseDetailImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          detailFiles: that.data.detailFiles.concat(res.tempFilePaths)
        });
      }
    })
  },
  previewDetailImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.detailFiles // 需要预览的图片http链接列表
    })
  },

  choosePreImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          "preFiles[0]": res.tempFilePaths[0]
        });
      }
    })
  },
  previewPreImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.preFiles // 需要预览的图片http链接列表
    })
  }

})