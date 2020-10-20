// pages/kuckyDrawDetail/kuckyDrawDetail.js
const app = getApp();
const utils = require('../../utils/util');
var url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:"",
    detail:"",
    user:"",
    isIphoneX: false,
    publicimgUrl: app.globalData.publicimgUrl,
    status:0,
    pubAdress: app.globalData.publicAdress,
    couponUrl:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      id:options.id,
      "isIphoneX": this.isIphoneX(),
    })
    url = that.route + "?id=" + options.id
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            lang: "zh_CN",
            success: function (res) {
              that.getDetail();
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
  isIphoneX() {
    let mobile = wx.getSystemInfoSync();
    if (mobile.model.indexOf("iPhone X") >= 0) {
      return true;
    } else {
      return false;
    }
  },
  getDetail() {
    var that = this;
    utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.index/prizedetail?token=' + wx.getStorageSync("token"), 'post', { id: that.data.id })
      .then(function (response) {
        if (response.statusCode == 200) {
          //成功
          if (response.data.code == 1) {
            that.setData({
              detail: response.data.data.prize,
              user: response.data.data.user,
            })
            that.setData({
              status : response.data.data.prize.is_bm
            })
            for (var i = 0; i < response.data.data.prize.coupon.length ;i++){
              that.data.couponUrl.push(that.data.pubAdress+response.data.data.prize.coupon[i].imgurl)
            }
            console.log(that.data.couponUrl)
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
  //点击抽奖
  nowEnter:function(){
    var that = this;
    utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.index/joinPrize?token=' + wx.getStorageSync("token"), 'post', { pid: that.data.id })
      .then(function (response) {
        if (response.statusCode == 200) {
          //成功
          if (response.data.code == 1) {
            wx.showToast({
              title: response.data.msg,
              icon: "none",
              duration: 3000,
            })
            that.getDetail()
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
  LookPhotoList:function(e){
    const developer_file = e.currentTarget.dataset.photurl.split(",");
    var src = e.currentTarget.dataset.src
    wx.previewImage({
      current: src,
      urls: this.data.couponUrl
    })
  },
  // 点击图片进行大图查看
  LookPhoto: function (e) {
    
    const developer_file = e.currentTarget.dataset.photurl.split(",");
    var src = e.currentTarget.dataset.photurl
    wx.previewImage({
      current: src,
      urls: developer_file
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
    var that = this; 
    //status//  c_over   c_now
    if (that.data.status == 0 || that.data.status == 1){
      return {
        title: '抽奖',
        imageUrl: "/images/c_over.jpg"
      }
    } else if (that.data.status == 2){
      return {
        title: '抽奖',
        imageUrl: "/images/c_now.jpg"
      }
    }
    
  }
})