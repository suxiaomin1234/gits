// pages/home/home.js
var app = getApp();
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
      title:"*****(600***)",
      ssymbol:"",
      sname:'',
      showTitle:true,
      reason:'没有理由，就是好',
      hours:'00',
      minutes:'00',
      seconds:'00',
     //未登录空，已登陆文案没有理由，就是好； 行情不好，免推
       //展示的数据
      list:"",
      news:'', //公告
      is_trade_day: '', //是否交易日 0不是，1是
      is_viper:'',
      stock_msg:'',
      times:'15:00:00',
      is_bind:0,
      showFen:false,
      head_img:'../../image/touxinag.png',
      vip_life:0,
      nick_name:'',
      tel:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (app.globalData.userInfo && app.globalData.userInfo != '') {
        this.getList();
    } else {
      this.getList();
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.employIdCallback = userInfo => {
        if (userInfo != '') {
           this.getList();
        }
      }
    }
  },
  getInfo(e){
    //获取用户信息
      let encryptedData = e.detail.encryptedData;
      let iv = e.detail.iv;
      let rawData = e.detail.rawData;
      let userInfo = e.detail.userInfo || null;
      let signature = e.detail.signature;
      let url = app.globalData.url; 
      var session_key = wx.getStorageSync('session_key');
    if (userInfo != null) {
          let self = this;
          wx.request({
              url: url,
              data: {
                version: '1_0_0',
                opact: "Wechat/getUserInfo",
                ssid_key: session_key,
                enData: encryptedData,
                iv: iv,
                open_id: wx.getStorageSync('openid') || app.globalData.openid
              },
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res) { 
                if(res.data.code == 1001){
                    wx.showToast({
                      title: res.data.msg,
                      icon:"none"
                    })
                }else{
                  wx.navigateTo({
                    url: '/pages/login/login',
                  })
                }
              },
          })

       }else{
         wx.showModal({
              title: '用户未授权',
              content: '拒绝授权将不能体验小程序完整功能，请确定授权',
         })
       }
      
    
  },
  goNext(e){
        wx.navigateTo({
          url: '/pages/lists/lists'
        })
    
    
  },
  timeComponet(){
     //时间计算
    //取得今天 00: 00: 00
    //const start = Date.parse(new Date(new Date(new Date().toLocaleDateString()).getTime()));
    //取得今天日期
    
    const data = new Date();
    let year = data.getFullYear(); //年
    let Month = data.getMonth()+1;   //月
    let day = data.getDate();  //日
    let endT = `${year}-${Month}-${day}`;
 
    let  endTime;
    let times = endT +" "+ this.data.times; 
    //苹果兼容times.replace(/-/g, '/')；
    endTime = new Date(times.replace(/-/g, '/')).getTime();
    //倒计时
    clearInterval(timeD);
    let timeD = setInterval(() => { 
          //取得今天当前日期
          let nowTime = new Date().getTime();
          //差的时间 
          const comTime = endTime - nowTime;
      
          if (comTime>=0) {
            //   var days = parseInt(leftTime/ 1000 / 60 / 60 / 24, 10); //计算剩余的天数 
            var hours = checkTime(parseInt(comTime / 1000 / 60 / 60 % 24, 10)); //计算剩余的小时 
            var minutes = checkTime(parseInt(comTime / 1000 / 60 % 60, 10));//计算剩余的分钟 
            var seconds = checkTime(parseInt(comTime / 1000 % 60, 10));//计算剩余的秒数 

            this.setData({
                hours: hours,
                minutes: minutes,
                seconds: seconds
            })
          }else{
            //清楚倒计时
              clearInterval(timeD); 
              this.getList(0);
          }

     },1000)


    function checkTime(i) { //将0-9的数字前面加上0，例1变为01 
      if (i < 10) {
        i = "0" + i;
      }
      return i;
    } 
    

  },
  getList(n){
     //列表数据
     let self = this;
    wx.showLoading({
      title: '加载中',
    })
     wx.request({
       url: app.globalData.url,
       method:'POST',
       header: {
         'content-type': 'application/x-www-form-urlencoded'
       },
       data: {
         version: '1_0_0',
         opact: "EveryStock/index",
         open_id: wx.getStorageSync('openid') || app.globalData.openid
       },
       success:(res)=>{

         if(res.data.code==1000){
           wx.hideLoading();
         }else{
           wx.hideLoading();
           wx.showToast({
             title: res.data.msg,
             icon: 'none',
             duration: 2000
           })
         }
         let first_one = res.data.data.first_one;
         let is_bind = res.data.data.is_bind; //是否绑定 0不是，1是
         let is_trade_day = res.data.data.is_trade_day; //交易日 0不是 1是
         let is_viper = res.data.data.is_viper;
         let list = res.data.data.list;
         let news = res.data.data.news;
         let remark = res.data.data.remark;
         let stock_msg = res.data.data.stock_msg;
         let api_info = res.data.data.api_info;
         let vip_life = res.data.data.vip_life;
         this.setData({
           vip_life: vip_life
         })
         if (api_info.length>0 || api_info!=''){
            this.setData({
              nick_name: api_info.nick_name ||'****',
              tel: api_info.tel,
              head_img: api_info.head_img || '../../image/touxinag.png'
            })
         }
         if (is_bind == 1) {
           this.setData({
             showFen: true
           })
           this.setData({
             times: '14:55:00'
           })
         }
         if (is_viper == 1) {
           //是vip
           this.setData({
             times: '14:00:00'
           })
         };
          if(first_one !=''){
            let sname = first_one.sname;
            let ssymbol = first_one.symbol||'';
            this.setData({
              showTitle: false,
              sname: sname,
              ssymbol: ssymbol
            });
          } else {
            console.log(1)
            this.setData({
              showTitle: true,
              sname: "今日免推",
              ssymbol: ''
            })
          }
         if (first_one.length == 0){
           this.setData({
             showTitle: true,
             sname: "今日免推",
             ssymbol: ''
           })
         }
          if (is_trade_day == 0) {
            this.setData({
              showTitle: true,
              sname: "今日休市",
              ssymbol: ''
            })
          } 

         this.setData({
           news: news,
           list:list,
           reason: remark,
           is_trade_day: is_trade_day, //是否交易日 0不是，1是
           is_viper: is_viper,
           stock_msg: stock_msg,
           is_bind: is_bind
         })
         if(n!=0){
           self.timeComponet()
         }
       }
     })
  },
  goFen:function(){
     //跳转分享页面
    wx.navigateTo({
      url: "/pages/share/share",
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
    if (app.globalData.ofs == 1){
      this.getList();
    }
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
  onShareAppMessage: function (res) {
    //转发时携带 shareTicket才能在回调中获取到shareTickets
      // wx.showShareMenu({
      //   withShareTicket: true
      // }); 
    return {
      title: '每日一股',
      path: '/pages/home/home',
      success: function (res) {
        console.log('转发成功')
        //调用分享接口
        util.formatShare()
        // var shareTickets = res.shareTickets;
        // if (shareTickets.length == 0) {
        //   return false;
        // }
        // wx.getShareInfo({
        //   shareTicket: shareTickets[0],
        //   success: function (res) {
        //     console.log(4)
        //     var encryptedData = res.encryptedData;
        //     var iv = res.iv;
        //   }
        // })
      },
      fail: function (res) {
        // 转发失败
          console.log('转发失败')
      }
    }    
  }
})