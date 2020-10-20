// pages/aboutUs/aboutUs.js
const app = getApp()
const utils = require('../../utils/util')
var WxParse = require('../../utils/wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: false,
    mobile:"",
    about:"",
    artText: {}
  },
  //拨打客服电话
  tel: function () {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.mobile,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      "isIphoneX": this.isIphoneX(),
    })
    var that = this;
    utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.common/getconfig', 'get')
      .then(function (response) {
        if (response.statusCode == 200) {
          //成功
          if (response.data.code == 1) {
            console.log(response.data.data)
            that.setData({
              mobile: response.data.data.mobile,
              artText: response.data.data.about,
            })
            WxParse.wxParse("artText", "html", that.data.artText, that, 0)
          }

        }
      }, function (error) {
        console.log(error);
      })
  },
  isIphoneX() {
    let mobile = wx.getSystemInfoSync();
    if (mobile.model.indexOf("iPhone X") >= 0) {
      return true;
    } else {
      return false;
    }
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
  onShareAppMessage: function (res) {
    return {
      title: '天天好球',
      path: '/pages/aboutUs/aboutUs',
    }
  }
})