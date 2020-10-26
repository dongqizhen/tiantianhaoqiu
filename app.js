//app.js
// require("./common/manifest.js")
// require("./utils/GenerateTestUserSig.js")
// require("./common/vendor.js")

App({
  onLaunch () {
    wx.getSystemInfo({
      success: e => {
        let custom = wx.getMenuButtonBoundingClientRect();

        let statusBarHeight = e.statusBarHeight,
        navTop = custom.top,//胶囊按钮与顶部的距离
        gapHeight= navTop - statusBarHeight, //间距
        navHeight = statusBarHeight + custom.height + (custom.top - statusBarHeight)*2;//导航高度

        this.globalData.navTop = navTop;
        this.globalData.StatusBar = e.statusBarHeight;
        this.globalData.gapHeight = gapHeight;
        this.globalData.Custom = custom;
        this.globalData.windowHeight = e.windowHeight;

        this.globalData.CustomBar = navHeight;
      }
    })
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.login({
      success: res => {
        //用户信息
        // https://tq.wooloo.top/
        //http://tq-test.wooloo.top/
        wx.request({
          url: 'https://tq.wooloo.top/addons/third/index/connect?code=' + res.code + '&platform=' +"wxapp",
          // data: {
          //   code: res.code,
          //   platform: "wxapp"
          // },
          method: 'get',
          success: function (response) {
            if (response.statusCode == 200) {
              if (response.data.code == 1){
                //用code  换后台的token
                wx.removeStorageSync("FaceUrl");
                wx.setStorageSync("token", response.data.data.userInfo.token);
                wx.setStorageSync("userId", response.data.data.userInfo.id)
                wx.setStorageSync("FaceUrl", response.data.data.userInfo.avatar)
                wx.setStorageSync("Nick", response.data.data.userInfo.nickname)
            // globalData.token = res.data.data.userInfo.token;
              }else{
                wx.showToast({
                  title: response.data.msg,
                  icon: "none",
                  duration: 3000,
                })
              }
            }

          },
          fail: function (res) {
            console.log("失败");
          }
        })
      }
    })
    this.checkForUpdate();
    // this.autoUpdate()
    // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })
    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },
  //检查微信小程序是否最新版本

  checkForUpdate: function () {

    const updateManager = wx.getUpdateManager()

    updateManager.onUpdateReady(function () {

      wx.showModal({

        title: '更新提示',

        content: '新版本已经准备好，是否重启应用？',

        success: function (res) {

          if (res.confirm) {

            updateManager.applyUpdate()

          }

        }

      })

    })

    updateManager.onUpdateFailed(function () {

      wx.showModal({
        title: '提示',
        content: '检查到有新版本，但下载失败，请检查网络设置',
        showCancel: false,
      })
     })

  },

  globalData: {
    userInfo: null,
    // publicAdress:"http://tq-test.wooloo.top/",
    publicAdress:"https://tq.wooloo.top/",
    publicimgUrl:"https://tq.wooloo.top/",
    // publicimgUrl: "http://tq-test.wooloo.top/",
    // openid:"",
    token: wx.getStorageSync("token"),
    nickName:null,
    avatarUrl:null,
    gender:"",
    mobile:"",
    adress:"",
    StatusBar: '',
    Custom: '',
    CustomBar: '',
    gapHeight:'',
    navTop:'',
    windowHeight:''
  }
})