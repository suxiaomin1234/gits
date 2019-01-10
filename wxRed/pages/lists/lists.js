// pages/lists/lists.js
var util = require('../../utils/util.js');
var app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [],
    page:1,  //页数
    count:'', //总页数
    noMess:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList();
  },
  getList(n){
    //获取列表数据
    let self = this;
    wx.request({
      url: app.globalData.url,
      data: {
        version: '1_0_0',
        opact: "EveryStock/historical",
        page: this.data.page,
        open_id: wx.getStorageSync('openid') || app.globalData.openid
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if(res.data.code == 1000){
          self.setData({
            count: res.data.data.count
          })
          if(res.data.data.count == 0){
            wx.hideLoading();
            self.setData({
              noMess:true
            })
            return
          }
          if (res.data.data.count >= self.data.page ){
              let arry = self.data.array.concat(res.data.data.list);
              self.setData({
                array: arry
              })
          }else{
              this.setData({
                noMess: true
              })
          }
          setTimeout(()=>{
            wx.hideLoading()
            wx.stopPullDownRefresh() //停止下拉刷新
          },2000)
         
        }
       
      },
      fail: function (err) {
        console.log('err' + err)
      }
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
    wx.showLoading({
      title: '加载中...',
    })
    this.getList(1);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
      wx.showLoading({
        title: '加载中...',
      })
    if (this.data.count == this.data.page ){
        this.setData({
          noMess:true
        })
        setTimeout(()=>{
           wx.hideLoading()
        },2000)
    }else{
      this.setData({
        page: this.data.page + 1
      })
      this.getList();
    }
      
    
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