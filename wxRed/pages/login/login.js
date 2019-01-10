// pages/login/login.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    preventD(){},  //阻止遮罩下的页面滚动，真机有效
    phone:'',      //手机号
    code:"",       //短信验证
    showFen:false,   //分享按钮显示
    codeget:'获取验证码',
    onOff:true,
    openid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  bindInput: function (event){
    let n = event.currentTarget.dataset.inputnum;
    if(n == 0){
      //获取手机号
      let phones = event.detail.value.replace(/[^\d]/g, '') 
      this.setData({
        phone: phones
      });
    }else if(n == 1){
       //获取验证码
      this.setData({
        code: event.detail.value
      });
    }
    console.log(this.data.phone, this.data.code)
  },
  codeBtn(){
      //获取验证码
      if(this.data.phone == ''){
          wx.showToast({
            title: '请输入手机号',
            icon:"none",
          })
      } else if (!/^1[34578]\d{9}$/.test(this.data.phone)){
          wx.showToast({
            title: '请输入正确的手机号',
            icon: "none",
          })
      } else if (this.data.phone.length<11){
          wx.showToast({
            title: '请输入正确的手机号',
            icon: "none",
          })
      } else if (this.data.onOff == true){
           wx.request({
                url: app.globalData.url,
                method:'POST',
                header: {
                  'content-type': 'application/x-www-form-urlencoded', 'Cookie': app.globalData.cookie
                },
                data:{
                  version: '1_0_0',
                  opact: "Reg/sendsms",
                  tel:this.data.phone,
                  open_id: wx.getStorageSync('openid') || app.globalData.openid
                },
                success:(res)=>{
                  if(res.data.data.code == 1000){
                    wx.showToast({
                      title: res.data.data.msg,
                      icon: "none",
                    });
                    this.timesD();
                    this.setData({
                       onOff:false
                    })
                  }else{
                    this.setData({
                      onOff:true
                    })
                    wx.showToast({
                      title: res.data.data.msg,
                      icon: "none",
                    });
                  }
                }
           })
      }
  },
  timesD(){
      //倒计时
      let n=60;
      let self = this;
      clearInterval(timeO);
      let timeO = setInterval(()=>{
          n--;
          if(n<=0){
             self.setData({
                codeget:'重新获取'
             });
             clearInterval(timeO);
             self.setData({
                onOff: true
             })
          }else{
            self.setData({
              codeget: n+' S'
            })
          }
      },1000)
  },
  goToBtn() {
      //绑定验证
      if(this.data.phone == ""){
          wx.showToast({
            title: '请输入手机号',
            icon: "none",
          })
      }else if(this.data.code == ""){
        wx.showToast({
          title: '请输入验证码',
          icon: "none",
        })
      }else{
          wx.request({
            url: app.globalData.url,
            header: {
              'content-type': 'application/x-www-form-urlencoded', 'Cookie': app.globalData.cookie
            },
            method:'POST',
            data:{
              version: '1_0_0',
              opact: "Reg/smsLogin",
              tel:this.data.phone,
              sms_code:this.data.code,
              soure:"wechat_mini",
              open_id: wx.getStorageSync('openid') || app.globalData.openid
            },
            success:(res)=>{
               if(res.data.code == 1000){
                  this.bindtel();
               }else{
                 wx.showToast({
                   title: res.data.msg,
                   icon: "none",
                 });
               }
            }
          })
      }

  },
  bindtel(){
     //绑定
     let self = this;
    wx.request({
      url: app.globalData.url,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        version: '1_0_0',
        opact: "Wechat/bindUserApi",
        tel: this.data.phone,
        open_id: wx.getStorageSync('openid') || app.globalData.openid
      },
      success: (res) => {
        if (res.data.code == 1000) {
          self.govip();
          wx.redirectTo({
            url: '/pages/suree/suree',
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: "none",
          })
          setTimeout(() => {
            wx.navigateTo({
              url: '/pages/home/home',
            })
          },2000)
        }
      }
    })
  },
  govip(){
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
         console.log('成功');
      },
      fail: function (err) {

      }
    })
  },
  gos(){
    wx.navigateTo({
      url: '/pages/home/home?id=1'
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '每日一股',
      path: '/pages/home/home',
      success: function (res) {
        //调用分享接口
        util.formatShare()
      },
      fail: function (res) {
        // 转发失败
        console.log('转发失败')
      }
    }    
  }
})