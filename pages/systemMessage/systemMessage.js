// pages/systemMessage/systemMessage.js
const app = getApp()
const utils = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.systemInfo()
  },

  systemInfo: function () {
    var that = this;
    utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.my/systemInfo?token=' + wx.getStorageSync("token"), 'post')
      .then(function (response) {
        if (response.statusCode == 200) {
          if (response.data.code == 1) {
            that.setData({
              list: response.data.data
            })
          } 
        }
      }, function (error) {
        console.log(error);
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

  }
})