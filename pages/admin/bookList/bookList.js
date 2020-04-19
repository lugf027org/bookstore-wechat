// pages/admin/bookList/bookList.js
const app = getApp()
const ajax = require("../../../utils/myAjax.js")
var sectionData = [];
var ifLoadMore = null;
var classifyId = null;
var page = 1; //默认第一页

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollH: 0,
    imgWidth: 0,
    loadingCount: 0,
    images: [],
    col1: [],
    col2: [],
    pageRequest: 0,
    pageSize: 10,
    bookList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // classifyId = options.classifyId;
    page = 1;
    ifLoadMore = null;
    console.log('classifyId:', options);

    wx.getSystemInfo({
      success: (res) => {
        let ww = res.windowWidth;
        let wh = res.windowHeight;
        let imgWidth = ww * 0.48;
        let scrollH = wh;

        this.setData({
          scrollH: scrollH,
          imgWidth: imgWidth
        });

        //加载首组图片
        this.getBooks();
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

  getBooks: function(){
    var that = this;
    ajax.requestWithAuth({
      url: '/admin/book/all',
      method: 'POST',
      data: {
        pageRequest: that.data.pageRequest,
        pageSize: that.data.pageSize,
      },
      success: res => {
        console.log("getBooksRes", res.data);
        that.setBooks(res.data.bookList);
      },
      fail: err => {
        console.log("getBooksErr", err);
      }
    })
  },

  setBooks: function (bookList) {
    var that = this;
    // var newGoodsData = this.data.bookList;
    var newGoodsData = bookList;
    page += 1;
    if (ifLoadMore) {
      //加载更多
      if (newGoodsData.length > 0) {
        console.log(newGoodsData);
        for (var i in newGoodsData) {
          //商品名称长度处理
          var name = newGoodsData[i].name;
          if (name.length > 26) {
            newGoodsData[i].name = name.substring(0, 23) + '...';
          }
          newGoodsData[i].previewUrl = ajax.api + "/resources" + newGoodsData[i].previewUrl
        }
        sectionData['brandGoods'] = newGoodsData;
      } else {
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

    } else {
      if (ifLoadMore == null) {
        ifLoadMore = true;
        for (var i in newGoodsData) {
          //商品名称长度处理
          var name = newGoodsData[i].name;
          if (name.length > 26) {
            newGoodsData[i].name = name.substring(0, 23) + '...';
          }
          newGoodsData[i].previewUrl = ajax.api + "/resources" + newGoodsData[i].previewUrl
        }
        sectionData['brandGoods'] = newGoodsData; //刷新
      } else {
        sectionData['brandGoods'] = newGoodsData; //刷新
      }
    }
    that.setData({
      brandGoods: sectionData['brandGoods'],
      loadingCount: sectionData['brandGoods'].length,
    });
    console.log("brandGoods", that.data.brandGoods);
    wx.stopPullDownRefresh(); //结束动画
  },

  // 加载图片
  onImageLoad: function(e) {
    console.log("onImgLoad1", e);

    let imageId = e.currentTarget.id;
    let oImgW = e.detail.width; //图片原始宽度
    let oImgH = e.detail.height; //图片原始高度
    let imgWidth = this.data.imgWidth; //图片设置的宽度
    //比例计算
    let scale = imgWidth / oImgW;
    let imgHeight = oImgH * scale; //自适应高度

    let images = this.data.brandGoods;
    let imageObj = null;

    for (let i = 0; i < images.length; i++) {
      let img = images[i];
      if (img.bookId + "" === imageId) {
        imageObj = img;
        break;
      }
    }

    imageObj.height = imgHeight;

    let loadingCount = this.data.loadingCount - 1;
    let col1 = this.data.col1;
    let col2 = this.data.col2;

    //判断当前图片添加到左列还是右列
    if (col1.length <= col2.length) {
      col1.push(imageObj);
    } else {
      col2.push(imageObj);
    }

    let data = {
      loadingCount: loadingCount,
      col1: col1,
      col2: col2
    };

    //当前这组图片已加载完毕，则清空图片临时加载区域的内容
    if (!loadingCount) {
      data.images = [];
    }

    this.setData(data);
    console.log("data", this.data)
  },

  catchTapCategory: function(e) {
    var that = this;
    var bookId = e.currentTarget.dataset.goodsid;
    console.log('bookId:' + bookId);
    //新增商品用户点击数量
    // that.goodsClickShow(goodsId);

    //跳转商品详情
    wx.navigateTo({
      url: '../bookDetail/bookDetail?bookId=' + bookId
    })
  },

  goodsClickShow(bookId) {
    console.log('增加商品用户点击数量');
    var that = this;
    ajax.requestWithoutAuth({
      method: 'POST',
      url: 'book/addGoodsClickRate',
      data: {
        bookId: bookId,
      },
      success: data => {
        console.log("goodsClickShow" + data)
      },
      fail: err => {
        console.log("goodsClickShowErr" + err)
      }
    })
  },
})