//index.js
//获取应用实例
const app = getApp()
const utils = require('../../utils/util')
const defaultScale = 14;
var consoleUtil = require('../../utils/consoleUtil.js');
var constant = require('../../utils/constant.js');
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
//定义全局变量
var wxMarkerData = [];
var bottomHeight = 0;
var windowHeight = 0;
var windowWidth = 0;
var mapId = 'myMap';
var qqmapsdk;
var sourceType = [
  ['camera'],
  ['album'],
  ['camera', 'album']
]
var sizeType = [
  ['compressed'],
  ['original'],
  ['compressed', 'original']
]
var addressA;
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    longitude: '',
    latitude: '',
    //地图缩放级别
    scale: defaultScale,
    //   markers: [{
    //    iconPath: "/img/drag-icon.png",
    //    id: 0,
    //     latitude: "",
    //      longitude: "",
    //      width: 30,
    //      height: 30
    //    },
    //    {
    //      iconPath: "/img/drag-icon.png",
    //     id: 0,
    //      latitude: "",
    //      longitude: "",
    //    width: 30,
    //    height: 30
    //  }],
    markers: [],
    showTopTip: true,
    warningText: '顶部提示',
    showUpload: true,
    showConfirm: false,
    showComment: false,
    //地图高度
    mapHeight: 0,
    infoAddress: '',
    commentCount: 0,
    praiseCount: 0,
    commentList: [],
    selectAddress: '',
    centerLongitude: '',
    centerLatitude: '',
    uploadImagePath: '',
    currentMarkerId: 0,
    praiseSrc: '../../img/bottom-unpraise.png',
    warningIconUrl: '',
    infoMessage: '',
    isUp: false,
    //中心指针，不随着地图拖动而移动
    controls: [],
    //搜索到的中心区域地址信息,用于携带到选择地址页面
    centerAddressBean: null,
    //选择地址后回调的实体类
    callbackAddressInfo: null,
    //将回调地址保存
    callbackLocation: null,
    //当前省份
    currentProvince: '',
    //当前城市
    currentCity: '',
    //当前区县
    currentDistrict: '',
    showHomeActionIcon: true,
    homeActionLeftDistance: '0rpx',
    //单个 marker 情报
    currentTipInfo: '',
    //显示评论输入框
    showCommentInput: false,
    //评论文字
    commentMessage: '',
    //分享携带经度
    shareLongitude: '',
    //分享携带纬度
    shareLatitude: '',
    //是否是分享点击进入小程序
    showShare: false,
    getAdress: ""
    //上传者用户信息
    // userAvatar: 'https://images.unsplash.com/photo-1499355940597-5601b9869168?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=0a501f2aa74492264ce48c72546450e8&auto=format&fit=crop&w=1567&q=80',
    // userNickname: '笑傲江湖',
    // uploadTime: '一分钟前',
  },

  onLoad: function (options) {
    var that = this;
    that.setData({
      "isIphoneX": this.isIphoneX(),
    })
    utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.index/nearChannel?token=' + wx.getStorageSync("token"), 'get')
      .then(function (response) {
        // console.log(response)
        if (response.statusCode == 200) {
          if (response.data.code == 1) {
            for (var i = 0; i < response.data.data.length; i++) {
              var parm = [];
              that.data.markers.push({ iconPath: "/images/po.png", id: i, "latitude": response.data.data[i].lat, "longitude": response.data.data[i].lng, width: 32, height: 32, title: response.data.data[i].name, });
            }
            that.setData({
              markers: that.data.markers
            })
            // console.log(that.data.markers)
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
    //检测更新
    // that.checkUpdate();
    if (app.globalData.userInfo) {
      // consoleUtil.log(1);
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      // consoleUtil.log(2);
      app.userInfoReadyCallback = res => {
        // consoleUtil.log(3);
        app.globalData.userInfo = res.userInfo;
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    }
    that.scopeSetting();
    // var that = this;
    that.changeMapHeight();
    // that.setHomeActionLeftDistance();
    //如果刚从选择地址页面带数据回调回来，则显示选择的地址
    // consoleUtil.log(that.data.callbackAddressInfo)
    if (that.data.callbackAddressInfo == null) {
      that.getCenterLocation();
      //正在上传的话，不去请求地理位置信息
      if (that.data.showUpload) {
        that.requestLocation();
      }
    } else {
      that.setData({
        selectAddress: that.data.callbackAddressInfo.title,
        callbackLocation: that.data.callbackAddressInfo.location
      })
      //置空回调数据，即只使用一次，下次中心点变化后就不再使用
      that.setData({
        callbackAddressInfo: null
      })
    }
  },
  isIphoneX() {
    let mobile = wx.getSystemInfoSync();
    if (mobile.model.indexOf("iPhone X") >= 0) {
      return true;
    } else {
      return false;
    }
  },
  onShow: function () {
    // consoleUtil.log('onShow--------------------->');
    // var that = this;
    // that.changeMapHeight();
    // // that.setHomeActionLeftDistance();
    // //如果刚从选择地址页面带数据回调回来，则显示选择的地址
    // consoleUtil.log(that.data.callbackAddressInfo)
    // if (that.data.callbackAddressInfo == null) {
    //   that.getCenterLocation();
    //   //正在上传的话，不去请求地理位置信息
    //   if (that.data.showUpload) {
    //     that.requestLocation();
    //   }
    // } else {
    //   that.setData({
    //     selectAddress: that.data.callbackAddressInfo.title,
    //     callbackLocation: that.data.callbackAddressInfo.location
    //   })
    //   //置空回调数据，即只使用一次，下次中心点变化后就不再使用
    //   that.setData({
    //     callbackAddressInfo: null
    //   })
    // }
  },

  /**
   * 页面不可见时
   */
  onHide: function () {

  },

  /**
   * 点击顶部横幅提示
   */
  showNewMarkerClick: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '你点击了顶部提示框',
      showCancel: false
    })
  },

  /**
   * 设置上传情报按钮的左边距
   */
  // setHomeActionLeftDistance: function () {
  //   var that = this;
  //   if (!that.data.showUpload){
  //     return;
  //   }
  //   wx.getSystemInfo({
  //     success: function (res) {
  //       windowHeight = res.windowHeight;
  //       windowWidth = res.windowWidth;
  //       //创建节点选择器
  //       var query = wx.createSelectorQuery();
  //       //选择id
  //       query.select('#home-action-wrapper').boundingClientRect()
  //       query.exec(function (res) {
  //         //res就是 所有标签为mjltest的元素的信息 的数组
  //         consoleUtil.log(res);
  //         that.setData({
  //           homeActionLeftDistance: ((windowWidth - res[0].width) / 2) + 'px'
  //         })
  //       })
  //     }
  //   })
  // },

  changeMapHeight: function () {
    var that = this;
    var count = 0;
    wx.getSystemInfo({
      success: function (res) {
        // consoleUtil.log(res);
        windowHeight = res.windowHeight;
        windowWidth = res.windowWidth;
        //创建节点选择器
        var query = wx.createSelectorQuery();

        var query = wx.createSelectorQuery();
        query.select('#bottom-layout').boundingClientRect()
        query.exec(function (res) {
          // consoleUtil.log(res);
          bottomHeight = res[0].height;
          that.setMapHeight();
        })
      },
    })
  },

  setMapHeight: function (params) {
    var that = this;
    that.setData({
      mapHeight: (windowHeight - bottomHeight) + 'px'
    })
    var controlsWidth = 40;
    var controlsHeight = 48;
    //设置中间部分指针
    that.setData({
      controls: [{
        id: 1,
        iconPath: '../../img/center-location.png',
        position: {
          left: (windowWidth - controlsWidth) / 2,
          top: (windowHeight - bottomHeight) / 2 - controlsHeight * 3 / 4,
          width: controlsWidth,
          height: controlsHeight
        },
        clickable: true
      }]
    })
  },

  scopeSetting: function () {
    var that = this;
    wx.getSetting({
      success(res) {
        //地理位置
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.authorize({
            scope: 'scope.userLocation',
            success(res) {
              that.initMap();

            },
            fail() {
              wx.showModal({
                title: '提示',
                content: '定位失败，你未开启定位权限，点击开启定位权限',
                success: function (res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success: function (res) {
                        if (res.authSetting['scope.userLocation']) {
                          that.initMap();
                        } else {
                          consoleUtil.log('用户未同意地理位置权限')
                        }
                      }
                    })
                  }
                }
              })
            }
          })
        } else {
          that.initMap();
        }
      }
    })
  },

  /** 
   * 初始化地图
   */
  initMap: function () {
    var that = this;
    qqmapsdk = new QQMapWX({
      key: constant.tencentAk
    });
    that.getCenterLocation();
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

  },

  //请求地理位置
  requestLocation: function () {
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        })
        that.moveTolocation();
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

  /**
   * 点击marker
   */
  // bindMakertap: function (e) {
  //   var that = this;
  //   //设置当前点击的id
  //   that.setData({
  //     currentMarkerId: e.markerId
  //   })
  //   //重新设置点击marker为中心点
  //   for (var key in that.data.markers) {
  //     var marker = that.data.markers[key];
  //     if (e.markerId == marker.id) {
  //       that.setData({
  //         longitude: marker.longitude,
  //         latitude: marker.latitude,
  //       })
  //       // console.log(that.data.longitude + ",,,," + that.data.latitude)
  //     }
  //   }
  //   // wx.showModal({
  //   //   title: '提示',
  //   //   content: '你点击了marker',
  //   //   showCancel: false,
  //   // })
  // },

  /**
   * 上传情报
   */
  uploadInfoClick: function () {
    var that = this;
    that.adjustViewStatus(false, true, false);
    that.updateCenterLocation(that.data.latitude, that.data.longitude);
    that.regeocodingAddress();
  },

  /**
   * 更新上传坐标点
   */
  updateCenterLocation: function (latitude, longitude) {
    var that = this;
    that.setData({
      centerLatitude: latitude,
      centerLongitude: longitude
    })
  },

  /**
   * 回到定位点
   */
  selfLocationClick: function () {
    var that = this;
    //还原默认缩放级别
    that.setData({
      scale: defaultScale
    })
    //必须请求定位，改变中心点坐标
    // that.requestLocation();
  },

  /**
   * 移动到中心点
   */
  moveTolocation: function () {
    var mapCtx = wx.createMapContext(mapId);
    mapCtx.moveToLocation();
  },

  cancelClick: function () {
    var that = this;
    that.resetPhoto();
    that.adjustViewStatus(true, false, false);
  },

  /**
   * 确认上传情报，忽略此处逻辑
   */
  confirmClick: function (res) {
    var that = this;
    // consoleUtil.log(res);
    var message = res.detail.value.message.trim();
    if (!that.data.centerLatitude || !that.data.centerLongitude) {
      that.showModal('请选择上传地点~');
      return;
    }
    if (!message) {
      that.showModal('请说点什么吧~');
      return;
    }
  },

  /**
   * 点击控件时触发
   */
  controlTap: function () {

  },

  /**
   * 点击地图时触发
   */
  bindMapTap: function () {
    //恢复到原始页
    this.adjustViewStatus(true, false, false);
  },

  adjustViewStatus: function (uploadStatus, confirmStatus, commentStatus) {
    var that = this;
    that.setData({
      //显示上传情报按钮
      showUpload: uploadStatus,
      //开始上传情报
      showConfirm: confirmStatus,
      //显示情报详情
      showComment: commentStatus,
    })
    that.changeMapHeight();
  },

  onShareAppMessage: function (res) {

  },

  /**
   * 预览图片
   */
  previewImage: function () {
    var that = this;
    wx.previewImage({
      urls: [that.data.warningIconUrl],
    })
  },

  /**
   * 选择照片
   */
  takePhoto: function () {
    var that = this;
    wx.chooseImage({
      sizeType: sizeType[1],
      count: 1,
      success: function (res) {
        that.setData({
          uploadImagePath: res.tempFilePaths[0],
        })
        that.adjustViewStatus(false, true, false);
      },
    })
  },

  /**
   * 删除已选照片
   */
  deleteSelectImage: function () {
    this.resetPhoto();
  },

  /**
   * 重置照片
   */
  resetPhoto: function () {
    var that = this;
    that.setData({
      uploadImagePath: '',
    })
  },

  previewSelectImage: function () {
    var that = this;
    wx.previewImage({
      urls: [that.data.uploadImagePath],
    })
  },

  /**
   * 拖动地图回调
   */
  regionChange: function (res) {
    var that = this;
    // 改变中心点位置   若是缩放  不调用
    if (res.type == "end" && res.causedBy != "scale") {
      that.getCenterLocation();
    }
  },

  /**
   * 得到中心点坐标
   */
  getCenterLocation: function () {
    var that = this;
    var mapCtx = wx.createMapContext(mapId);
    mapCtx.getCenterLocation({
      success: function (res) {
        // console.log('getCenterLocation----------------------->');
        // console.log(res);
        // 坐标转换
        qqmapsdk.reverseGeocoder({
          // 位置坐标，默认获取当前位置，非必须参数
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (res) {
            console.log(res.result.formatted_addresses.recommend + res.result.address)
            that.setData({
              getAdress: res.result.formatted_addresses.recommend + res.result.address
            })
            // wx.showModal({
            //   title: '',
            //   content: res.result.formatted_addresses.recommend,
            // })

            // wx.setStorageSync('address_component', res.result.address_component.city)
          },
          fail: function (error) {
            console.error('错误', error)
          }
        })
        that.updateCenterLocation(res.latitude, res.longitude);
        that.regeocodingAddress();
        that.queryMarkerInfo();
      }
    })
  },

  /**
   * 逆地址解析
   */
  regeocodingAddress: function () {
    var that = this;
    //不在发布页面，不进行逆地址解析，节省调用次数，腾讯未申请额度前一天只有10000次
    if (!that.data.showConfirm) {
      return;
    }
    //通过经纬度解析地址
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: that.data.centerLatitude,
        longitude: that.data.centerLongitude
      },
      success: function (res) {
        that.setData({
          centerAddressBean: res.result,
          selectAddress: res.result.formatted_addresses.recommend,
          currentProvince: res.result.address_component.province,
          currentCity: res.result.address_component.city,
          currentDistrict: res.result.address_component.district,
        })
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },

  /**
   * 查询 marker 信息
   */
  queryMarkerInfo: function () {
    var that = this;
    // consoleUtil.log('查询当前坐标 marker 点信息')
    //调用请求 marker 点的接口就好了
  },

  /**
   * 创建marker
   */
  createMarker: function (dataList) {
    var that = this;
    var currentMarker = [{
      iconPath: "/img/drag-icon.png",
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 50,
      height: 50
    }];
    var markerList = dataList.data;
    for (var key in markerList) {
      var marker = markerList[key];
      marker.id = marker.info_id;
      marker.latitude = marker.lat;
      marker.longitude = marker.lng;
      marker.width = 40;
      marker.height = 40;
      if (marker.image) {
        marker.iconPath = '../../img/dog-select.png';
      } else {
        marker.iconPath = '../../img/dog-yellow.png';
      }
    }
    currentMarker = currentMarker.concat(markerList);
    // consoleUtil.log('-----------------------');
    // consoleUtil.log(currentMarker);
    that.setData({
      markers: currentMarker
    })
  },

  /**
   * 选择地址
   */
  chooseAddress: function () {
    var that = this;
    wx.navigateTo({
      url: '../chooseAddress/chooseAddress?city=' + that.data.centerAddressBean.address_component.city + '&street=' + that.data.centerAddressBean.address_component.street,
    })
  },
  //点击搜索
  search: function () {
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        // console.log(res)
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
        wx.chooseLocation({
          success: function (response) {
            console.log(response);
            that.setData({
              location: {
                latitude: response.latitude,
                longtitude: response.longtitude,
                name: response.name,
                address: response.address
              },
              getAdress: response.name + response.address
            })
            console.log(that.data.getAdress)
            var pages = getCurrentPages();   //当前页面

            var prevPage = pages[pages.length - 2];   //上一页面

            prevPage.setData({

              //直接给上一个页面赋值
              addresschose: that.data.getAdress,

            });

            wx.navigateBack({

              //返回
              delta: 2

            })
          },
        })

      }
    })
  },
  //点击完成
  complete: function () {
    var that = this;
    var pages = getCurrentPages();   //当前页面

    var prevPage = pages[pages.length - 2];   //上一页面

    prevPage.setData({

      //直接给上一个页面赋值
      addresschose: that.data.getAdress,

    });

    wx.navigateBack({

      //返回
      delta: 1

    })
  },
 

  getUserInfo: function (e) {
    // console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

})
