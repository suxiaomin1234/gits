var app = getApp();
const formatShare = (date) => {
  //分享接口
  console.log(date)
  wx.request({
    url: app.globalData.url,
    data: {
      version: '1_0_0',
      opact: "EveryStock/saveViper",
      open_id: wx.getStorageSync('openid') || app.globalData.openid
    },
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
       console.log('分享成功');
      getApp().globalData.ofs = 1;
    },
    fail: function (err) {
      
    }
  })
}


module.exports = {
  formatShare: formatShare,
}
