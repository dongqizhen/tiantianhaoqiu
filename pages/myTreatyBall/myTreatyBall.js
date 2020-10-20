// pages/myTreatyBall/myTreatyBall.js
const app = getApp()
const utils = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myList:"",
    isIphoneX: false,
    list: [],             //接收数据的数组
    windowHeight: "",     //适配设备的高度
    page: 1,              //记录加载数据的页数参数
    flag: true,            //记录是否请求数据的状态
    fee_type:""
  },
// {
//         teamId: 1,
//         name: 'AA'
//       },
//       {
//         teamId: 2,
//         name: '免费'
//       },
//       {
//         teamId: 3,
//         name: '抢台费'
//       },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var that = this;
    that.setData({
      "isIphoneX": this.isIphoneX(),
    })
    that.data.list = [];
    that.myList();
  },
  isIphoneX() {
    let mobile = wx.getSystemInfoSync();
    if (mobile.model.indexOf("iPhone X") >= 0) {
      return true;
    } else {
      return false;
    }
  },
  myList: function () {
    var that = this;
    this.setData({
      flag: false
    })
    //我发布的约球信息列表
    utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.user/myarchives?token=' + wx.getStorageSync("token"), 'get')
      .then(function (response) {
        if (response.statusCode == 200) {
          //成功
          if (response.data.code == 1) {
            // console.log(response.data.data)
            // that.setData({
            //   myList: response.data.data
            // })
            console.log(response.data.data.length)
            if (response.data.data.length < 5) {
              //       //记录请求状态，把reqState传值给flag
              var reqState = false;
            } else {
              var reqState = true;
            }
            //接收数据，保证每次都拼接上
            // var list = that.data.list.concat(response.data.data);
            //为下一页的请求参数做准备
            // var nextPage = ++that.data.page;
            that.setData({
              list: response.data.data,
              // page: nextPage,
              // flag: reqState
            })
          }

        }
      }, function (error) {
        console.log(error);
      })
  },
  toBallDateil:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/myBallDetail/myBallDetail?id=' + id,
    })
    
  },
  toMyBallDateil:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/ballDetail/ballDetail?id=' + id,
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
    var that = this;
    that.data.list = [];
    that.onLoad();
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
    // if (this.data.flag) {
    //     this.myList(this.data.page)
    // }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  // onReachBottom: function () {
  //   if (this.data.flag) {
  //     this.myList(this.data.page)
  //   }
  // },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})