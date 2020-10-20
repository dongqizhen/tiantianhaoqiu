//index.js
//获取应用实例
const app = getApp()
const utils = require('../../utils/util')
var url;//获取当前页面路径
//获取当前时间戳  
var timestamp = Date.parse(new Date());
timestamp = timestamp / 1000;

//获取当前时间  
var n = timestamp * 1000;
var date = new Date(n);
//年  
var Y = date.getFullYear();
//月  
var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
//日  
var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
//时  
var h = date.getHours();
//分  
var m = date.getMinutes();
//秒  
var s = date.getSeconds();
//时间、时间戳加减 以加一天举例，聪明的你肯定触类旁通  
//加一天的时间戳：  
var tomorrow_timetamp = timestamp + 24 * 60 * 60;
//加一天的时间：  
var n_to = tomorrow_timetamp * 1000;
var tomorrow_date = new Date(n_to);
//加一天的年份  
var Y_tomorrow = tomorrow_date.getFullYear();
//加一天的月份  
var M_tomorrow = (tomorrow_date.getMonth() + 1 < 10 ? '0' + (tomorrow_date.getMonth() + 1) : tomorrow_date.getMonth() + 1);
//加一天的日期  
var D_tomorrow = tomorrow_date.getDate() < 10 ? '0' + tomorrow_date.getDate() : tomorrow_date.getDate();
//  加两天的时间
var afterTomorrow_timetamp = timestamp + 48 * 60 * 60;
//加两天的时间：
var aftern_to = afterTomorrow_timetamp * 1000;
var aftertomorrow_date = new Date(aftern_to);
//加两天后的年份
var afterY_tomorrow = aftertomorrow_date.getFullYear();
//加两天后的月份
var afterM_tomorrow = (aftertomorrow_date.getMonth() + 1 < 10 ? '0' + (aftertomorrow_date.getMonth() + 1) : aftertomorrow_date.getMonth() + 1);
//加两天后的日期
var afterD_tomorrow = aftertomorrow_date.getDate() < 10 ? '0' + aftertomorrow_date.getDate() : aftertomorrow_date.getDate();



// 加两天后的时间 也就是加三天的时间
var twoLater_timetamp = timestamp + 72 * 60 * 60;
//加三天的时间：
var twoLater_to = twoLater_timetamp * 1000;
var twoLater_date = new Date(twoLater_to);
//加三天的年份
var twoLaterY_tomorrow = twoLater_date.getFullYear();
//加三天的月份
var twoLaterM_tomorrow = (twoLater_date.getMonth() + 1 < 10 ? '0' + (twoLater_date.getMonth() + 1) : aftertomorrow_date.getMonth() + 1);
//加三天后的日期
var twoLaterD_tomorrow = twoLater_date.getDate() < 10 ? '0' + twoLater_date.getDate() : twoLater_date.getDate();

Page({
  data: {
    imgUrls: "",
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    circular: true,
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    currentIndex: 0,
    windowHeight: "",     //适配设备的高度
    barHeight: "",
    // 
    hidden: false,
    attendance:"../../images/qiandao.png",
    page: 1,              //记录加载数据的页数参数
    flag: true,            //记录是否请求数据的状态
    list: [],
    address:"",
    type:"1",// 查询排序，1= 最新发布，2= 离我最近，3= 最近开始
    // positionTop:"position:static;top:0;left:0;width:92%;z-index:9",
    comment_text: "",//评论内容
    send_text: "",//回复内容
    pid: 0,//默认为0   评论id
    commentList: "",//评论信息列表
    commentList0: "",
    date: "",
    time: "",
    hidden: true,
    remarkinfo: [],
    otherUrl: "",//评论列表的头像,
    huifu: "",
    // lat: "",
    // lng: "",
    len: 0,
    nowDate: "",//系统当前时间
  },
//扫一扫
// getScancode: function () {
//   var _this = this;
//   // 允许从相机和相册扫码
//   wx.scanCode({
//     success: (res) => {
//       console.log(res)
//       // var room_id='36'
//       // var side='A'
//       var url=res.path
//       var urls=decodeURIComponent(url)
//       var str1=urls.indexOf('?')
//       var joinstr=urls.indexOf(str1+1)
//       var str2=joinstr.indexOf(',')
//       var roomid= joinstr.substring(0,str2)  //取下划线前的字符
//       var side= joinstr.substring(str2+1) //取下划线后的字符
//       wx.request({
//         url: app.globalData.publicAdress + 'api/joinRoom',
//         method: 'POST',
//         header: {
//           'content-type': 'application/json', // 默认值
//           'Accept': 'application/vnd.cowsms.v2+json',
//           'Authorization': 'Bearer ' + wx.getStorageSync("token"),
//         },
//         data: {
//           "userid":wx.getStorageSync('userId'),
//           "room_id": roomid,
//           "side": side
//         },
//         success: function (res) {
//           console.log(res)
//           if (res.statusCode == 200){
//             wx.showToast({
//               title: res.data.mes,
//               icon: 'none',
//               duration: 2000//持续的时间
//             })
//           }else{
//             wx.showToast({
//               title: res.data.mes,
//               icon: 'none',
//               duration: 2000//持续的时间
//             })
//           }
//         }
//       })
//     }
//   })

// },
  onLoad: function (options) {
    var that = this;
    // console.log(decodeURIComponent(options.scene))
    // if (options.scene) {
    //   var scene = decodeURIComponent(options.scene)
    //   // var url=res.path
    //   var urls = decodeURIComponent(scene)
    //   var str = urls.indexOf(',')
    //   var roomid = urls.substring(0, str)  //取,前的字符
    //   var side = urls.substring(str + 1) //取,后的字符
    //   wx.request({
    //     url: app.globalData.publicAdress + 'api/joinRoom',
    //     method: 'POST',
    //     header: {
    //       'content-type': 'application/json', // 默认值
    //       'Accept': 'application/vnd.cowsms.v2+json',
    //       'Authorization': 'Bearer ' + wx.getStorageSync("token"),
    //     },
    //     data: {
    //       "userid": wx.getStorageSync('userId'),
    //       "room_id": roomid,
    //       "side": side
    //     },
    //     success: function (res) {
    //       console.log(res)
    //       if (res.statusCode == 200) {
    //         wx.showToast({
    //           title: res.data.mes,
    //           icon: 'none',
    //           duration: 2000//持续的时间
    //         })
    //       } else {
    //         wx.showToast({
    //           title: res.data.mes,
    //           icon: 'none',
    //           duration: 2000//持续的时间
    //         })
    //       }
    //     }, error: function (error) {
    //       console.log(error)
    //     },
    //   })
    // }

    var time = utils.formatTime(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据
    that.setData({
      nowDate: time.replace(/\//g, '.').substring(0, 16)
    })
    that.setData({
      list: [],
      page: 1
    })
    that.pageList(that.data.page, that.data.type, that.data.address)
    //活动banner
    utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.index/bannerlist', 'post', { type: "activity"})
      .then(function (response) {
        that.setData({
          imgUrls: response.data.data
        })
      }, function (error) {
        console.log(error);
      })
    if (wx.getStorageSync("adress")){
        that.setData({
          address: wx.getStorageSync("adress")
        })
      }else{
      that.setData({
        address:""
      })
      }
   
  },
  //定位活动地址
  chooseMapViewTap: function () {
    var that = this;
    that.setData({
      page: 1
    })
    wx.removeStorageSync("isSCope")
    // wx.setStorageSync("adress", res.name + res.address)
    wx.setStorageSync("isSCope", "isSCope")
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            lang: "zh_CN",
            success: function (res) {
              let userInfo = res.userInfo;
              wx.removeStorageSync("baseUrl");
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
                      })
                      wx.removeStorageSync("adress")
                     
                      wx.setStorageSync("adress", res.name + res.address)
                      that.setData({
                        address: wx.getStorageSync("adress"),
                        page:1
                      })
                      that.data.list = [];
                      that.setData({
                        list:that.data.list
                      })
                      that.pageList(that.data.page, that.data.type, that.data.address)
                      utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.user/setuseraddress?token=' + wx.getStorageSync("token") + '&address=' + that.data.address, 'post')
                        .then(function (response) {
                          console.log(response)
                          that.setData({
                            page:1
                          })
                        }, function (error) {
                          console.log(error);
                        })
                      // app.globalData.adress = res.address + res.name
                    }, cancel: function (e) {
                      // fail
                    //  wx.navigateBack({
                    //     delta: 1
                    //   })
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
          })
        } else {
          wx.setStorageSync("baseUrl", url);
          wx.navigateTo({
            url: '../login/login',
          })
        }
      }
    })


  },
  catchTouchMove: function (res) {
    return false
  },
 
  onShow: function () {
    var that = this; 
    that.getSignInfo(); 
    // that.data.list = [];
    
    that.setData({
      address: wx.getStorageSync("adress")
    })
    if (!wx.getStorageSync("adress") && wx.getStorageSync("isSCope")) {

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
                address: res.address + res.name
              })
              wx.removeStorageSync("adress")
              wx.setStorageSync("adress", res.name + res.address)
              utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.user/setuseraddress?token=' + wx.getStorageSync("token") + '&address=' + that.data.address, 'post')
                .then(function (response) {
                  console.log(response)
                  that.setData({
                    page:1
                  })
                  that.setData({
                    list: [],
                    page: 1
                  })
                  that.pageList(that.data.page, that.data.type, that.data.address)
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
    if (!wx.getStorageSync("adress") && wx.getStorageSync("isKill")) {

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
                address: res.address + res.name
              })
              wx.removeStorageSync("adress")
              wx.setStorageSync("adress", res.name + res.address)
              utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.user/setuseraddress?token=' + wx.getStorageSync("token") + '&address=' + that.data.address, 'post')
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
  },
  pageList(page, type, address) {
    //把this对象复制到临时变量that
    var that = this;
    //打开记录请求的状态flag
    this.setData({
      flag: false
    })
    utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.index/pageList?page=' + that.data.page + "&token=" + wx.getStorageSync("token") + "&address=" + that.data.address + "&type=" + that.data.type, 'get')
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
//点击签到
toAttendance:function(){
  var that = this;
  if (that.data.attendance != "../../images/yidiandao.png"){
    utils.sendRequest(app.globalData.publicAdress + 'addons/leesign/index/sign?token=' + wx.getStorageSync("token"), 'post')
      .then(function (response) {
        if (response.statusCode == 200) {
          if (response.data.code == 1) {
            wx.showToast({
              title: response.data.msg,
              icon: "none",
              duration: 2000,
            })
            that.setData({
              attendance: "../../images/yidiandao.png"
            })
          } else {
            wx.showToast({
              title: response.data.msg,
              icon: "none",
              duration: 2000,
            })
          }
         
        }
      }, function (error) {
        console.log(error);
      })
  }
},
//查看签到状态
  getSignInfo:function(){
    var that =this;
    utils.sendRequest(app.globalData.publicAdress + 'addons/leesign/index/getSignInfo?token=' + wx.getStorageSync("token"), 'post')
      .then(function (response) {
        if (response.statusCode == 200) {
          //code=1今日未签到
          // code = 0今天已签到
          if (response.data.code == 1) {
            that.setData({
              attendance:"../../images/qiandao.png"
            })
          } else if (response.data.code == 0){
            that.setData({
              attendance: "../../images/yidiandao.png"
            })
          }
        }
      }, function (error) {
        console.log(error);
      })
  },
  //查看社群
  lookAassociation: function (e) {
    var id = e.currentTarget.dataset.channelid;
    // var name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '/pages/associationDetail/associationDetail?id=' + id,
    })
  },
  /** 
     * 滑动切换tab 
     */
  bindChange: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });


  },
 
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {
    var that = this;
    if (that.data.currentTab == e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.currentTarget.dataset.current
      })
    }
    if (e.currentTarget.dataset.type == "1") {
      that.data.list = []
      that.setData({
        type: "1",
        page: 1,
      });
      that.pageList(that.data.page, that.data.type, that.data.address)
    } else if (e.currentTarget.dataset.type == "2") {
      if (!wx.getStorageSync("adress") && e.currentTarget.dataset.type == "2") {
        wx.setStorageSync("isKill", "isKill")
        // 查看是否授权
        wx.getSetting({
          success: function (res) {
            if (res.authSetting['scope.userInfo']) {
              wx.getUserInfo({
                lang: "zh_CN",
                success: function (res) {
                  let userInfo = res.userInfo;
                  wx.removeStorageSync("baseUrl");
                  wx.removeStorageSync("baseUrl_to");
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
                            // adress: res.address + res.name
                          })
                          wx.removeStorageSync("adress")
                          wx.setStorageSync("adress", res.name + res.address)
                          that.setData({
                            address: wx.getStorageSync("adress")
                          })
                          utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.user/setuseraddress?token=' + wx.getStorageSync("token") + '&address=' + that.data.address, 'post')
                            .then(function (response) {
                              console.log(response)
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
              })
            } else {
              wx.removeStorageSync("baseUrl")
              wx.removeStorageSync("baseUrl_to")
              wx.setStorageSync("baseUrl", url);
              wx.navigateTo({
                url: '../login/login',
              })
            }
          }
        })
      }else{
        that.data.list = [];
        that.setData({
          type: "2",
          page: 1,
        });
        that.pageList(that.data.page, that.data.type, that.data.address)
      }
      
    } else if (e.currentTarget.dataset.type == "3") {
      that.data.list = [];
      that.setData({
        type: "3",
        page: 1,
      });
      that.pageList(that.data.page, that.data.type, that.data.address)
    }
  },
  //去活动详情
  toDetail:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/activityDetail/activityDetail?id=' + id,
    })
  },
  onReady: function () {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
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
  onShareAppMessage: function (res) {
    return {
      title: '天天好球',
      path: '/pages/activityList/activityList',
    }
  }
})
