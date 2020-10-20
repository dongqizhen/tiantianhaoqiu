// pages/personal/personal.js
const app = getApp()
const utils = require('../../utils/util')
var url;//获取当前页面路径
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: false,
    personalInfo:"",
    message:"",
    checked:true,
    is_show:1,
    isHidden:true,
    isHidden2: false,
    is_pub:0,
    showModel: true,
      // is_show       是否显示我的位置，1= 显示，2= 隐藏
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      "isIphoneX": that.isIphoneX(),
    })
    url = that.route;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            lang: "zh_CN",
            success: function (res) {
              let userInfo = res.userInfo;
              // wx.removeStorageSync("baseUrl");
              that.setData({
                isHidden:false,
                isHidden2: true
              })
            }
          })
        } else {
          that.setData({
            isHidden: true,
            isHidden2: false
          })
          // wx.setStorageSync("baseUrl", url);
          // wx.navigateTo({
          //   url: '../login/login',
          // })
        }
      }
    })
    utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.common/getconfig', 'get')
      .then(function (response) {
        if (response.statusCode == 200) {
          //成功
          if (response.data.code == 1) {
            console.log(response.data.data)
            that.setData({
              mobile: response.data.data.mobile,
            })
          }

        }
      }, function (error) {
        console.log(error);
      })
    that.getPersonalInfo();
    that.getNoMessage();
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
          wx.setStorageSync("nickName", res.userInfo.nickName)
          app.globalData.nickName = wx.getStorageSync("nickName");
          wx.removeStorageSync("avatarUrl")
          wx.setStorageSync("avatarUrl", res.userInfo.avatarUrl)
          app.globalData.avatarUrl = wx.getStorageSync("avatarUrl");
          wx.setStorageSync("gender", res.userInfo.gender)
          app.globalData.gender = wx.getStorageSync("gender");//性别 0：未知、1：男、2：女

          utils.sendRequest(app.globalData.publicAdress + 'api/User/profile?token=' + wx.getStorageSync("token"), 'POST', { nickname: res.userInfo.nickName, avatar: res.userInfo.avatarUrl, gender: res.userInfo.gender })
            .then(function (response) {
              console.log(response)
              if (response.statusCode == 200) {
                that.onLoad();
                // var getUrl = wx.getStorageSync("baseUrl")
                // var grtUrl_to = wx.getStorageSync("baseUrl_to")
                // if (wx.getStorageSync("baseUrl_to")) {
                //   wx.navigateTo({
                //     url: '../../' + grtUrl_to,
                //   })
                // } else {
                //   wx.switchTab({
                //     url: '../index/index'
                //   })
                // }
              } else {
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
      wx.switchTab({
        url: '../personal/personal'
      })
    }
  },
  tel: function () {
    var that = this;
    if (that.data.mobile == "" || that.data.mobile == null || that.data.mobile == undefined) {
      wx.showToast({
        title: "没有留下联系方式！",
        icon: "none",
        duration: 3000,
      })
    } else {
      wx.makePhoneCall({
        phoneNumber: that.data.mobile,
      })
    }

  },
  //点击成长值
  growthValue:function(e){
    this.setData({
      showModel: false
    })
  },
  close: function () {
    this.setData({
      showModel: true
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
  //是否允许附近球友看到我的位置和头像
  switch1Change: function (e) {
    var that = this;
    if (e.detail.value == true){
      that.setData({
        is_show:1
      })
    } else if (e.detail.value == false){
      that.setData({
        is_show: 2
      })
    }
    utils.sendRequest(app.globalData.publicAdress + 'api/User/profile?token=' + wx.getStorageSync("token"), 'POST', { is_show: that.data.is_show})
      .then(function (response) {
        if (response.statusCode == 200) {
          if (response.data.code == 1) {
            wx.showToast({
              title: response.data.msg,
              icon: "none",
              duration: 1000,
            })
            // setTimeout(function () {
            //   wx.switchTab({
            //     url: '../personal/personal'
            //   })
            // }, 2000)
          } else {
            wx.showToast({
              title: response.data.msg,
              icon: "none",
              duration: 2000,
            })
          }


        } else {
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
  },
  getPersonalInfo: function () {
    var that = this;
    utils.sendRequest(app.globalData.publicAdress + 'api/user/index?token=' + wx.getStorageSync("token"), 'get')
      .then(function (response) {
        if (response.statusCode == 200) {
          //成功
          if (response.data.code == 1) {
            that.setData({
              personalInfo: response.data.data.userinfo,
              is_pub: response.data.data.userinfo.is_pub
            })
            wx.setStorageSync("is_pub", response.data.data.userinfo.is_pub)
            //is_pub 0=未认证，1=已认证，2=已提交资料待审核，3=已驳回
            // is_show       是否显示我的位置，1 = 显示，2 = 隐藏
            if (response.data.data.userinfo.is_show == 1){
                that.setData({
                  checked:true
                })
            } else if (response.data.data.userinfo.is_show == 2){
              that.setData({
                checked: false
              })
            }
          }

        }
      }, function (error) {
        console.log(error);
      })
  },
  //查询是否有未读消息
  getNoMessage:function(){
    var that = this;
    utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.user/unreadinfo?token=' + wx.getStorageSync("token"), 'get')
      .then(function (response) {
        if (response.statusCode == 200) {
          //成功
          if (response.data.code == 1) {
            that.setData({
              message: response.data.code
            })
          }else{
            that.setData({
              message: response.data.code
            })
          }

        }
      }, function (error) {
        console.log(error);
      })
  },
  //去个人信息
  toPersonal:function(){
    wx.navigateTo({
      url: '../personalInfo/personalInfo',
    })
  },
  //去我的约球页面
  toMyTreatyBall:function(){
    wx.navigateTo({
      url: '../myTreatyBall/myTreatyBall',
    })
  },
  //去关于我们页面
  toAboutUs:function(){
    wx.navigateTo({
      url: '../aboutUs/aboutUs',
    })
  },
  //我的社群
  tomyAssociation:function(){
    wx.navigateTo({
      url: '../myAssociation/myAssociation',
    })
  },
  //我的活动
  toMyActivity:function(){
    wx.navigateTo({
      url: '../myActivityList/myActivityList',
    })
  }, 
  //myDraw   我的抽奖
  // myDraw:function(){
  //   wx.navigateTo({
  //     url: '../myDraw/myDraw',
  //   })
  // },
  //创建社群
  createAssociation:function(){
    var that = this;
    wx.navigateTo({
      url: '../createAssociation/createAssociation',
    })
     //is_pub 0=未认证，1=已认证，2=已提交资料待审核，3=已驳回
    // if (that.data.is_pub == 0){
    //     wx.navigateTo({
    //       url: '../certification/certification',
    //     })
    // } else if (that.data.is_pub == 1){
    //   wx.navigateTo({
    //     url: '../createAssociation/createAssociation',
    //   })
    // } else if (that.data.is_pub == 2){
    //   wx.showToast({
    //     title: "审核中，请耐心等待",
    //     icon: "none",
    //     duration: 2000,
    //   })
    // } else if (that.data.is_pub == 3){
    //   wx.navigateTo({
    //     url: '../certification/certification',
    //   })
    //  }
   
  },
  //系统消息
  systemMessage:function(){
    wx.navigateTo({
      url: '../systemMessage/systemMessage',
    })
  },
  //去详情
  toDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/ballDetail/ballDetail?id=' + id,
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
    // var that = this;
    this.onLoad();
    this.getPersonalInfo();
    this.getNoMessage()
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
  onShareAppMessage: function (res) {
    return {
      title: '天天好球',
      path: '/pages/personal/personal',
    }
  }
})