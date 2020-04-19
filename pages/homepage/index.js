// pages/homepage/index.js
const app = getApp()
const ajax = require("../../utils/myAjax.js")
var sectionData = [];
var ifLoadMore = null;
var page = 1; //默认第一页

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
    ],
    // 首页
    navbars: null,
    currentTab: 0,
    banners: null,
    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 3000, //自动切换时间间隔,3s
    duration: 1000, //  滑动动画时长1s
    menus: null,
    brands: null,
    hidden: false,

    pageRequest: 0,
    pageSize: 10,
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
    console.log("onReachBottom!");
    var that = this;
    if (ifLoadMore === true) {
      that.getBooks();
    }
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
    this.getUserData();
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
        } else if (res.data.state === "failGetOpenId") {
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
          } else {
            that.getUserData();
          }
        }
      },
      fail: err => {
        console.log("loginErr", err)
      }
    })
  },

  getBanners: function() {
    var that = this;
    ajax.requestWithAuth({
      url: '/user/banner/today',
      method: 'POST',
      data: {},
      success: res => {
        console.log("getBanners", res.data);
        for (var i = 0; i < res.data.banners.length; i++) {
          res.data.banners[i].imageUrl = ajax.api + "/resources" + res.data.banners[i].imageUrl;
        }
        that.setData({
          banners: res.data.banners,
        })
      },
      fail: err => {
        console.log("getBannersErr", err);
      }
    })
  },

  getMenus: function() {
    var that = this;
    ajax.requestWithAuth({
      url: '/user/menu/all',
      method: 'POST',
      data: {},
      success: res => {
        console.log("getMenus", res.data);
        for (var i = 0; i < res.data.menus.length; i++) {
          res.data.menus[i].imageUrl = ajax.api + "/resources" + res.data.menus[i].imageUrl;
        }
        that.setData({
          menus: res.data.menus,
        })
      },
      fail: err => {
        console.log("getMenusErr", err);
      }
    })
  },

  getBooks: function() {
    var that = this;
    ajax.requestWithAuth({
      url: '/user/book/recommend',
      method: 'POST',
      data: {
        userId: app.globalData.userId,
        pageRequest: that.data.pageRequest,
        pageSize: that.data.pageSize,
      },
      success: res => {
        console.log("getBooks", res.data);
        var books = that.data.books;

        if (ifLoadMore) { // load more
          if (res.data.books.length > 0) {
            for (var i in res.data.books) {
              var name = res.data.books[i].name;
              if (name.length > 26) {
                res.data.books[i].name = name.substring(0, 23) + '...';
              }
              res.data.books[i].previewUrl = ajax.api + "/resources" + res.data.books[i].previewUrl;
              books.push(res.data.books[i])
            }
          } else { //  res.data.books.length <= 0
            ifLoadMore = false;
            this.setData({
              hidden: true
            })
            wx.showToast({
              title: '暂无更多内容！',
              icon: 'loading',
              duration: 2000
            })
          }
        } else if (ifLoadMore == null) { // ifLoadMore = null;
          ifLoadMore = true;
          for (var i in res.data.books) {
            var name = res.data.books[i].name;
            if (name.length > 26) {
              res.data.books[i].name = name.substring(0, 23) + '...';
            }
            res.data.books[i].previewUrl = ajax.api + "/resources" + res.data.books[i].previewUrl;
          }
          books = res.data.books;
        } else { // ifLoadMore = false;

        }
        that.setData({
          books: books,
          pageRequest: that.data.pageRequest + 1,
        });
        wx.stopPullDownRefresh(); //结束动画
      },
      fail: err => {
        console.log("getBooksErr", err);
      }
    })
  },

  catchTapCategory: function (e) {
    console.log('catchTapCategory:', e);
    var bookId = e.currentTarget.dataset.bookid;
    //新增商品用户点击数量
    // that.booksClickShow(bookId);
    //跳转商品详情
    wx.navigateTo({ url: '../admin/bookDetail/bookDetail?bookId=' + bookId })
  },

  // booksClickShow(bookId) {
  //   console.log('增加商品用户点击数量');
  //   var that = this;
  // },

  getUserData: function() {
    this.getBanners();
    this.getMenus();
    this.getBooks();
  }
})