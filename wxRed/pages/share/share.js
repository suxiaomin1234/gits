// pages/share/share.js
var util = require('../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wWidth: '',   //可用窗口宽度
    wHeight:'',   //可用窗口高度
    seting:'', //再次发起授权
    img:'',
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    this.opens();
    let self = this;
    //获取可用宽高
    wx.getSystemInfo({
      success: function (res) {
        //保存宽高
        self.setData({
          wWidth: res.windowWidth,  
          wHeight: res.windowHeight,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
        
  },
  fenSave() { 
    //获取相册授权
    let self = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) { 
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success(res) {
              self.canvesImag();
            },
            fail(res) {
              if(self.data.seting == ''){
                self.setData({
                  seting: 'openSetting'
                })
              }else{
                self.setData({
                  seting: ''
                })
              }
            }
          })
        }else{
          self.canvesImag();
        }
      }
    })
    
  },
  canvesImag(){
    // canvas画布转成图片
    let that = this
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 600,
      height: 1000,
      destWidth: 600,
      destHeight: 1000,
      fileType: 'jpg',
      canvasId: 'myCanvas',
      success: function (res) {
        //图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
            console.log(data);
            wx.showToast({
              title: '保存成功',
              icon: "none"
            })
            util.formatShare(0)
          },
          fail: function (err) {
            console.log(err);
            if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              console.log("用户一开始拒绝了，我们想再次发起授权")
              console.log('打开设置窗口')
            }
          }
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  // fenQun(){
      //分到群里去
    //   console.log(1)
    // wx.showShareMenu({
    //   withShareTicket: true
    // })
  // },
  opens(){
    let self = this;
    wx.request({
      url: app.globalData.url,
      data: {
        version: '1_0_0',
        opact: "Wechat/getWxCode"
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
          wx.downloadFile({
            url: res.data.data.code_img ,
            success: function (sres) { 
              self.setData({
                img: sres.tempFilePath
              });
              self.canvas();
            }, 
            fail: function (fres) {
            }
          })
          // wx.previewImage({
          //   current: res.data.data.code_img, // 当前显示图片的http链接  
          //   urls: [res.data.data.code_img], // 需要预览的图片http链接列表  
          // })
        }
    })
  },
  canvas(){
     //保存海报分享到朋友圈
    // 使用 wx.createContext 获取绘图上下文 context
      let self = this;
      var imgDown = '../../image/fenBack.png'
      var imgTop = '../../image/topImg.png';
      var context = wx.createCanvasContext('myCanvas')
      context.drawImage(imgTop, 0, 0, self.data.wWidth, 60);
      context.drawImage(imgDown, 0, 60, self.data.wWidth, self.data.wHeight);
  
      context.drawImage(self.data.img, self.data.wWidth/2-100, self.data.wHeight/2 + 25,200,200);
      // context.setFontSize(16)
      // context.setFillStyle("#d0d0d0")
      // context.fillText('长按扫码 获取牛股', self.data.wWidth/3-5, self.data.wHeight-60 )
      context.draw()
  
  },
  showcodes(e){
    //限制区域
    // if ((e.touches[0].x > 88 && e.touches[0].x < 255) && (e.touches[0].y > 280 && e.touches[0].y<450 )){
      // console.log(e.touches[0].x, e.touches[0].y)
       let img = this.data.img
        wx.previewImage({
          current: img, // 当前显示图片的http链接  
          urls: [img], // 需要预览的图片http链接列表  
        })
    // }
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