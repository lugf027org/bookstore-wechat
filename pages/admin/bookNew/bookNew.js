// pages/admin/bookNew/bookNew.js
const app = getApp()
const ajax = require("../../../utils/myAjax.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookId: "",
    // local file path
    preFiles: [],
    introFiles: [],
    detailFiles: [],
    // server file path
    previewUrl: "",
    introList: [],
    detailList: [],

    date: "2020-04-01",
    introLength: 0,
    fatherClasses: ["name", "name2"],
    classes: [],
    classIndex: 0,
    fatherClassIndex: 0,
    taoZhuang: "是",

    step: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getBookClass();
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

  getBookClass: function() {
    var that = this;
    ajax.requestWithAuth({
      url: '/admin/bookClass/all',
      method: 'POST',
      data: {},
      success: res => {
        console.log("getBookClass", res.data);
        var fatherClasses = [];
        for (var i = 0; i < res.data.list.length; i++) {
          fatherClasses.push(res.data.list[i].name)
        }
        that.setData({
          classes: res.data.list,
          fatherClasses: fatherClasses,
        })
      },
      fail: err => {
        console.log("getBookClassErr", err);
      }
    })
  },

  addBook: function(e) {
    console.log("addBook", this.data);
    this.uploadImages();
  },

  sendBookInfo: function() {
    var that = this;
    var data = {
      bookId: that.data.bookId,

      baoZhuang: that.data.baoZhuang,
      characterTotal: that.data.characterTotal,
      publishDate: that.data.date,
      intro: that.data.intro,
      isbn: that.data.isbn,
      kaiBen: that.data.kaiBen,
      name: that.data.name,
      pageTotal: that.data.pageTotal,
      paperType: that.data.paperType,
      priceN: that.data.priceN,
      priceT: that.data.priceT,
      yinCi: that.data.yinCi,

      classId: that.data.classes[that.data.fatherClassIndex].pagesId[that.data.classIndex],
      taoZhuang: that.data.taoZhuang,

      publisher: that.data.publisher,
      authorList: that.data.authors.split(";"),

      // 从后端返回的
      previewUrl: that.data.previewUrl,
      introList: that.data.introList,
      detailList: that.data.detailList,
    }
    console.log("readyToSend", data);

    ajax.requestWithAuth({
      url: '/admin/book/add',
      method: 'POST',
      data: data,
      success: res => {
        console.log("sendBookInfo", res.data);
        if (res.data.state === "ok") {
          this.selectComponent("#toast").toastShow("添加成功", "fa-check", 1000);

        }
      },
      fail: err => {
        console.log("sendBookInfoErr", err);
      }
    })
  },

  uploadImages: function() {
    var that = this;
    var result = true;
    // 预览图
    if (that.data.preFiles.length > 0) {
      that.uploadAFile(that.data.preFiles[0], 0);
      that.setData({
        step: that.data.step + 1,
      })
    }
    // 商品图
    for (var i = 0; i < that.data.introFiles.length; i++) {
      that.uploadAFile(that.data.introFiles[i], 1);
      that.setData({
        step: that.data.step + 1,
      })
    }
    // 详情图
    for (var i = 0; i < that.data.detailFiles.length; i++) {
      that.uploadAFile(that.data.detailFiles[i], 2);
      that.setData({
        step: that.data.step + 1,
      })
    }
  },

  uploadAFile: function (localUrl, type) {
    var that = this;
    console.log("beginUpload", localUrl);
    wx.uploadFile({
      url: ajax.api + '/admin/book/upload',
      filePath: localUrl,
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data",
        "sessionId": app.globalData.sessionId,
        "userId": app.globalData.userId,
      },
      formData: {},
      success(res) {
        console.log("uploadRes", res);
        var path = (JSON.parse(res.data)).path;
        if (type === 0) {
          that.setData({
            previewUrl: path,
          })
          console.log("previewUrl", that.data.step, that.data.previewUrl);

        } else if (type === 1) {
          var introList = that.data.introList;
          introList.push(path)
          that.setData({
            introList: introList,
          })
          console.log("introList", that.data.step, that.data.introList);

        } else if (type === 2) {
          var detailList = that.data.detailList;
          detailList.push(path)
          that.setData({
            detailList: detailList,
          })
          console.log("detailList", that.data.step, that.data.detailList);
        }
        
        that.setData({
          step: that.data.step - 1,
        })
        if(that.data.step === 0){
          that.sendBookInfo();
        }
      },
      fail(err) {
        console.log("uploadErr", res.data);

        that.setData({
          step: that.data.step - 1,
        })
        if (that.data.step === 0) {
          that.sendBookInfo();
        }
      }
    })
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

  // bind input
  bindNameInput: function(e) {
    this.setData({
      name: e.detail.value
    })
  },

  bindPriceTInput: function(e) {
    this.setData({
      priceT: e.detail.value
    })
  },

  bindPriceNInput: function(e) {
    this.setData({
      priceN: e.detail.value
    })
  },

  bindPublisherInput: function(e) {
    this.setData({
      publisher: e.detail.value
    })
  },

  bindIsbnInput: function(e) {
    this.setData({
      isbn: e.detail.value
    })
  },

  bindYinCiInput: function(e) {
    this.setData({
      yinCi: e.detail.value
    })
  },

  bindPageTotalInput: function(e) {
    this.setData({
      pageTotal: e.detail.value
    })
  },

  bindCharacterTotalInput: function(e) {
    this.setData({
      characterTotal: e.detail.value
    })
  },

  bindKaiBenInput: function(e) {
    this.setData({
      kaiBen: e.detail.value
    })
  },

  bindPaperTypeInput: function(e) {
    this.setData({
      paperType: e.detail.value
    })
  },

  bindBaoZhuangInput: function(e) {
    this.setData({
      baoZhuang: e.detail.value
    })
  },

  bindAuthorsInput: function(e) {
    this.setData({
      authors: e.detail.value
    })
  },

  bindIntroInput: function(e) {
    this.setData({
      intro: e.detail.value,
      introLength: e.detail.value.length,
    })
  },

  bindTaoZhuangChange: function(e) {
    this.setData({
      taoZhuang: e.detail.value === true ? "是" : "否"
    })
  },


  chooseIntroImage: function(e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log("intro", res)
        that.setData({
          introFiles: that.data.introFiles.concat(res.tempFilePaths)
        });
      }
    })
  },
  previewIntroImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.introFiles // 需要预览的图片http链接列表
    })
  },

  chooseDetailImage: function(e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          detailFiles: that.data.detailFiles.concat(res.tempFilePaths)
        });
      }
    })
  },
  previewDetailImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.detailFiles // 需要预览的图片http链接列表
    })
  },

  choosePreImage: function(e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          "preFiles[0]": res.tempFilePaths[0]
        });
      }
    })
  },
  previewPreImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.preFiles // 需要预览的图片http链接列表
    })
  }

})