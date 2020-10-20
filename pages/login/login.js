//index.js
//获取应用实例
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
  data: {
    motto: '欢迎来到天天好球，为能正常使用功能，请允许授权位置信息和头像。',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  // bindViewTap: function () {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },
  onLoad: function () {
    // 查看是否授权
   
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              lang: "zh_CN",
              success: function (res) {
                let userInfo = res.userInfo;
                var getUrl = wx.getStorageSync("baseUrl")
                if (wx.getStorageSync("baseUrl")) {
                  wx.switchTab({
                    url: "../../" + getUrl,
                  })
                  wx.removeStorageSync("baseUrl")
                } else {
                  wx.switchTab({
                    url: '../motion/motion'
                  })
                }
              }
            })
          } else {
            return
          }
        }
      })
    // }

    
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onShow: function () {

  },
  //点击取消按钮
  confirm_btn:function(){
    wx.removeStorageSync("isSCope")
    wx.removeStorageSync("isKill")
    wx.removeStorageSync("baseUrl")
    wx.removeStorageSync("baseUrl_to")
    wx.switchTab({
      url: '../motion/motion',
    })
    // wx.navigateBack({
    //   delta: 1
    // })
  },
  
  getUserInfo: function (e) {
    // console.log(e)
    var that = this;
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    if (e.detail.userInfo) {
      console.log("点击了同意授权");
      // 必须是在用户已经授权的情况下调用
      wx.getUserInfo({
        success: function (res) {
        console.log(res)
          wx.setStorageSync("nickName", res.userInfo.nickName)
          app.globalData.nickName = wx.getStorageSync("nickName");
          wx.removeStorageSync("avatarUrl")
          wx.setStorageSync("avatarUrl", res.userInfo.avatarUrl)
          app.globalData.avatarUrl = wx.getStorageSync("avatarUrl");
          wx.setStorageSync("gender", res.userInfo.gender)
          app.globalData.gender = wx.getStorageSync("gender");//性别 0：未知、1：男、2：女
          utils.sendRequest(app.globalData.publicAdress + 'api/User/profile?token=' + wx.getStorageSync("token"), 'POST', { nickname: res.userInfo.nickName, avatar: res.userInfo.avatarUrl, gender: res.userInfo.gender})
        .then(function (response) {
          if (response.statusCode == 200) {
            //生成签名    腾讯IM
            // wx.request({
            //   url: app.globalData.publicAdress + 'api/Im/get_user_sig',
            //   method: 'POST',
            //   data: {
            //     identifier: "1400255392" + wx.getStorageSync("userId")
            //   },
            //   success: function (response) {
            //     var sig = userSig.genTestUserSig(wx.getStorageSync("userId")); 
            //     let promise = tim.login({ userID: wx.getStorageSync("userId"), userSig: sig.userSig });
            //     wx.setStorageSync("sign", sig.userSig)
            //     promise.then(function (imResponse) {
            //       console.log(imResponse.data); // 登录成功
            //       //用户导入im
            //       utils.sendRequest(app.globalData.publicAdress + 'api/Im/channel?identifier=' + ('1400255392'+wx.getStorageSync("userId")) + '&FaceUrl=' + wx.getStorageSync("FaceUrl") + '&Nick=' + wx.getStorageSync("Nick"), 'post')
            //         .then(function (response) {
            //           if (response.statusCode == 200) {

            //             // Para
            //           }
            //         }, function (error) {
            //           console.log(error);
            //         })
            //     }).catch(function (imError) {
            //       console.warn('login error:', imError); // 登录失败的相关信息
            //     });
            //   }
            // })
            var getUrl = wx.getStorageSync("baseUrl")
            var grtUrl_to = wx.getStorageSync("baseUrl_to")
            if (wx.getStorageSync("baseUrl")) {
              if (!wx.getStorageSync("adress")) {
                wx.getLocation({
                  // type: 'gcj02',//默认wgs84
                  success: function (res) {
                    console.log(res)
                    const latitude = res.latitude
                    const longitude = res.longitude
                    const speed = res.speed
                    const accuracy = res.accuracy
                    wx.chooseLocation({
                      success: function (res) {
                        console.log(res);
                        that.setData({
                          location: {
                            latitude: res.latitude,
                            longtitude: res.longtitude,
                            name: res.name,
                            address: res.address
                          },
                          adress: res.address + res.name
                        })
                        wx.removeStorageSync("adress")
                        wx.setStorageSync("adress", res.name + res.address)
                        utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.user/setuseraddress?token=' + wx.getStorageSync("token") + '&address=' + that.data.adress, 'post')
                          .then(function (response) {
                            console.log(response)
                            // wx.switchTab({
                            //   url: '../index/index',
                            // })
                          }, function (error) {
                            console.log(error);
                          })
                        // app.globalData.adress = res.address + res.name
                      },

                    })
                  },
                  fail: function (res) {
                    // wx.hideLoading();
                    wx.getSetting({
                      success: (res) => {
                        console.log(res);
                        console.log(res.authSetting['scope.userLocation']);
                        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
                          //非初始化进入该页面,且未授权
                          wx.showModal({
                            title: '是否授权当前位置',
                            content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
                            success: function (res) {
                              if (res.cancel) {
                                console.info("1授权失败返回数据");

                              } else if (res.confirm) {
                                //village_LBS(that);
                                wx.openSetting({
                                  success: function (data) {
                                    console.log(data);
                                    if (data.authSetting["scope.userLocation"] == true) {
                                      wx.showToast({
                                        title: '授权成功',
                                        icon: 'success',
                                        duration: 2000
                                      })

                                      //再次授权，调用getLocationt的API
                                      // village_LBS(that);
                                    } else {
                                      wx.showToast({
                                        title: '授权失败',
                                        icon: 'success',
                                        duration: 5000
                                      })
                                    }
                                  }
                                })
                              }
                            }
                          })
                        } else {//初始化进入
                          wx.showModal({
                            title: '',
                            content: '请在系统设置中打开定位服务',
                            confirmText: '确定',
                            success: function (res) {
                              wx.setStorageSync("toPossition", "toPossition")
                              // wx.navigateTo({
                              //   url: "../login/login"
                              // })
                            }
                          })
                        }
                      }
                    })
                  }
                })
              }
              wx.switchTab({
                url: "../../" + getUrl,
              })
              // wx.removeStorageSync("baseUrl")
            } else if (wx.getStorageSync("baseUrl_to")){
              wx.navigateTo({
                url: '../../' + grtUrl_to,
              })
              
            } else {
              wx.switchTab({
                url: '../motion/motion'
              })
            }
          }else{
            wx.showToast({
              title: response.data.msg,
              icon: "none",
              duration: 3000,
            })
          }
        }, function (error) {
          console.log(error);
          wx.showToast({
            title: error.data.msg,
            icon: "none",
            duration: 3000,
          })
        })
        }
      })
    
      


      // wx.switchTab({
      //   url: '../index/index'
      // })

    } else {
      console.log("点击了拒绝授权");
      wx.removeStorageSync("isSCope")
      wx.removeStorageSync("isKill")
      wx.removeStorageSync("baseUrl")
      wx.removeStorageSync("baseUrl_to")
      wx.switchTab({
        url: '../motion/motion'
      })
    }
  },
  onShareAppMessage: function (res) {
    return {
      title: '天天好球',
      path: '/pages/login/login',
    }
  }
})
