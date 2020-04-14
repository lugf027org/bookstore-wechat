const api = 'http://127.0.0.1:8080/wxWGSJ';

function requestWithAuth(opt) {
  var header = opt.header;
  if (!header) {
    header = {
      'content-type': 'application/json' // 默认值
    }
  }
  header['sessionId'] = getApp().globalData.sessionId
  header['userId'] = getApp().globalData.userId
  console.log("header", header)
  console.log("opt", opt)
  // set token
  wx.request({
    method: opt.method ? 'POST' : opt.method,
    url: api + opt.url,
    header: header,
    data: opt.data,
    success: function(res) {
      console.log("ajax", res);
      opt.success(res);
    },
    fail: err => {
      console.log("ajaxRequestWithAuth", err)
      opt.fail(res);
    }
  })
}

function requestWithoutAuth(req) {
  wx.request({
    method: opt.method ? 'POST' : opt.method,
    url: api + opt.url,
    header: {
      'content-type': 'application/json' // 默认值
    },
    data: opt.data,
    success: function(res) {
      if (res.data.code == 100) {
        if (opt.success) {
          opt.success(res.data);
        }
      } else {
        console.error(res);
        if (opt.success) {
          opt.fail(res.data);
        }
      }
    }
  })
}

function dealForbid() {

}

module.exports.requestWithAuth = requestWithAuth
module.exports.requestWithoutAuth = requestWithoutAuth
module.exports.api = api