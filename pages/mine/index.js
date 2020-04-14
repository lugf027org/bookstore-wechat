// pages/mine/index.js
const app = getApp();
const ajax = require("../../utils/myAjax.js")

Page({
  data: {
    isAdmin: false,

    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    orderItems: [{
        typeId: 0,
        name: '待付款',
        url: 'bill',
        imageurl: '../../images/person/personal_pay.png',
      },
      {
        typeId: 1,
        name: '待收货',
        url: 'bill',
        imageurl: '../../images/person/personal_receipt.png',
      },
      {
        typeId: 2,
        name: '待评价',
        url: 'bill',
        imageurl: '../../images/person/personal_comment.png'
      },
      {
        typeId: 3,
        name: '退换/售后',
        url: 'bill',
        imageurl: '../../images/person/personal_service.png'
      }
    ],
  },

  //事件处理函数
  toOrder: function() {
    wx.navigateTo({
      url: '../order/order'
    })
  },

  onShow: function() {
    this.setData({
      isAdmin: app.globalData.isAdmin
    })
  },

  onLoad: function() {
    var that = this;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    this.userLogin()
  },

  myAddress: function(e) {
    wx.navigateTo({
      url: '../user/myAddressList/myAddressList'
    });
  },

  dialogCancelEvent: function (e) {
    console.log('点击了取消', e);
    this.setData({
      isDialogShow: false
    })
  },

  dialogConfirmEvent: function (e) {
    console.log('点击了确定', e);
    this.setData({
      isDialogShow: false
    })
    this.adminLogin();
  },

  changeTabBar: function () {
    wx.setTabBarItem({
      index: 0,
      text: '用户',
      "iconPath": "images/tarbar/admin-user.png",
      "selectedIconPath": "images/tarbar/admin-user_select.png",
    })
    wx.setTabBarItem({
      index: 1,
      text: '图书',
      "iconPath": "images/tarbar/admin-book.png",
      "selectedIconPath": "images/tarbar/admin-book_select.png",
    })
    wx.setTabBarItem({
      index: 2,
      text: '订单',
      "iconPath": "images/tarbar/admin-order.png",
      "selectedIconPath": "images/tarbar/admin-order_select.png",
    })
    wx.setTabBarItem({
      index: 3,
      text: '客服',
      "iconPath": "images/tarbar/admin-kefu.png",
      "selectedIconPath": "images/tarbar/admin-kefu_select.png",
    })
  },

  adminLogin: function () {
    var that = this;
    console.log("adminPre", app.globalData)
    wx.request({
      url: ajax.api + '/admin/admin/loginByWeChat',
      method: 'POST',
      data: {
        "adminId": app.globalData.userId,
        "weChatSessionId": app.globalData.sessionId,
      },
      success: res => {
        console.log("adminLoginRes", res)
        if (res.data.state === "failAuthentication") {
          this.selectComponent("#toast").toastShow("认证失败", "fa-remove", 1000)
        } else if (res.data.state === "failUpdate") {
          this.selectComponent("#toast").toastShow("登录失败", "fa-remove", 1000)
        } else if (res.data.state === "ok") {
          app.globalData.isAdmin = true;
          app.globalData.sessionId = res.data.sessionId;
          this.changeTabBar();
          that.setData({
            isAdmin: true,
          })
        }
      },
      fail: err => {
        console.log("loginErr", err)
      }
    })
  },

  userLogin: function () {
    var that = this;
    console.log("homepage准备发送的数据", app.globalData)
    this.selectComponent("#toast").toastShowForever("稍等", "fa-spinner fa-pulse")
    wx.request({
      url: ajax.api + '/user/user/login',
      method: 'POST',
      data: {
        "code": app.globalData.code,
        "userInfo": app.globalData.userInfo,
        "location": app.globalData.location,
      },
      success: res => {
        console.log("userLoginRes", res)
        if (res.data.state === "failAdd") {
          this.selectComponent("#toast").toastShow("注册失败", "fa-remove", 1000)
        } else if (res.data.state === "failUpdate") {
          this.selectComponent("#toast").toastShow("登录失败", "fa-remove", 1000)
        } else if (res.data.state === "ok") {
          app.globalData.userId = res.data.userId;
          app.globalData.sessionId = res.data.sessionId;
          // 判断管理
          this.selectComponent("#toast").toastShow("登录成功", "fa-check", 1000)
          if (res.data.isAdmin === true) {
            that.setData({
              isDialogShow: true,
            })
          }
        }
      },
      fail: err => {
        console.log("loginErr", err)
      }
    })
  }
})