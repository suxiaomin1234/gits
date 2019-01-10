// pages/suree/suree.js
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  goHome(){
     wx.navigateTo({
       url: '/pages/home/home',
     })
  },
  goFen(){
    wx.navigateTo({
      url: '/pages/share/share',
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
     getApp().globalData.ofs = 1;
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    getApp().globalData.ofs = 0;
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