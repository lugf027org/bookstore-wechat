// pages/homepage/index.js
const app = getApp()
const ajax = require("../../utils/myAjax.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDialogShow: false,
    isAdmin: false,
    // 管理员用户管理
    manageList: [{
        "name": "用户查询",
        "url": "../admin/userSearch/userSearch"
      },
      {
        "name": "用户列表",
        "url": "../admin/userList/userList"
      },
      {
        "name": "用户统计",
        "url": "../admin/userGraph/userGraph"
      }
    ]
    // 首页
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    console.log("homepageOnload")
    if (app.globalData.userInfo) {
      console.log("homepageOnload已有信息")
      that.userLogin()
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回 
      // 所以此处加入 callback 以防止这种情况 
      console.log("homepageOnload无信息但已授权")
      app.userInfoReadyCallback = res => {
        that.userLogin()
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理 
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          that.userLogin()
        }
      })
    }
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
    console.log("onShowHere");
    this.setData({
      isAdmin: app.globalData.isAdmin
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

  },

  dialogCancelEvent: function(e) {
    console.log('点击了取消', e);
    this.setData({
      isDialogShow: false
    })
  },

  dialogConfirmEvent: function(e) {
    console.log('点击了确定', e);
    this.setData({
      isDialogShow: false
    })
    this.adminLogin();
  },

  changeTabBar: function() {
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

  adminLogin: function() {
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

  userLogin: function() {
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