// pages/news/news.js
const app = getApp();
const utils = require('../../utils/util');
var url;//获取当前页面路径ons
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:"",//社群id
    list:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      id:options.id
    })
    url = that.route + "?id=" + options.id
  },
  newInfo:function(){
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            lang: "zh_CN",
            success: function (res) {
              let userInfo = res.userInfo;
              wx.removeStorageSync("baseUrl_to");
              utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.index/quannewInfo?token=' + wx.getStorageSync("token"), 'post', {"channel_id":that.data.id})
                .then(function (response) {
                  if (response.statusCode == 200) {
                    //成功
                    if (response.data.code == 1) {
                     that.setData({
                       list: response.data.data
                     })
                     //将消息设置为已读
                      that.setInfohidden();
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
            }
          })
        } else {
          wx.setStorageSync("baseUrl_to", url);
          wx.navigateTo({
            url: '../login/login',
          })
        }
      }
    })
  },
  //将消息设置为已读
  setInfohidden:function(){
    var that = this;
    utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.index/setInfohidden?token=' + wx.getStorageSync("token"), 'post', { "channel_id": that.data.id })
      .then(function (response) {
        if (response.statusCode == 200) {
          //成功
          if (response.data.code == 1) {
            // that.setData({
            //   list: response.data.data
            // })
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
    that.newInfo()
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