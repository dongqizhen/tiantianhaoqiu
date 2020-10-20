
var timestamp =  Date.parse(new Date());

timestamp = timestamp / 1000;

//获取当前时间

var n = timestamp * 1000;

var date = new Date(n);

//年

var Y = date.getFullYear();

//月

var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);

//日

var D = date.getDate() < 10 ? '0' + date.getDate() :
  date.getDate();

//时

var h =  date.getHours();

//分

var m = date.getMinutes();

//秒

var s =  date.getSeconds();

var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
const app = getApp();
const utils = require('../../utils/util');
var url;//获取当前页面路径
Page({

  /**
   * 页面的初始数据
   */
  data: {
      userCheck:true,
      date: Y + "-" + M + "-" + D ,
      tagsList:"",//活动内容列表
      tagsarray:[],
      time: "选择活动的具体时间",
      // address: wx.getStorageSync("locationAddress"),
      address:"",
      free_type:1,
      schoolList: [
      {
        teamId: 1,
        name: 'AA'
      },
      {
        teamId: 2,
        name: '免费'
      },
      {
        teamId: 3,
        name: '抢台费'
      },

    ],
    pickerIndex:0,
    teamIdList:"",
    teamId:"",
    objectIndex: 0,//默认显示位置
      index: 0,
    min: 5,//最少字数
    max: 300, //最多字数 (根据自己需求改变)
    remark:"",
    currentWordNumber: 0,
    isIphoneX: false,
    title:"",//活动名称
    starttime:"",//开始时间
    // fee_type:"",//费用方式
    tags: "",//活动内容  字段
    nickname:"",//发布人名称
    mobile:"",//手机号
    wxid:"",//微信号
    disabled: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // url = that.route;
    // // 查看是否授权
    // wx.getSetting({
    //   success: function (res) {
    //     console.log(res)
    //     if (res.authSetting['scope.userInfo']) {
    //       wx.getUserInfo({
    //         lang: "zh_CN",
    //         success: function (res) {
    //           let userInfo = res.userInfo;
    //           wx.removeStorageSync("baseUrl");
    //         }
    //       })
    //     } else {
    //       wx.setStorageSync("baseUrl", url);
    //       wx.navigateTo({
    //         url: '../login/login',
    //       })
    //     }
    //   }
    // })
    //  wx.authorize({
    //   scope: 'scope.userLocation',
    //   success: (res) => {
    //     wx.showToast({
    //       title: res,
    //       icon: "none",
    //       duration: 3000,
    //     })
    //   },
    // })
    that.getPersonalInfo();
    that.setData({
      date:Y+"-"+M+"-"+D,
      "isIphoneX": this.isIphoneX(),
      nickname: wx.getStorageSync("nickName")
    })
    that.gettags();
    var schoolArr = [];
    var teamArr = [];
    for (var i = 0; i < that.data.schoolList.length;i++){
      teamArr.push(that.data.schoolList[i].teamId);
      schoolArr.push(that.data.schoolList[i].name)
    }
    that.setData({
      schoolList: schoolArr,
      teamIdList: teamArr
    })
  },
  getPersonalInfo: function () {
    var that = this;
    utils.sendRequest(app.globalData.publicAdress + 'api/user/index?token=' + wx.getStorageSync("token"), 'get')
      .then(function (response) {
        if (response.statusCode == 200) {
          //成功
          if (response.data.code == 1) {
            console.log(response)
            that.setData({
              personalInfo: response.data.data.userinfo,
              mobile: response.data.data.userinfo.mobile,
              wxid: response.data.data.userinfo.wxid,
              nickname: response.data.data.userinfo.username
            })
            // if (response.data.data.userinfo.mobile == "" || response.data.data.userinfo.mobile == null || response.data.data.userinfo.mobile == undefined) {
            //   wx.setStorageSync("baseUrl", url);
            //   wx.navigateTo({
            //     url: '../register/register',
            //   })
            // }
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
  },
  isIphoneX() {
    let mobile = wx.getSystemInfoSync();
    if (mobile.model.indexOf("iPhone X") >= 0) {
      return true;
    } else {
      return false;
    }
  },
  //活动内容标签列表
  gettags:function(){
    var that = this;
    utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.archives/gettags', 'post')
      .then(function (response) {
        if (response.statusCode == 200) {
          //成功
          if (response.data.code == 1) {
            that.setData({
              tagsList: response.data.data
            })
          }
        }
      }, function (error) {
        console.log(error);
      })
  },
  //监听活动名称的输入
  changeTitle: function (e){
    var that = this;
    // var inputSearch = event.detail.value;
    that.setData({
      title: e.detail.value
    })
  },
  //监听昵称
  changeNickName:function(e){
    var that = this;
    that.setData({
      nickname: e.detail.value
    })
  },
  //监听电话
  changePhone: function (e) {
    var that = this;
    that.setData({
      mobile: e.detail.value
    })
  },
  //监听微信号
  changeWeichat: function (e) {
    var that = this;
    that.setData({
      wxid: e.detail.value
    })
  },
  //日期选择器
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  //时间选择器
  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
  //费用方式
  bindPickerChange: function (e) {//
  var that = this;
    that.setData({
      pickerIndex: e.detail.value
    })
    console.log('picker发送选择改变，携带值为', e)
  },
  //点击昵称的关闭图标
  del_nickName:function(e){
    var that = this;
    that.setData({
      nickname: ""
    })
  },
  //电话的关闭
  del_phone: function () {
    var that = this;
    that.setData({
      mobile: ""
    })
  },
  //微信
  del_weichat: function () {
    var that = this;
    that.setData({
      wxid:""
    })
  },
  //定位活动地址
  chooseMapViewTap:function(){
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
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
              address: res.name + res.address
            })
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
  },

  chooseMap() {
    var that = this
    wx.getLocation({
      type: 'wgs84',
      success(res) {
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
              address: res.name + res.address
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
                  // wx.setStorageSync("toPossition", "toPossition")
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
    // wx.navigateTo({
    //   url: '../map/map',
    // })
   
  },
  // e.detail.value   提交form表单
  formSubmit:function(e){
    var that = this;
    e.detail.value.teamId = this.data.teamIdList[e.detail.value.teamId];  
    if (that.data.title == '' || that.data.date == '' || that.data.time == '' || that.data.free_type == '' || that.data.nickname == '' || that.data.address =="" ){
      wx.showToast({
        title: "请将必填项填写完整",
        icon: "none",
        duration: 3000,
      })
    } else if (this.data.mobile ==""){
      wx.showToast({
        title: "请输入手机号",
        icon: "none",
        duration: 3000,
      })
    }else{
     
      that.setData({
        free_type: e.detail.value.teamId
      })
      that.setData({
        disabled: true
      })
      //发布约球信息
      utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.archives/addarchive?token=' + wx.getStorageSync("token"), 'post', { title: that.data.title, starttime: that.data.date + "" + that.data.time, address: that.data.address, tags: that.data.tagsarray.join(","), fee_type: that.data.free_type, nickname: that.data.nickname, mobile: that.data.mobile, wxid: that.data.wxid, description: that.data.remark})
        .then(function (response) {
          if (response.statusCode == 200) {
            //成功
            if (response.data.code == 1) {
              console.log(response)
              // that.data.title == '' || that.data.date == '' || that.data.time == '' || that.data.free_type == '' || that.data.nickname == '' || that.data.address == "" 
              that.setData({
                title:"",
                time:"选择活动的具体时间",
                address:"",
                pickerIndex:0,
                mobile:"",
                wxid:"",
                remark:"",
                date: Y + "-" + M + "-" + D
              })
              for (var i = 0; i < that.data.tagsList.length;i++){
                that.data.tagsList[i].checked = false;
              }
              that.setData({ tagsList: that.data.tagsList })
              wx.showToast({
                title: response.data.msg,
                icon: "none",
                duration: 2000,
              })
              setTimeout(function () {
                // wx.switchTab({
                //   url: '../index/index',
                // })
                wx.navigateTo({
                  url: '/pages/ballDetail/ballDetail?id=' + response.data.data.id,
                })
              }, 2000)
            
            }else{
              that.setData({
                disabled: false
              })
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
    }
    // e.detail.value.teamId = this.data.teamIdList[e.detail.value.teamId]
  },
  //多选
  userCheck: function (e) {
    let index = e.currentTarget.dataset.index;//获取用户当前选中的索引值
    let checkBox = this.data.tagsList;
    if (checkBox[index].checked) {
      this.data.tagsList[index].checked = false;
    } else {
      this.data.tagsList[index].checked = true;
    }
      this.setData({ tagsList: this.data.tagsList })
      //返回用户选中的值
      let value = checkBox.filter((tagsList, index) => {
        return tagsList.checked == true;
      })
      this.data.tagsarray = [];
      if (value.length>2){
        this.data.tagsList[index].checked = false;
        this.setData({ tagsList: this.data.tagsList })
        wx.showToast({
          title: '最多只能选两项',
          icon: 'none',
          duration: 1000
        })
        }else{
          for (var i = 0; i < value.length; i++) {
            this.data.tagsarray.push(value[i].name)
          }
        }
      
      //数据转成字符串  传给后台
    // console.log(this.data.tagsarray.join(","))
   
  },
  bindinput10: function (e) {//备注
    this.setData({
      remark: e.detail.value
    })
    // 获取输入框的内容
    var value = e.detail.value;
    // 获取输入框内容的长度
    var len = parseInt(value.length);
    //最少字数限制
    if (len <= this.data.min)
      this.setData({
        texts: "至少还需要",
        textss: "字",
        num: this.data.min - len
      })
    else if (len > this.data.min)
      this.setData({
        texts: " ",
        textss: " ",
        num: ''
      })
    this.setData({
      currentWordNumber: len //当前字数  
    });
    //最多字数限制
    if (len > this.data.max) return;
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
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
    var that = this;
    url = that.route;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            lang: "zh_CN",
            success: function (res) {
              let userInfo = res.userInfo;
              wx.removeStorageSync("baseUrl");
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
    
    this.getPersonalInfo();
    let pages = getCurrentPages();

    let currPage = pages[pages.length - 1];

    if (currPage.data.addresschose) {

      this.setData({

        //将携带的参数赋值

        address: currPage.data.addresschose,

        addressBack: true

      });

      console.log(this.data.address, '地址')

    }
    
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
      path: '/pages/publishBall/publishBall',
    }
  }
})