// pages/contact/contact.js
const app = getApp();
var inputVal = '';
var msgList = [];
var windowWidth = wx.getSystemInfoSync().windowWidth;
var windowHeight = wx.getSystemInfoSync().windowHeight;
var keyHeight = 0;
// const userSig = require("../../utils/GenerateTestUserSig")
// import TIM from 'tim-wx-sdk'; // 微信小程序环境请取消本行注释，并注释掉 import TIM from 'tim-js-sdk';
// // import COS from 'cos-js-sdk-v5';
// import COS from 'cos-wx-sdk-v5'; // 微信小程序环境请取消本行注释，并注释掉 import COS from 'cos-js-sdk-v5';
// let options = {
//   SDKAppID: '1400255392', // 接入时需要将0替换为您的即时通信应用的 SDKAppID
//   SECRETKEY: 'ee7ea34f007f93873e17a4394dc3f5afe7d29e747d0c01b9e14fd917a50a9b29'
// };
// // const _SECRETKEY = 'ee7ea34f007f93873e17a4394dc3f5afe7d29e747d0c01b9e14fd917a50a9b29';
// // 创建 SDK 实例，TIM.create() 方法对于同一个 SDKAppID 只会返回同一份实例
// let tim = TIM.create(options); // SDK 实例通常用 tim 表示
// tim.setLogLevel(1);
// // 注册 COS SDK 插件
// tim.registerPlugin({ 'cos-wx-sdk': COS });//如果聊天发送的是纯文字，这里不需要注册
/**
 * 初始化数据
 */
function initData(that) {
  inputVal = '';

  msgList = [{
    speaker: 'server',
    contentType: 'text',
    content: '欢迎来到英雄联盟，敌军还有30秒到达战场，请做好准备！'
  },
  {
    speaker: 'customer',
    contentType: 'text',
    content: '我怕是走错片场了...'
  }
  ]
  that.setData({
    msgList,
    inputVal
  })
}

/**
 * 计算msg总高度
 */
// function calScrollHeight(that, keyHeight) {
//  var query = wx.createSelectorQuery();
//  query.select('.scrollMsg').boundingClientRect(function(rect) {
//  }).exec();
// }
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: '100vh',
    inputBottom: 0,
    group_id:"",//群聊id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    initData(this);
    this.setData({
      cusHeadIcon: wx.getStorageSync("FaceUrl"),
      group_id: options.group_id
    });
    
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
   * 获取聚焦
   */
  focus: function (e) {
    keyHeight = e.detail.height;
    this.setData({
      scrollHeight: (windowHeight - keyHeight) + 'px'
    });
    this.setData({
      toView: 'msg-' + (msgList.length - 1),
      inputBottom: keyHeight + 'px'
    })
    //计算msg高度
    // calScrollHeight(this, keyHeight);

  },

  //失去聚焦(软键盘消失)
  blur: function (e) {
    this.setData({
      scrollHeight: '100vh',
      inputBottom: 0
    })
    this.setData({
      toView: 'msg-' + (msgList.length - 1)
    })

  },

  /**
   * 发送点击监听
   */
  sendClick: function (e) {
    var that = this;
    // msgList.push({
    //   speaker: 'customer',
    //   contentType: 'text',
    //   content: e.detail.value
    // })
    // inputVal = '';
    // this.setData({
    //   msgList,
    //   inputVal
    // });
    // let onSdkReady = function (event) {
    //   let message = tim.createTextMessage({ to: that.data.group_id, conversationType: TIM.TYPES.CONV_GROUP, payload: { text: e.detail.value } });
    //   // tim.sendMessage(message);
    //   // // 2. 发送消息
    //   let promise = tim.sendMessage(message);
    //   promise.then(function (imResponse) {
    //     // 发送成功
    //     msgList.push({
    //       speaker: 'customer',
    //       contentType: 'text',
    //       content: e.detail.value
    //     })
    //     inputVal = '';
    //     this.setData({
    //       msgList,
    //       inputVal
    //     });
    //     console.log(imResponse);
    //   }).catch(function (imError) {
    //     // 发送失败
    //     console.warn('sendMessage error:', imError);
    //   });
    //   tim.sendMessage(message);
    // };
    // tim.on(TIM.EVENT.SDK_READY, onSdkReady);
   
    // let message = tim.createTextMessage({
    //   to: that.data.group_id,
    //   conversationType: TIM.TYPES.CONV_C2C,
    //   payload: {
    //     text: e.detail.value
    //   }
    // });
    

  },

  /**
   * 退回上一页
   */
  toBackClick: function () {
    wx.navigateBack({})
  }

})