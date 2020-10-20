// pages/maxgame/maxgame.js
const app = getApp()
const utils = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    maxrodList:'',
    isIphoneX: false,
  },
  //跳转对局明细
  playgame: function (e) {
    console.log(e)
    var id = e.currentTarget.dataset.lid;
    var roomid = e.currentTarget.dataset.roomid;
    wx.setStorageSync('Groomids', roomid)
    wx.navigateTo({
      url: '/pages/gameDetail/gameDetail?id=' + id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    var that = this;
    const {score=1} = options;
    that.setData({
      "isIphoneX": this.isIphoneX(),
    })
    utils.sendRequest(app.globalData.publicAdress + 'api/myOneMaxScore', 'get', { 'userid': wx.getStorageSync('userId'),score})
      .then(function (response) {
        console.log(response)
        that.setData({
          maxrodList:response.data
        })
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
  onShareAppMessage: function () {

  }
})