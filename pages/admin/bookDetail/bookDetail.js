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

    book: {
      bookId: 123,
      name: "朵玺Dr.Douxi赋活新生卵壳膜100g 紧致毛孔 锁水保湿 白色",
      intro: "共360个成语故事。内文全部加注音，妙趣横生的成语故事；图文并茂的呈现形式；详尽的释义与出处说明；开发智力、拓展词汇量。特别加入成语接龙游戏",
      priceN: 249,
      priceT: 280,
      charge: "8.9",
      stock: 15,

      salesT: 578,
      salesM: 23,

      previewUrl: "https://m.360buyimg.com/n12/jfs/t15760/240/2364180613/156292/ef903739/5aa1f8d5Ndd42acd3.jpg!q70.jpg",
      introList: [
        "https://img10.360buyimg.com/imgzone/jfs/t15274/79/2422919843/349134/17bcd260/5a9e880fNff929e75.jpg",
        "https://img10.360buyimg.com/imgzone/jfs/t17044/228/668258528/204068/838bea39/5a9e880fNaea3579d.jpg",
        "https://img10.360buyimg.com/imgzone/jfs/t18841/260/639063252/306396/137e665f/5a9e8810N06aedfa4.jpg",
        "https://img10.360buyimg.com/imgzone/jfs/t19258/148/662223497/297520/28ff243a/5a9e8810Nf2f538c2.jpg",
        "https://img10.360buyimg.com/imgzone/jfs/t19453/254/653770633/308718/77c99727/5a9e8811Nc19aac86.jpg;",
        "https://img10.360buyimg.com/imgzone/jfs/t15340/267/2439419638/355328/e0b26f3f/5a9e8811Na42a7292.jpg"
      ],
      detailList: [
        "https://m.360buyimg.com/n12/jfs/t15760/240/2364180613/156292/ef903739/5aa1f8d5Ndd42acd3.jpg!q70.jpg;",
        "https://m.360buyimg.com/n12/jfs/t16735/365/798991195/114913/a848902f/5aa91508N7af5e1e0.jpg!q70.jpg;",
        "https://m.360buyimg.com/n12/jfs/t15526/221/2478166606/101122/3c868736/5aa91508Nf6c8342c.jpg!q70.jpg;",
        "https://m.360buyimg.com/n12/jfs/t17386/204/804389544/111193/9e032db/5aa91508N6823e2be.jpg!q70.jpg;",
        "https://m.360buyimg.com/n12/jfs/t14494/208/2545278027/128306/d2a0be37/5aa91508N4dbb8741.jpg!q70.jpg;",
        "https://m.360buyimg.com/n12/jfs/t15007/221/2573118534/202338/cd94e7e8/5aa91508N00af7315.jpg!q70.jpg",
      ],
    }
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
    // ajax.request({
    //   method: 'GET',
    //   url: 'book/addCollection?bookId=' + bookId,
    //   success: data => {
    //     console.log("收藏返回结果：" + adta)
    //     wx.showToast({
    //       title: data.message,
    //       icon: 'success',
    //       duration: 2000
    //     });
    //   }
    // })
  },

  // 跳到购物车
  toCar() {
    wx.switchTab({
      url: '../../shoppingcart/shoppingcart'
    })
  },

  // 立即购买
  immeBuy() {
    wx.showToast({
      title: '购买成功',
      icon: 'success',
      duration: 2000
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("details", options);
    //加载商品详情
    this.getBook(options.bookId);
  },

  getBook: function (bookId) {
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
        for(var i=0; i<res.data.book.introList.length; i++){
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