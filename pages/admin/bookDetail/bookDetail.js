// pages/admin/bookDetail/bookDetail.js
const app = getApp()
const ajax = require("../../../utils/myAjax.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLike: false,
    showDialog: false,
    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 3000, //自动切换时间间隔,3s
    duration: 1000, //  滑动动画时长1s

    numToBuy: 0,
    moneyTotal: 0,

    book: null,
  },

  //预览图片
  previewImage: function(e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.book.introList // 需要预览的图片http链接列表  
    })
  },

  // 收藏
  addLike() {
    this.setData({
      isLike: !this.data.isLike
    });
  },

  // 跳到购物车
  toCar() {
    wx.switchTab({
      url: '../../shoppingcart/shoppingcart'
    })
  },

  // 立即购买
  immeBuy() {
    var that = this;
    ajax.requestWithAuth({
      url: '/user/order/add',
      method: 'POST',
      data: {
        bookId: that.data.book.bookId,
        userId: app.globalData.userId,
        payedMoney: that.data.book.priceN,
      },
      success: res => {
        console.log("immeBuyRes", res);
        wx.showToast({
          title: '购买成功',
          icon: 'success',
          duration: 2000
        });
        wx.navigateBack({
          delta: 1
        })
      },
      fail: err => {
        console.log("immeBuy", err);
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("details", options);
    //加载商品详情
    this.getBook(options.bookId);
  },

  getBook: function(bookId) {
    var that = this;
    ajax.requestWithAuth({
      url: '/admin/book/detail',
      method: 'POST',
      data: {
        pageRequest: that.data.pageRequest,
        pageSize: that.data.pageSize,
        bookId: bookId
      },
      success: res => {
        console.log("getBookRes", res.data);
        // authors
        res.data.book.authorList = res.data.book.authorList.join(";");
        // imgUrl
        res.data.book.previewUrl = ajax.api + "/resources" + res.data.book.previewUrl;
        for (var i = 0; i < res.data.book.introList.length; i++) {
          res.data.book.introList[i] = ajax.api + "/resources" + res.data.book.introList[i];
        }
        for (var i = 0; i < res.data.book.detailList.length; i++) {
          res.data.book.detailList[i] = ajax.api + "/resources" + res.data.book.detailList[i];
        }
        that.setData({
          book: res.data.book,
        })
      },
      fail: err => {
        console.log("getBookErr", err);
      }
    })
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
      isAdmin: app.globalData.isAdmin
    });
    console.log("isAdmin", this.data.isAdmin);
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

  toggleDialog: function() {
    this.setData({
      showDialog: !this.data.showDialog
    });
  },

  closeDialog: function() {
    console.info("关闭");
    this.setData({
      showDialog: false
    });
  },

  /* 减数 */
  delCount: function(e) {
    console.log("delCountBegin", this.data.numToBuy);
    if (this.data.numToBuy > 1) {
      this.setData({
        numToBuy: this.data.numToBuy - 1,
      });
    }
    console.log("delCountEnd", this.data.numToBuy);
    this.priceCount();
  },

  /* 加数 */
  addCount: function(e) {
    console.log("addCountBegin", this.data.numToBuy);
    if (this.data.numToBuy < this.data.book.stock) {
      this.setData({
        numToBuy: this.data.numToBuy + 1,
      });
    }
    console.log("addCountEnd", this.data.numToBuy);
    this.priceCount();
  },

  //价格计算
  priceCount: function(e) {
    var moneyTotal = this.data.book.priceN * this.data.numToBuy;
    this.setData({
      moneyTotal: moneyTotal.toFixed(2)
    })
  },

  /**
   * 加入购物车
   */
  addCar: function(e) {
    var that = this;
    ajax.requestWithAuth({
      url: '/user/cart/add',
      method: 'POST',
      data: {
        userId: app.globalData.userId,
        bookId: that.data.book.bookId,
        number: that.data.numToBuy,
      },
      success: res => {
        console.log("addCarRes", res);
        that.closeDialog();
      },
      fail: err => {
        console.log("addCarErr", err);
      }
    })
  }
})