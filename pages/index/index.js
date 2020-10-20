//index.js
//获取应用实例
const app = getApp()
const utils = require('../../utils/util')
var url;//获取当前页面路径
// var timestamp =
//   Date.parse(new Date());

// timestamp = timestamp / 1000;

// //获取当前时间

// var n = timestamp * 1000;

// var date = new Date(n);

// //年

// var Y = date.getFullYear();

// //月

// var M = (date.getMonth()+ 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);

// //日

// var D = date.getDate()< 10 ? '0' + date.getDate() :
//   date.getDate();

// //时

// var h = date.getHours();

// //分

// var m = date.getMinutes();

// //秒

// var s = date.getSeconds();


//获取当前时间戳  
var timestamp = Date.parse(new Date());
timestamp = timestamp / 1000;
// console.log("当前时间戳为：" + timestamp);

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

// console.log("当前时间：" + Y + M + D + h + ":" + m + ":" + s);

//转换为时间格式字符串  
// console.log(date.toDateString());

// console.log(date.toGMTString());

// console.log(date.toISOString());

// console.log(date.toJSON());

// console.log(date.toLocaleDateString());
// 
// console.log(date.toLocaleString());

// console.log(date.toLocaleTimeString());

// console.log(date.toString());

// console.log(date.toTimeString());

// console.log(date.toUTCString());

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
// console.log(D_tomorrow)
// //加一天后的时刻  
// var h_tomorrow = tomorrow_date.getHours();
// //加一天后的分钟  
// var m_tomorrow = tomorrow_date.getMinutes();
// //加一天后的秒数  
// var s_tomorrow = tomorrow_date.getSeconds();

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
    // imgUrls: "",
    // indicatorDots: true,
    // autoplay: true,
    // interval: 5000,
    // duration: 1000,
    // circular: true,
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0, 
    currentIndex:0,
    selectShow: false,//控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: ['离我最近', '时间最近', '最新发布'],//下拉列表的数据     0    1 2 
    index: 0,//选择的下拉列表下标 ,
    i:2,
    // 
    list: [],             //接收数据的数组
    list2:[],
    list3:[],
    list4:[],
    windowHeight: "",     //适配设备的高度
    barHeight:"",
    page: 1,              //记录加载数据的页数参数
    flag: true,            //记录是否请求数据的状态
// 
    hidden:false,
    adress:"",
    order_type:'',
    //当前时间
    date:  M + "/" + D,
    date2: M_tomorrow + "/" + D_tomorrow,//明天
    date3: afterM_tomorrow + "/" + afterD_tomorrow,//后天
    date4: twoLaterM_tomorrow + "/" + twoLaterD_tomorrow,//两天后
    todyList:"",//今天列表,
    token:"",
    history:"../../images/history2.png",
    // positionTop:"position:static;top:0;left:0;width:92%;z-index:9",
    
  },
  
  onLoad: function () {
    var that = this;
    url = that.route;
    if (wx.getStorageSync("token")){
      that.setData({
        token: wx.getStorageSync("token")
      })
    }else{
      that.setData({
        token:""
      })
    }
    this.isStop = false;
    that.setData({
      order_type:2,
      i:2
    })
    
    //获取设备信息，获取屏幕的Height属性
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.setData({
          windowHeight: res.windowHeight,
          barHeight: res.statusBarHeight
        })
        // barHeight = res.statusBarHeight
      }
    })
    that.setData({
      adress:wx.getStorageSync("adress")
    })
    
    that.data.list = [];
    that.requestData(Y + "-" + M + "-" + D, that.data.adress);//传给后台时间  年月日
    // that.requestData( Y+"-"+M + "-" + D,that.data.page,that.data.adress);//传给后台时间  年月日
    //活动banner
    // utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.index/bannerlist', 'post')
    //   .then(function (response) {
    //     that.setData({
    //       imgUrls: response.data.data
    //     })
    //   }, function (error) {
    //     console.log(error);
    //   })
    utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.user/setuseraddress?token=' + wx.getStorageSync("token") + '&address=' + that.data.adress, 'post')
      .then(function (response) {
        console.log(response)
      }, function (error) {
        console.log(error);
      })
  },
  // 点击下拉显示框
  selectTap(e) {
    var that = this;
    that.setData({
      i: e.detail.value,
      order_type : e.detail.value
    })
    
    if (that.data.currentIndex == 0) {
      // that.setData({
      //   page: 1,
      //   currentIndex: 0
      // })
      that.data.list = []
      that.requestData(Y + "-" + M + "-" + D, that.data.adress, that.data.order_type, that.data.token);
    } else if (that.data.currentIndex == 1) {

      // that.setData({
      //   page: 1,
      //   // currentIndex: 0
      // })
      that.data.list2 = []
      // //加三天的年份
      // var twoLaterY_tomorrow = twoLater_date.getFullYear();
      // //加三天的月份
      // var twoLaterM_tomorrow = (twoLater_date.getMonth() + 1 < 10 ? '0' + (twoLater_date.getMonth() + 1) : aftertomorrow_date.getMonth() + 1);
      // //加三天后的日期
      // var twoLaterD_tomorrow = twoLater_date.getDate() < 10 ? '0' + twoLater_date.getDate() : twoLater_date.getDate();
      that.requestData2(twoLaterY_tomorrow + "-" + twoLaterM_tomorrow + "-" + twoLaterD_tomorrow, that.data.adress, that.data.order_type, that.data.token)
    } else if (that.data.currentIndex == 2) {
      // that.setData({
      //   page: 1,
      //   // currentIndex: 0
      // })
      that.data.list3 = []
      that.requestData3(afterY_tomorrow + "-" + afterM_tomorrow + "-" + afterD_tomorrow, that.data.adress, that.data.order_type, that.data.token)
    } else if (that.data.currentIndex == 3) {
      // that.setData({
      //   page: 1,
      //   // currentIndex: 0
      // })
      that.data.list4 = []
      that.requestData4("", that.data.adress, that.data.order_type, that.data.token,that.data.page)
    }
    if (!wx.getStorageSync("adress") && e.detail.value == 0) {
      wx.setStorageSync("isKill","isKill")
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
                          adress: wx.getStorageSync("adress")
                        })
                        utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.user/setuseraddress?token=' + wx.getStorageSync("token") + '&address=' + that.data.adress, 'post')
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
    }
    // this.setData({
    //   selectShow: !this.data.selectShow
    // });
  },
  catchTouchMove: function (res) {
    return false
  },
  //定位活动地址
  chooseMapViewTap: function () {
    var that = this;
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
                        // adress: res.address + res.name
                      })
                      wx.removeStorageSync("adress")
                      // wx.removeStorageSync("isSCope")
                      wx.setStorageSync("adress", res.name + res.address)
                      // wx.setStorageSync("isSCope", "isSCope")
                      that.setData({
                        adress: wx.getStorageSync("adress")
                      })
                      utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.user/setuseraddress?token=' + wx.getStorageSync("token") + '&address=' + that.data.adress, 'post')
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
          wx.setStorageSync("baseUrl", url);
          wx.navigateTo({
            url: '../login/login',
          })
        }
      }
    })
    
   
  },
  onShow:function(){
    var that = this;
    that.setData({
      adress: wx.getStorageSync("adress")
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
    // if (!wx.getStorageSync("adress")) {
    //   wx.getLocation({
    //     // type: 'gcj02',//默认wgs84
    //     success: function (res) {
    //       console.log(res)
    //       const latitude = res.latitude
    //       const longitude = res.longitude
    //       const speed = res.speed
    //       const accuracy = res.accuracy
    //       wx.chooseLocation({
    //         success: function (res) {
    //           console.log(res);
    //           that.setData({
    //             location: {
    //               latitude: res.latitude,
    //               longtitude: res.longtitude,
    //               name: res.name,
    //               address: res.address
    //             },
    //             adress: res.address + res.name
    //           })
    //           wx.removeStorageSync("adress")
    //           wx.setStorageSync("adress", res.address + res.name)
    //           // cms/wxapp.user/setuseraddress获取用户的位置，并解析经纬度
    //           //活动banner
    //           utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.user/setuseraddress?token=' + wx.getStorageSync("token") + '&address=' + that.data.adress, 'post')
    //             .then(function (response) {
    //               console.log(response)
    //             }, function (error) {
    //               console.log(error);
    //             })
             
    //         },
            
    //       })
    //     },
    //     fail: function (res) {
    //       // wx.hideLoading();
    //       wx.getSetting({
    //         success: (res) => {
    //           console.log(res);
    //           console.log(res.authSetting['scope.userLocation']);
    //           if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
    //             //非初始化进入该页面,且未授权
    //             wx.showModal({
    //               title: '是否授权当前位置',
    //               content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
    //               success: function (res) {
    //                 if (res.cancel) {
    //                   console.info("1授权失败返回数据");

    //                 } else if (res.confirm) {
    //                   //village_LBS(that);
    //                   wx.openSetting({
    //                     success: function (data) {
    //                       console.log(data);
    //                       if (data.authSetting["scope.userLocation"] == true) {
    //                         wx.showToast({
    //                           title: '授权成功',
    //                           icon: 'success',
    //                           duration: 2000
    //                         })
                            
    //                         //再次授权，调用getLocationt的API
    //                         // village_LBS(that);
    //                       } else {
    //                         wx.showToast({
    //                           title: '授权失败',
    //                           icon: 'success',
    //                           duration: 5000
    //                         })
    //                       }
    //                     }
    //                   })
    //                 }
    //               }
    //             })
    //           } else {//初始化进入
    //             wx.showModal({
    //               title: '',
    //               content: '请在系统设置中打开定位服务',
    //               confirmText: '确定',
    //               success: function (res) {
    //                 wx.setStorageSync("toPossition", "toPossition")
    //                 // wx.navigateTo({
    //                 //   url: "../login/login"
    //                 // })
    //               }
    //             })
    //           }
    //         }
    //       })
    //     }
    //     // },

    //   })
    // } else {
    //   // that.data.adress = wx.getStorageSync("adress");
    //   that.setData({
    //     hidden: false
    //   })
    // }
    // that.data.list= [];
    that.setData({
      page:1
    }) 
    that.requestData(Y + "-" + M + "-" + D, that.data.adress);//传给后台时间  年月日
    // that.data. list2= [],
    // that.data. list3= [],
    // that.data.list4= [],
    // that.onLoad();
    // wx.createSelectorQuery().select('.swiper-box').boundingClientRect(function (rect) {
    // }).exec(function (res) {
    //   that.setData({
    //     height1: res[0].height
    //   })
    //   // height1 = res[0].height
    // })
    // wx.createSelectorQuery().select('.content_index').boundingClientRect(function (rect) {
    // }).exec(function (res) {
    //   that.setData({
    //     height2: res[0].height
    //   })
    //   // height2 = res[0].height
    // })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          carslistheight: res.windowHeight
        })
        // carslistheight = res.windowHeight
      },
    })
  },
  
  //请求数据   约球列表
  requestData(time, address, order_type) {
    //把this对象复制到临时变量that
    var that = this;
    //打开记录请求的状态flag
    this.setData({
      flag: false
    })
    // wx.showLoading({
    //   title: '加载中',
    //   mask: true
    // })
    utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.archives/index?starttime=' + time + '&address=' + that.data.adress + '&order_type=' + that.data.order_type + '&token=' + that.data.token, 'get')
      .then(function (response) {
        if (response.statusCode == 200) {
          //成功
          if (response.data.code == 1) {
            if (response.data.data.archivesList.length < 5) {
    //       //记录请求状态，把reqState传值给flag
                var reqState = false;
              } else {
                var reqState = true;
              }
            // wx.hideLoading()
            //接收数据，保证每次都拼接上
            var list = response.data.data.archivesList;
            //为下一页的请求参数做准备
            var nextPage = ++that.data.page;
            that.setData({
              list: list,
              page: nextPage,
              flag: reqState
            })
          }

        }
      }, function (error) {
        console.log(error);
      })
  },
  requestData2(time,  address,order_type) {
    //把this对象复制到临时变量that
    var that = this;
    //打开记录请求的状态flag
    this.setData({
      flag: false
    })
    // wx.showLoading({
    //   title: '加载中',
    //   mask: true
    // })
    utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.archives/index?starttime=' + time + '&address=' + that.data.adress + '&order_type=' + that.data.order_type +'&token=' + that.data.token, 'get')
      .then(function (response) {
        if (response.statusCode == 200) {
          //成功
          if (response.data.code == 1) {
            if (response.data.data.archivesList.length < 5) {
              //       //记录请求状态，把reqState传值给flag
              var reqState = false;
            } else {
              var reqState = true;
            }
            // wx.showToast({
            //   title: "数据加载中",
            //   icon: "loading",
            //   duration: 3000,
            // })
            // wx.hideLoading()
            //接收数据，保证每次都拼接上
            var list = that.data.list2.concat(response.data.data.archivesList);
            //为下一页的请求参数做准备
            var nextPage = ++that.data.page;
            that.setData({
              list2: list,
              page: nextPage,
              flag: reqState
            })
          }

        }
      }, function (error) {
        console.log(error);
      })
  },
  requestData3(time,  address,order_type) {
    //把this对象复制到临时变量that
    var that = this;
    //打开记录请求的状态flag
    this.setData({
      flag: false
    })
    // wx.showLoading({
    //   title: '加载中',
    //   mask: true
    // })
    utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.archives/index?starttime=' + time + '&address=' + that.data.adress + '&order_type=' + that.data.order_type + '&token=' + that.data.token, 'get')
      .then(function (response) {
        if (response.statusCode == 200) {
          //成功
          if (response.data.code == 1) {
            if (response.data.data.archivesList.length < 5) {
              //       //记录请求状态，把reqState传值给flag
              var reqState = false;
            } else {
              var reqState = true;
            }
            // wx.hideLoading()
            //接收数据，保证每次都拼接上
            var list = that.data.list3.concat(response.data.data.archivesList);
            //为下一页的请求参数做准备
            var nextPage = ++that.data.page;
            that.setData({
              list3: list,
              page: nextPage,
              flag: reqState
            })
          }

        }
      }, function (error) {
        console.log(error);
      })
  },
  // requestData4(time, address, order_type, page) {
  //   //把this对象复制到临时变量that
  //   var that = this;
  //   //打开记录请求的状态flag
  //   this.setData({
  //     flag: false
  //   })
  //   // wx.showLoading({
  //   //   title: '加载中',
  //   //   mask: true
  //   // })
  //   utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.archives/index?starttime=' + time + '&address=' + that.data.adress + '&order_type=' + that.data.order_type + '&token=' + that.data.token + "&page" + that.data.page, 'get')
  //     .then(function (response) {
  //       if (response.statusCode == 200) {
  //         //成功
  //         if (response.data.code == 1) {
  //           if (response.data.data.archivesList.length < 5) {
  //             //       //记录请求状态，把reqState传值给flag
  //             var reqState = false;
  //           } else {
  //             var reqState = true;
  //           }
  //           // wx.hideLoading()
  //           //接收数据，保证每次都拼接上
  //           var list = that.data.list4.concat(response.data.data.archivesList);
  //           //为下一页的请求参数做准备
  //           var nextPage = ++that.data.page;
  //           that.setData({
  //             list4: list,
  //             page: nextPage,
  //             flag: reqState
  //           })
  //         }

  //       }
  //     }, function (error) {
  //       console.log(error);
  //     })
  // },
  requestData4(time, page, address,order_type) {
    //把this对象复制到临时变量that
    var that = this;
    //打开记录请求的状态flag
    this.setData({
      flag: false
    })
    utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.archives/index?page=' + that.data.page + '&starttime=' + time + '&address=' + that.data.adress + '&order_type=' + that.data.order_type, 'get')
      .then(function (response) {
        if (response.statusCode == 200) {
          //成功
          if (response.data.code == 1) {
            if (response.data.data.archivesList.length < 5) {
              //       //记录请求状态，把reqState传值给flag
              var reqState = false;
            } else {
              var reqState = true;
            }
            //接收数据，保证每次都拼接上
            var list = that.data.list4.concat(response.data.data.archivesList);
            //为下一页的请求参数做准备
            var nextPage = ++that.data.page;
            that.setData({
              list4: list,
              page: nextPage,
              flag: reqState
            })
          }

        }
      }, function (error) {
        console.log(error);
      })
  },
  //去详情
  toDetail:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/ballDetail/ballDetail?id=' + id,
    })
  },
  // onPageScroll: function (ev) {
  //   // console.log(ev)
  //   var that = this;
  //   if (ev.scrollTop >= that.data.height1 && !this.isStop){
  //     this.isStop = true
  //     that.setData({
  //       positionTop:"position:fixed;top:0;left:0;width:90%;z-index:9"
  //     })
  //   } else if (ev.scrollTop < that.data.height1 && this.isStop ){
  //     this.isStop = false
  //     that.setData({
  //       positionTop: "position:static;top:0;left:0;width:90%;z-index:9"
  //     })
  //   }
    
  // },
  //scroll-view 滚动到底部/右边时触发触发
  // loadMore() {
  //   console.log("111")
  //   var that = this;
  //   //根据请求状态flag请求数据
  //   if (this.data.flag) {
  //     if (that.data.currentIndex == 0){
  //       that.requestData(Y + "-" + M + "-" + D,  that.data.adress, that.data.order_type);
  //     } else if (that.data.currentIndex == 1){
  //       that.requestData2(Y_tomorrow + "-" + M_tomorrow + "-" + D_tomorrow, that.data.adress, that.data.order_type)
  //     } else if (that.data.currentIndex == 2) {
  //       that.requestData3(afterY_tomorrow + "-" + afterM_tomorrow + "-" + afterD_tomorrow, that.data.adress, that.data.order_type)
  //     } else if (that.data.currentIndex == 3) {
  //       that.requestData4("", that.data.adress, that.data.order_type)
  //     }
     
  //   }
  // },
  // 点击下拉列表
  optionTap(e) {
    let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
    this.setData({
      index: Index,
      selectShow: !this.data.selectShow
    });
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
  toMap:function(){
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            lang: "zh_CN",
            success: function (res) {
              let userInfo = res.userInfo;
              wx.removeStorageSync("baseUrl");
              wx.navigateTo({
                url: '../map/map',
              })
            }
          })
        } else {
          // wx.getStorageSync("baseUrl_to")
          wx.setStorageSync("baseUrl_to", "pages/map/map");
          wx.navigateTo({
            url: '../login/login',
          })
        }
      }
    })
    
  },
  //点击发布约球
  publishBall:function(){
    wx.navigateTo({
      url: '../publishBall/publishBall',
    })
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
    if (e.currentTarget.dataset.current == 0) {
      that.data.list = []
      that.setData({
        page: 1,
        currentIndex:0,
        history:"../../images/history2.png"
      })
      that.requestData(Y + "-" + M + "-" + D, that.data.adress, that.data.order_type, that.data.token);//传给后台时间  年月日
    } else if (e.currentTarget.dataset.current == 1) {
      that.data.list2 = []
      that.setData({
        page:1,
        currentIndex:1,
        history: "../../images/history2.png"
      })
      that.requestData2(twoLaterY_tomorrow + "-" + twoLaterM_tomorrow + "-" + twoLaterD_tomorrow, that.data.adress, that.data.order_type, that.data.token)
      //传给后台时间  年月日)
    }
    else if (e.currentTarget.dataset.current == 2) {
      that.data.list3 = []
      that.setData({
        page: 1,
        currentIndex:2,
        history: "../../images/history2.png"
      })
      that.requestData3(afterY_tomorrow + "-" + afterM_tomorrow + "-" + afterD_tomorrow, that.data.adress, that.data.order_type, that.data.token)
      
    } else if (e.currentTarget.dataset.current == 3) {
      that.data.list4 = []
      that.setData({
        page: 1,
        currentIndex: 3,
        history: "../../images/history1.png"
      })
      that.requestData4("", that.data.adress, that.data.order_type, that.data.token, that.data.page)
    }
  },
  onReady: function () {
    
  } ,
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    //根据请求状态flag请求数据
    if (this.data.flag) {
      if (that.data.currentIndex == 3) {
        that.requestData4("", that.data.adress, that.data.order_type, that.data.token, that.data.page)
      }

    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    //根据请求状态flag请求数据
    if (this.data.flag) {
      if (that.data.currentIndex == 3) {
        that.requestData4("", that.data.adress, that.data.order_type, that.data.token, that.data.page)
      }

    }
  },
  onPullDownRefresh:function(){
    var that = this;
    if (!wx.getStorageSync("adress")){
      wx.getLocation({
        // type: 'gcj02',//默认wgs84
        success: function (res) {
          const latitude = res.latitude
          const longitude = res.longitude
          const speed = res.speed
          const accuracy = res.accuracy
          wx.chooseLocation({
            success: function (res) {
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
              wx.setStorageSync("adress", res.address + res.name)
              app.globalData.adress = res.address + res.name
              wx.stopPullDownRefresh()
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
                  } else  {//初始化进入
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
                // village_LBS(that);
                //用户已授权，但是获取地理位置失败，提示用户去系统设置中打开定位
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
    }else{
      wx.stopPullDownRefresh()
    }
    
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    return {
      title: '天天好球',
      path: '/pages/index/index',
    }
  }
  //scroll-view 滚动到底部/右边时触发触发
  // loadMore() {
  //   var that = this;
  //   //根据请求状态flag请求数据
  //   if (this.data.flag) {
  //      if (that.data.currentIndex == 3) {
  //       that.requestData4(twoLaterY_tomorrow + "-" + twoLaterM_tomorrow + "-" + twoLaterD_tomorrow, that.data.page, that.data.adress)
  //     }

  //   }
  // },
  
})
