
const app = getApp()
const utils = require('../../utils/util')
// const userSig = require("../../utils/GenerateTestUserSig")
// import TIM from 'tim-wx-sdk'; // 微信小程序环境请取消本行注释，并注释掉 import TIM from 'tim-js-sdk';
// // import COS from 'cos-js-sdk-v5';
// import COS from 'cos-wx-sdk-v5'; // 微信小程序环境请取消本行注释，并注释掉 import COS from 'cos-js-sdk-v5';
// let options = {
//   SDKAppID: '1400255392', // 接入时需要将0替换为您的即时通信应用的 SDKAppID
//   // SECRETKEY: 'ee7ea34f007f93873e17a4394dc3f5afe7d29e747d0c01b9e14fd917a50a9b29'
// };
// // const _SECRETKEY = 'ee7ea34f007f93873e17a4394dc3f5afe7d29e747d0c01b9e14fd917a50a9b29';
// // 创建 SDK 实例，TIM.create() 方法对于同一个 SDKAppID 只会返回同一份实例
// let tim = TIM.create(options); // SDK 实例通常用 tim 表示
// tim.setLogLevel(1);
// // 注册 COS SDK 插件
// tim.registerPlugin({ 'cos-wx-sdk': COS });//如果聊天发送的是纯文字，这里不需要注册
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //生成签名

    // wx.request({
    //   url: app.globalData.publicAdress + 'api/Im/get_user_sig',
    //   method: 'POST',
    //   data: {
    //     identifier:"1400255392"+ wx.getStorageSync("userId")
    //   },
    //   success: function (response) {
    //     console.log(response.data)
    //     var sig = userSig.genTestUserSig(wx.getStorageSync("userId"));
    //     console.log(sig.userSig)
    //     let promise = tim.login({ userID: wx.getStorageSync("userId"), userSig: sig.userSig});
    //         promise.then(function (imResponse) {
    //           console.log(imResponse.data); // 登录成功
    //         }).catch(function (imError) {
    //           console.warn('login error:', imError); // 登录失败的相关信息
    //         });
    //   }
    // })
    
    
      //用户导入im
    // utils.sendRequest(app.globalData.publicAdress + 'api/Im/channel?identifier=' + wx.getStorageSync("userId") + '&FaceUrl=' + wx.getStorageSync("FaceUrl") + '&Nick=' + wx.getStorageSync("Nick"), 'post')
    //   .then(function (response) {
    //     if (response.statusCode == 200) {
          
    //       // Para
    //     }
    //   }, function (error) {
    //     console.log(error);
    //   })
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

  },
})