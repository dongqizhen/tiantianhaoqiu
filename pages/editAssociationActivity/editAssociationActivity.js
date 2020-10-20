
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

var D = date.getDate() < 10 ? '0' + date.getDate() :
  date.getDate();

//时

var h = date.getHours();

//分

var m = date.getMinutes();

//秒

var s = date.getSeconds();

var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
const app = getApp();
const utils = require('../../utils/util');
var img_url;
var picPaths;
var url;//获取当前页面路径
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: Y + "-" + M + "-" + D,
    tagsarray: [],
    time: "选择活动的开始时间",
    time2: "选择活动的结束时间",
    // address: wx.getStorageSync("locationAddress"),
    address: "",
    min: 5,//最少字数
    max: 300, //最多字数 (根据自己需求改变)
    remark: "",
    currentWordNumber: 0,
    isIphoneX: false,
    title: "",//活动名称
    starttime: "",//开始时间
    // fee_type:"",//费用方式
    // tags: "",//活动内容  字段
    // nickname: "",//发布人名称
    // mobile: "",//手机号
    // wxid: "",//微信号
    img_url: [],
    picPaths:[],
    channelid: "",
    maxNum: "",//最大人数
    id:"",
    disabled: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;


    that.setData({
      date: Y + "-" + M + "-" + D,
      "isIphoneX": this.isIphoneX(),
      // nickname: wx.getStorageSync("nickName"),
      channelid: options.channelid,
      id:options.id,
    })
    that.getDetail();
  },
  getDetail() {
    var that = this;
    utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.index/pagedetail?token=' + wx.getStorageSync("token"), 'post', { "id": that.data.id })
      .then(function (response) {
        if (response.statusCode == 200) {
          if (response.data.code == 1) {
            that.setData({
              detail: response.data.data,
              imgUrls: response.data.data.page.image.split(","),
              picPaths: response.data.data.page.image.split(","),
              title: response.data.data.page.title,
              date: response.data.data.page.starttime.substring(0, 10).replace(/\./g, '-'),
              time: response.data.data.page.starttime.substring(11, 16),
              time2: response.data.data.page.endtime.substring(11, 16),
              address: response.data.data.page.address,
              maxNum: response.data.data.page.num,
              remark: response.data.data.page.content,
              currentWordNumber: response.data.data.page.content.length
            })
            that.data.img_url = response.data.data.page.image.split(",")
            that.setData({
              img_url: that.data.img_url
            })
            img_url = that.data.img_url;
          }
        }
      }, function (error) {
        console.log(error);
      })
  },
  //选择图片
  chooseimage: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9 
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有 
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有 
      success: function (photo) {
        console.log(photo)
        wx.getImageInfo({
          src: photo.tempFilePaths[0],
          success: function (res) {
            var ctx = wx.createCanvasContext('photo_canvas');
            // var ratio = 1;
            var ratio = 2;
            var canvasWidth = res.width
            var canvasHeight = res.height;
            // 保证宽高均在200以内
            while (canvasWidth > 800 || canvasHeight > 800) {
              //比例取整
              canvasWidth = Math.trunc(res.width / ratio)
              canvasHeight = Math.trunc(res.height / ratio)
              ratio++;
            }
            that.setData({
              canvasWidth: canvasWidth,
              canvasHeight: canvasHeight
            })//设置canvas尺寸
            ctx.drawImage(photo.tempFilePaths[0], 0, 0, canvasWidth, canvasHeight)
            ctx.draw(true, setTimeout(function () {
              wx.canvasToTempFilePath({
                canvasId: 'photo_canvas',
                destWidth: canvasWidth,
                destHeight: canvasHeight,
                success: function (res) {
                  console.log(res)
                  var tempFilePaths = res.tempFilePath;
                  that.setData({
                    img_url: that.data.img_url.concat(res.tempFilePath)
                  });
                  var pic = that.data.img_url
                  wx.showLoading({
                    title: '图片上传中',
                  })
                  that.uploadimg({
                    url: app.globalData.publicAdress + 'api/common/alyupload',//这里是你图片上传的接口
                    filePath: [res.tempFilePath],//这里是选取的图片的地址数组  
                  });
                },
                fail: function (error) {
                  console.log(error)
                },

              })

            }, 1000))
            //下载canvas图片

          },
          fail: function (error) {
            console.log(error)
          }
        })


      }
    })
  },
  //多张图片上传
  uploadimg(data) {
    var that = this,
      i = data.i ? data.i : 0,//当前上传的哪张图片
      success = data.success ? data.success : 0,//上传成功的个数
      fail = data.fail ? data.fail : 0;//上传失败的个数
    wx.uploadFile({
      url: data.url,
      filePath: data.filePath[i],
      name: 'file',//这里根据自己的实际情况改
      formData: null,//这里是上传图片时一起上传的数据
      success: (resp) => {
        wx.hideLoading()
        var data = JSON.parse(resp.data);
        that.data.picPaths.push(data.data['file'])
        that.setData({
          picPaths: that.data.picPaths
        })
        img_url = that.data.picPaths;
        if (img_url.length >= 4) {
          that.setData({
            hideAdd: 1
          })
        } else {
          that.setData({
            hideAdd: 0
          })
        }
      },
      fail: (res) => {
        fail++;//图片上传失败，图片上传失败的变量+1

      },
      complete: () => {
        i++;//这个图片执行完上传后，开始上传下一张
        if (i == data.filePath.length) {   //当图片传完时，停止调用          
          // console.log('执行完毕');
          // console.log('成功：' + success + " 失败：" + fail);
        } else {//若图片还没有传完，则继续调用函数
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data);
        }
        // resolve(data)
      }
    });
  },
  delImg: function (e) {
    console.log(e)
    var that = this;
    var nowidx = e.currentTarget.dataset.idx;//当前索引
    var index = e.currentTarget.dataset.src;
    // img_url.splice(nowidx, 1)
    that.data.picPaths.splice(nowidx, 1)
    that.setData({
      img_url: img_url,
      picPaths: that.data.picPaths
    })
    if (that.data.picPaths.length >= 4) {
      that.setData({
        hideAdd: 1
      })
    } else {
      that.setData({
        hideAdd: 0
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

  //监听活动名称的输入
  changeTitle: function (e) {
    var that = this;
    // var inputSearch = event.detail.value;
    that.setData({
      title: e.detail.value
    })
  },

  //日期选择器
  bindDateChange: function (e) {
    var that = this;
    that.setData({
      date: e.detail.value
    })
  },
  //时间选择器
  bindTimeChange: function (e) {
    var that = this;
    that.setData({
      time: e.detail.value
    })
  },
  bindTimeChange2: function (e) {
    var that = this;
    that.setData({
      time2: e.detail.value
    })
  },
  //getNum  最大人数
  getNum: function (e) {
    var that = this;
    that.setData({
      maxNum: e.detail.value
    })
  },

  //定位活动地址
  chooseMapViewTap: function () {
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
  formSubmit: function (e) {
    var that = this;
    // e.detail.value.teamId = this.data.teamIdList[e.detail.value.teamId];
    // if (that.data.title == '' || that.data.date == '' || that.data.time == '' || that.data.free_type == '' || that.data.nickname == '' || that.data.address == "") {
    //   wx.showToast({
    //     title: "请将必填项填写完整",
    //     icon: "none",
    //     duration: 3000,
    //   })
    // } else if (this.data.mobile == "") {
    //   wx.showToast({
    //     title: "请输入手机号",
    //     icon: "none",
    //     duration: 3000,
    //   })
    // } else {

    //   that.setData({
    //     free_type: e.detail.value.teamId
    //   })
    that.setData({
      disabled: true
    })
    utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.index/createPage?token=' + wx.getStorageSync("token"), 'post', { title: that.data.title, content: that.data.remark, starttime: that.data.date + " " + that.data.time, endtime: that.data.date + " " + that.data.time2, image: that.data.picPaths.join(","), address: that.data.address, num: that.data.maxNum, channel_id: that.data.channelid, id:that.data.id })
      .then(function (response) {
        if (response.statusCode == 200) {
          
          //成功
          if (response.data.code == 1) {
            console.log(response)
            wx.showToast({
              title: response.data.msg,
              icon: "none",
              duration: 2000,
            })
            //pages/myActivityDetail/myActivityDetail
            setTimeout(function () {
              wx.navigateTo({
                url: '/pages/myActivityDetail/myActivityDetail?id=' + that.data.id,
              })
            }, 2000)

          } else {
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
    // }
    // e.detail.value.teamId = this.data.teamIdList[e.detail.value.teamId]
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
          wx.setStorageSync("baseUrl", url);
          wx.navigateTo({
            url: '../login/login',
          })
        }
      }
    })

    // this.getPersonalInfo();
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
  // onShareAppMessage: function (res) {
  //   return {
  //     title: '天天好球',
  //     path: '/pages/publishBall/publishBall',
  //   }
  // }
})