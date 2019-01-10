
App({
  onLaunch: function () {
   let self = this;
   this.getCookie();
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          self.globalData.code = res.code;
          //发起网络请求
            wx.request({
              url: self.globalData.url,
              data: {
                code: res.code,
                version: '1_0_0',
                opact:"Wechat/getAccessToken"
              },
              method:'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                let session_key = res.data.data.session_key;
                let openid = res.data.data.openid;
                let is_bind = res.data.data.is_bind; //is_bind 为0 未绑定
                wx.setStorageSync('is_bind', is_bind);
                wx.setStorageSync('session_key', session_key);
                self.globalData.openid = openid;
                wx.setStorageSync('openid', openid);
                if (self.employIdCallback) {
                  self.employIdCallback(openid);
                }
              },

            })
          } else {
            // console.log('登录失败！' + res.errMsg)
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;
              
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.employIdCallback) {
                this.employIdCallback(res.userInfo);
              }
            }
          })
        }
      }
    })
    
  },
  getCookie(){
    let _this = this;
      wx.request({
        url: _this.globalData.url,
        data: {
          version: '1_0_0',
          opact: "Wechat/getSsId"
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success:function(res){
          _this.globalData.cookie = 'PHPSESSID=' + res.data.data
        }
      })
  },
  globalData: {
    userInfo: null,
    // url: 'http://mapi.hqjinrong.com/',//开发线接口
    url: 'https://mapi.jn.jyxuangu.com/', //正式线接口
    cookie: null,
    openid:null,
    ofs:0,
    code:null,
  }
})