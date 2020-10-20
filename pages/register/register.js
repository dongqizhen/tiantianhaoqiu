const app = getApp()
const utils = require('../../utils/util')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    phone: '',//手机号
    code: '',//验证码
    iscode: null,//用于存放验证码接口里获取到的code
    codename: '获取验证码',
    disabled:false
  },
  getPhoneValue: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  getCodeValue: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  getCode: function () {
    var a = this.data.phone;
    var _this = this;
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    if (this.data.phone == "") {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (!myreg.test(this.data.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else {
      utils.sendRequest(app.globalData.publicAdress + 'api/sms/send?mobile=' + _this.data.phone + '&event=' + "changemobile", 'get')
        .then(function (response) {
          // console.log(response.data.data)
          // _this.setData({
          //   iscode: response.data.data
          // })
          if (response.statusCode == 200) {
            //验证码
            wx.showToast({
              title: '验证码' + response.data.msg,
              icon: 'none',
              duration: 2500
            })
            if (response.data.code == 1){
              var num = 61;
              var timer = setInterval(function () {
                num--;
                if (num <= 0) {
                  clearInterval(timer);
                  _this.setData({
                    codename: '重新发送',
                    disabled: false
                  })
                } else {
                  _this.setData({
                    codename: num + "s",
                    disabled: true
                  })
                }
              }, 1000)
              
            }else{
              //验证码
              wx.showToast({
                title: '验证码' + response.data.msg,
                icon: 'none',
                duration: 2500
              })
            }
            
            
          }else{
            wx.showToast({
              title: response.data.msg,
              icon: 'none',
              duration: 2500
            })
          }

         
        }, function (error) {
          // console.log(error);
        })
    }

  },
  //获取验证码
  getVerificationCode() {
    this.getCode();
    var _this = this
    _this.setData({
      disabled: false
    })

  },
  //点击取消按钮
  confirm_btn:function(){
    wx.switchTab({
      url: '../index/index',
    })
  },
  //提交表单信息
  login: function () {
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    if (this.data.phone == "") {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (!myreg.test(this.data.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (this.data.code == "") {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else {
      wx.setStorageSync('phone', this.data.phone);
      utils.sendRequest(app.globalData.publicAdress + 'api/User/changemobile?token=' + wx.getStorageSync("token"), 'post', { mobile: this.data.phone, captcha: this.data.code })
        .then(function (response) {
          // console.log(response.data.data)  
          if (response.statusCode == 200) {
            if (response.data.code == 1){
              var getUrl = wx.getStorageSync("baseUrl")
              if (wx.getStorageSync("baseUrl")) {
                wx.switchTab({
                  url: "../../" + getUrl,
                })
                wx.removeStorageSync("baseUrl")
              } else if (wx.getStorageSync("baseUrl1")){
                wx.navigateTo({
                  url: "../../" + wx.getStorageSync("baseUrl1"),
                })
                wx.removeStorageSync("baseUrl1")
              }else{
                wx.showToast({
                  title: response.data.msg,
                  icon: 'none',
                  duration: 2500
                })
                setTimeout(function () {
                  wx.switchTab({
                    url: '../index/index',
                  })
                }, 2000)
                //成功
               
              }
              
            }else{
              wx.showToast({
                title: response.data.msg,
                icon: 'none',
                duration: 2500
              })
            }
           
            
          }
        }, function (error) {
          // console.log(error);
        })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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