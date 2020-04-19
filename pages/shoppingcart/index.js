// pages/shoppongcart/index.js
const app = getApp();
const ajax = require("../../utils/myAjax.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAdmin: false,
    // 管理员订单与资金管理
    manageList: [{
        "name": "订单查询",
        "url": "../admin/orderSearch/orderSearch"
      },
      {
        "name": "订单列表",
        "url": "../admin/orderList/orderList"
      },
      {
        "name": "订单统计",
        "url": "../admin/orderGraph/orderGraph"
      },
      {
        "name": "资金统计",
        "url": "../admin/orderMoney/orderMoney"
      }
    ],

    // user
    carts: [], //数据 
    iscart: false,
    hidden: null,
    isAllSelect: false,
    totalMoney: 0,
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
    if (app.globalData.isAdmin === false) {
      this.userShow();
    }
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

  userShow: function() {
    var that = this;
    ajax.requestWithAuth({
      url: '/user/cart/all',
      method: 'POST',
      data: {
        userId: app.globalData.userId,
      },
      success: res => {
        console.log("addCarRes", res);
        if (res.data.carts.length > 0) {
          for (var i = 0; i < res.data.carts.length; i++) {
            res.data.carts[i].isSelect = false;
            res.data.carts[i].count = 0;
            res.data.carts[i].priceTotal = (0.0).toFixed(2)
            res.data.carts[i].name = res.data.carts[i].name.substring(0, 12) + '...'
            res.data.carts[i].previewUrl = ajax.api + "/resources" + res.data.carts[i].previewUrl;
          }

          that.setData({
            carts: res.data.carts,
            iscart: true,
            hidden: false
          });
          console.log("addCarRes", that.data.carts);
        } else {
          that.setData({
            iscart: false,
            hidden: true,
          });
        }
      },
      fail: err => {
        console.log("addCarErr", err);
      }
    })
  },

  switchSelect: function(e) {
    var Allprice = 0,
      i = 0;
    let id = e.target.dataset.id,

      index = parseInt(e.target.dataset.index);
    this.data.carts[index].isSelect = !this.data.carts[index].isSelect;

    if (this.data.carts[index].isSelect) {
      this.data.totalMoney = this.data.totalMoney + (this.data.carts[index].price * this.data.carts[index].count);
    } else {
      this.data.totalMoney = this.data.totalMoney - (this.data.carts[index].price * this.data.carts[index].count);
    }

    for (i = 0; i < this.data.carts.length; i++) {
      Allprice = Allprice + (this.data.carts[index].price * this.data.carts[index].count);
    }
    if (Allprice == this.data.totalMoney) {
      this.data.isAllSelect = true;
    } else {
      this.data.isAllSelect = false;
    }
    this.setData({
      carts: this.data.carts,
      totalMoney: this.data.totalMoney,
      isAllSelect: this.data.isAllSelect,
    })
  },

  allSelect: function(e) {
    let i = 0;
    if (!this.data.isAllSelect) {
      this.data.totalMoney = 0;
      for (i = 0; i < this.data.carts.length; i++) {
        this.data.carts[i].isSelect = true;
        this.data.totalMoney = this.data.totalMoney + (this.data.carts[i].price * this.data.carts[i].count);

      }
    } else {
      for (i = 0; i < this.data.carts.length; i++) {
        this.data.carts[i].isSelect = false;
      }
      this.data.totalMoney = 0;
    }
    this.setData({
      carts: this.data.carts,
      isAllSelect: !this.data.isAllSelect,
      totalMoney: this.data.totalMoney,
    })
  },

  // 去结算
  toBuy() {
    wx.showToast({
      title: '去结算',
      icon: 'success',
      duration: 3000
    });
    this.setData({
      showDialog: !this.data.showDialog
    });
  },

  //数量变化处理
  handleQuantityChange(e) {
    var componentId = e.componentId;
    var quantity = e.quantity;
    this.data.carts[componentId].count.quantity = quantity;
    this.setData({
      carts: this.data.carts,
    });
  },

  delCount: function(e) {
    console.log("delCount", e);

    var index = e.target.dataset.index;
    var count = this.data.carts[index].count;
    // 商品总数量-1
    if (count > 1) {
      this.data.carts[index].count--;
    }
    // 将数值与状态写回  
    this.setData({
      carts: this.data.carts
    });
    console.log("carts:" + this.data.carts);
    this.priceCount(index);
  },

  addCount: function(e) {
    console.log("addCount", e);

    var index = e.target.dataset.index;
    var count = this.data.carts[index].count;
    // 商品总数量+1  
    if (count < 10) {
      this.data.carts[index].count++;
    }
    // 将数值与状态写回  
    this.setData({
      carts: this.data.carts
    });
    console.log("carts:" + this.data.carts);
    this.priceCount(index);
  },

  priceCount: function(index) {
    this.data.totalMoney = 0;

    for (var i = 0; i < this.data.carts.length; i++) {
      if (this.data.carts[i].isSelect == true) {
        this.data.totalMoney = this.data.totalMoney + (this.data.carts[i].price * this.data.carts[i].count);
      }

    }
    var carts = this.data.carts;
    console.log("index & carts", index, carts)
    carts[index].priceTotal = (carts[index].price * carts[index].count).toFixed(2)
    this.setData({
      carts: carts,
      totalMoney: this.data.totalMoney,
    })
  },

  delCart: function(e) {
    console.log("delCart", e);
    var that = this;
    var index = e.target.dataset.index;
    ajax.requestWithAuth({
      url: '/user/cart/delete',
      method: 'POST',
      data: {
        "shoppingCartId": this.data.carts[index].shoppingCartId
      },
      success: res => {
        console.log("delCart", res);
        that.userShow();
      },
      fail: err => {
        console.log("delCartErr", err);
      }
    })
  }
})