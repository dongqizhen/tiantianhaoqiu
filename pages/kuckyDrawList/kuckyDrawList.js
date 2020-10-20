// pages/kuckyDrawList/kuckyDrawList.js
const app = getApp();
const utils = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    channel_id:"",
    list:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      channel_id: options.channelid
    })
    that.getList();
  },
  getList(){
    var that = this;
    utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.index/prizeList', 'post', { channel_id: that.data.channel_id})
      .then(function (response) {
        if (response.statusCode == 200) {
          //成功
          if (response.data.code == 1) {
            that.setData({
              list: response.data.data
            })

          } else if (response.data.code == 0) {
            that.data.list = [];
            that.setData({
              list: that.data.list
            })
          } else {
            wx.showToast({
              title: response.data.msg,
              icon: "none",
              duration: 3000,
            })
          }
        }
      }, function (error) {
        console.log(error);
      })
  },
  // toDetail:function(e){
  //   var id = e.currentTarget.dataset.id;
  //   wx.redirectTo({
  //     url: '/pages/kuckyDrawDetail/kuckyDrawDetail?id=' + id,
  //   })
  // },
  
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