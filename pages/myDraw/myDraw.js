// pages/association/association.js
const app = getApp()
const utils = require('../../utils/util')
var urls;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /** 
            * 页面配置 
            */
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    // page: 1,              //记录加载数据的页数参数
    // flag: true,            //记录是否请求数据的状态
    list: [],
    pubAdress:app.globalData.publicAdress
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({

      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }

    });
    //我参加的活动
    that.joinPage();
  
  },
  //我参加的活动

  joinPage(page) {
    //把this对象复制到临时变量that
    var that = this;
    utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.coupon/userCoupon?token=' + wx.getStorageSync("token"), 'get')
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
          }
        }
      }, function (error) {
        console.log(error);
      })
  },

  cancel_btn:function(e){
    var that = this;
    console.log(e)
    var id = e.currentTarget.dataset.id
    wx.showModal({
      title: '核销确认',
      content: '您确认要核销该优惠券吗',
      confirmText: "确认",
      cancelText: "取消",
      // cancelColor:"",
      confirmColor: "#7966FE",
      success(res) {
        if (res.confirm) {
          utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.index/couponUse?id=' + id + '&token=' + wx.getStorageSync("token"), 'get')
            .then(function (response) {
              if (response.statusCode == 200) {
                //成功
                if (response.data.code == 1) {
                  wx.showToast({
                    title: response.data.msg,
                    icon: "success",
                    duration: 3000,
                  })
                  that.joinPage();
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
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
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
  // onShareAppMessage: function () {

  // }
})