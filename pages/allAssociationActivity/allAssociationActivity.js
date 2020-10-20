// pages/allAssociationActivity/allAssociationActivity.js
const app = getApp()
const utils = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,              //记录加载数据的页数参数
    flag: true,            //记录是否请求数据的状态
    list: [],
    id:"",
    type:"",
    address:"",
    nowDate: "",//系统当前时间
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var time = utils.formatTime(new Date());
    that.setData({
      id:options.id,
      nowDate: time.replace(/\./g, '-').substring(0, 16)
    })
  },
  pageList(page, type, address) {
    //把this对象复制到临时变量that
    var that = this;
    //打开记录请求的状态flag
    this.setData({
      flag: false
    })
    utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.index/pageList?page=' + that.data.page + "&token=" + wx.getStorageSync("token") + "&address=" + that.data.address + "&type=" + that.data.type +"&channel_id="+that.data.id, 'get')
      .then(function (response) {
        if (response.statusCode == 200) {
          //成功
          if (response.data.code == 1) {
            if (response.data.data.length < 5) {
              //记录请求状态，把reqState传值给flag
              var reqState = false;
            } else {
              var reqState = true;
            }
            //接收数据，保证每次都拼接上
            var list = that.data.list.concat(response.data.data);
            //为下一页的请求参数做准备
            var nextPage = ++that.data.page;
            that.setData({
              list: list,
              page: nextPage,
              flag: reqState,
            })
            
            
            
          } else if (response.data.code == 0) {
            that.data.list = [];
            that.setData({
              list: that.data.list
            })
          }
        }
      }, function (error) {
        console.log(error);
      })
  },
  //去活动详情
  toDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/activityDetail/activityDetail?id=' + id,
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
    that.pageList(that.data.page, that.data.type, that.data.address)
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

  onPullDownRefresh: function () {
    var that = this;
    //根据请求状态flag请求数据
    if (this.data.flag) {
      that.pageList(that.data.page, that.data.type, that.data.address)
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    //根据请求状态flag请求数据
    if (this.data.flag) {
      that.pageList(that.data.page, that.data.type, that.data.address)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})