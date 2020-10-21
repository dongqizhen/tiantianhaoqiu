// pages/motion/motion.js
const app = getApp()
const utils = require('../../utils/util')
var url;//获取当前页面路径
Page({

  /**
   * 页面的初始数据
   */
  data: {
    motionList:'',
    winscore:'',
    onescore:'',
    index:0,//选择器默认下标
    onerod:'',
    titleArray:[
      '斯诺克147','中式107','斯诺克75','中⼋','九球','追分','抢兔⼦'
    ]
  },
  //跳转总得分明细
  scoreDetail(e){
    wx.navigateTo({
      url: '/pages/scoreDetail/scoreDetail?index='+this.data.index,
    })
  },
  //扫一扫
  getScancode: function () {
    var _this = this;
    // 允许从相机和相册扫码
     wx.scanCode({
    success: (res) => {
      console.log(res)
      // var room_id='36'
      // var side='A'
      var url=res.path
      var urls=decodeURIComponent(url)
      var str1=urls.indexOf('?')
      var joinstr = urls.substring(str1+1)//取？后的字符
      var str2=joinstr.indexOf(',')
      var roomid= joinstr.substring(6,str2)  //取,前的字符
      var side= joinstr.substring(str2+1) //取,后的字符
      wx.request({
        url: app.globalData.publicAdress + 'api/joinRoom',
        method: 'POST',
        header: {
          'content-type': 'application/json', // 默认值
          'Accept': 'application/vnd.cowsms.v2+json',
          'Authorization': 'Bearer ' + wx.getStorageSync("token"),
        },
        data: {
          "userid":wx.getStorageSync('userId'),
          "room_id": roomid,
          "side": side
        },
        success: function (res) {
          console.log(res)
          if (res.statusCode == 200){
            wx.showToast({
              title: res.data.mes,
              icon: 'none',
              duration: 2000//持续的时间
            })
          }else{
            wx.showToast({
              title: res.data.mes,
              icon: 'none',
              duration: 2000//持续的时间
            })
          }
        },error: function (error) {
          console.log(error)
        },
      })
    }
  })

  },
  //切换选择玩法
  bindPickerChange(e){
    console.log(e)
    
    if(e.detail.value >2){

    }else{
      this.setData({
        index: e.detail.value
      })
      this.getData()
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    var that=this;
    this.getData();
      //从外部扫码
    if(options && options.scene){
      // wx.setStorageSync('scene', options.scene)
      // console.log('1:',wx.getStorageSync('scene'))
      url = that.route;
      // 查看是否授权
      wx.getSetting({
        success: function (res) {
          console.log(res)
          // if (wx.getStorageSync('scene')) {
            // var scenes = wx.getStorageSync('scene')
            var scene = decodeURIComponent(options.scene)
            // var url=res.path
            var urls = decodeURIComponent(scene)
            var str = urls.indexOf(',')
            var roomid = urls.substring(0, str)  //取,前的字符
            var side = urls.substring(str + 1) //取,后的字符
            wx.request({
              url: app.globalData.publicAdress + 'api/joinRoom',
              method: 'POST',
              header: {
                'content-type': 'application/json', // 默认值
                'Accept': 'application/vnd.cowsms.v2+json',
                'Authorization': 'Bearer ' + wx.getStorageSync("token"),
              },
              data: {
                "userid": wx.getStorageSync('userId'),
                "room_id": roomid,
                "side": side
              },
              success: function (res) {
                console.log(res)
                if (res.statusCode == 200) {
                  wx.showToast({
                    title: res.data.mes,
                    icon: 'none',
                    duration: 2000//持续的时间
                  })
                  // wx.removeStorageSync('scene');
                } else {
                  // wx.removeStorageSync('scene');
                  wx.showToast({
                    title: res.data.mes,
                    icon: 'none',
                    duration: 2000//持续的时间
                  })
                }
              }, error: function (error) {
                console.log(error)
              },
            })
          // }
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              lang: "zh_CN",
              success: function (res) {
                let userInfo = res.userInfo;
                wx.removeStorageSync("baseUrl");
              }
            })
          } else {
            wx.setStorageSync('scene', options.scene)
            wx.setStorageSync("baseUrl", url);
            wx.navigateTo({
              url: '../login/login',
            })
          }
        }
      })
    }
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            lang: "zh_CN",
            success: function (res) {
              if (wx.getStorageSync('scene')) {
                var scenes = wx.getStorageSync('scene')
                var scene = decodeURIComponent(scenes)
                // var url=res.path
                var urls = decodeURIComponent(scene)
                var str = urls.indexOf(',')
                var roomid = urls.substring(0, str)  //取,前的字符
                var side = urls.substring(str + 1) //取,后的字符
                wx.request({
                  url: app.globalData.publicAdress + 'api/joinRoom',
                  method: 'POST',
                  header: {
                    'content-type': 'application/json', // 默认值
                    'Accept': 'application/vnd.cowsms.v2+json',
                    'Authorization': 'Bearer ' + wx.getStorageSync("token"),
                  },
                  data: {
                    "userid": wx.getStorageSync('userId'),
                    "room_id": roomid,
                    "side": side
                  },
                  success: function (res) {
                    console.log(res)
                    if (res.statusCode == 200) {
                      wx.showToast({
                        title: res.data.mes,
                        icon: 'none',
                        duration: 2000//持续的时间
                      })
                      // wx.removeStorageSync('scene');
                    } else {
                      // wx.removeStorageSync('scene');
                      wx.showToast({
                        title: res.data.mes,
                        icon: 'none',
                        duration: 2000//持续的时间
                      })
                    }
                  }, error: function (error) {
                    console.log(error)
                  },
                })
              }
              
            }
          })
        } else {
          // that.setData({
          //   isHidden: true,
          //   isHidden2: false
          // })
        }
      }
    })

  },
  //获取数据
  async getData(){
    let that= this;
    wx.showLoading({
      title:'加载中...'
    })
    await utils.sendRequest(app.globalData.publicAdress + 'api/sport', 'get', { "userid": wx.getStorageSync('userId'),score:(this.data.index==0?1:this.data.index == 1?3:2) })
    .then( (response)=> {
      console.log(response)
      if (response.statusCode == 200) {
        var all = response.data.all  //总局数
        var win = response.data.win  //胜局数
        var allscore = response.data.all_score  //总得分
        var winscore = Math.round(win / all * 10000) / 100.00
        var onescore = Math.round(allscore / all * 100) / 100.00
        var onerod = Math.round(allscore / response.data.rod * 100) / 100.00
        that.setData({
          motionList: response.data,
          winscore: winscore,
          onescore: onescore,
          onerod: onerod
        })
      }
    }).finally(()=>{
      wx.hideLoading({
        complete:()=>{}
      })
    })
  },

//跳转单局最高页面
  toMaxgame:function(e){
    const score = this.data.index == 0 ? 1 :this.data.index == 1 ? 3 : 2
    wx.navigateTo({
      url: '/pages/maxgame/maxgame?score='+score,
    })
  },
  //跳转单杆最高分
  toMaxrod:function(e){
    const score = this.data.index == 0 ? 1 :this.data.index == 1 ? 3 : 2
    wx.navigateTo({
      url: '/pages/maxrod/maxrod?score='+ score,
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
    var that=this
    that.onLoad()
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            lang: "zh_CN",
            success: function (res) {
              // console.log('mm:',wx.getStorageSync('scene'))
              if (wx.getStorageSync('scene')) {
                var scenes = wx.getStorageSync('scene')
                var scene = decodeURIComponent(scenes)
                // var url=res.path
                var urls = decodeURIComponent(scene)
                var str = urls.indexOf(',')
                var roomid = urls.substring(0, str)  //取,前的字符
                var side = urls.substring(str + 1) //取,后的字符
                wx.request({
                  url: app.globalData.publicAdress + 'api/joinRoom',
                  method: 'POST',
                  header: {
                    'content-type': 'application/json', // 默认值
                    'Accept': 'application/vnd.cowsms.v2+json',
                    'Authorization': 'Bearer ' + wx.getStorageSync("token"),
                  },
                  data: {
                    "userid": wx.getStorageSync('userId'),
                    "room_id": roomid,
                    "side": side
                  },
                  success: function (res) {
                    console.log(res)
                    if (res.statusCode == 200) {
                      wx.showToast({
                        title: res.data.mes,
                        icon: 'none',
                        duration: 6000//持续的时间
                      })
                      wx.removeStorageSync('scene');
                    } else {
                      wx.removeStorageSync('scene');
                      wx.showToast({
                        title: res.data.mes,
                        icon: 'none',
                        duration: 6000//持续的时间
                      })
                    }
                  }, error: function (error) {
                    console.log(error)
                  },
                })
              }
              
            }
          })
        } else {

        }
      }
    })
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