var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
var img_url;
const app = getApp();
const utils = require('../../utils/util');
var url;//获取当前页面路径
var json = [];
var cate = [];
var picPaths;
Page({
  data: {    
    min: 5,//最少字数
    max: 300, //最多字数 (根据自己需求改变)
    currentWordNumber: 0,
    isIphoneX: false,
    img_url: [],
    picPaths:[],
    name:"",//社群名称
    description:"",//简介
    getcategory: "",//基础设施列表
    array: [],
    id:"",
    address:"",
    is_club: "",
    singer_list: [{
      key: "0",
      name: "非实体俱乐部"
    }, {
      key: "1",
      name: "实体俱乐部"
    }],
    disabled: false,
    time1: '9:00',
    time2: '23:00',
    phoneNum: "",//联系电话
    hidden: false,
    hidden1:true,
    gender: 0,//性别限制  默认为0  不限
    items: [
      { name: '不限', value: '0', checked: false},
      { name: '男', value: '1', checked: false},
      { name: '女', value: '2', checked: false},
    ],
    disabled1:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      "isIphoneX": this.isIphoneX(),
      id:options.id,
    })
    //基础设施
    that.getcategory();
    that.channeldetail()
  },
  //获取基础设施列表
  getcategory: function () {
    var that = this;
    utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.common/getcategory', 'post')
      .then(function (response) {
        if (response.statusCode == 200) {
          //成功
          if (response.data.code == 1) {
            console.log(response)
            that.setData({
              getcategory: response.data.data
            })

            let newArray = [];
            for (var i = 0; i < response.data.data.length; i++) {
              newArray.push({ "id": response.data.data[i].id, "num": 0 })
              that.setData({
                array: newArray
              })
            }
          }
          else {
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
  //选择个体组织者还是球馆
  // clickType: function (e) {
  //   // 0 非实体  1 实体
  //   var that = this;
  //   that.setData({
  //     is_club: e.detail.choose_type
  //   })
  //   if (e.detail.choose_type == 0) {
  //     that.setData({
  //       hidden: true,
  //       address: "",
  //       time1: "",
  //       time2: "",
  //       hidden1:false,
  //       // gender:0,
  //       disabled1:false
  //     })
  //     that.getcategory();
  //   } else if (e.detail.choose_type == 1) {
  //     that.setData({
  //       hidden: false,
  //       time1: "09:00",
  //       time2: "23:00",
  //       hidden1:true,
  //       disabled1:true,
  //       gender:0
  //     })
  //   }
  //   console.log(that.data.gender)
  // },
  radiochange: function (e) {
    var that = this;
    that.setData({
      gender: e.detail.value
    })
    // console.log('radio发生change事件，携带的value值为：', e.detail.value)
  },
  //选择营业开始时间
  bindTimeChange1: function (e) {
    var that = this;
    that.setData({
      time1: e.detail.value
    })
  },
  bindTimeChange2: function (e) {
    var that = this;
    that.setData({
      time2: e.detail.value
    })
  },
  getPhoneNum: function (e) {
    var that = this;
    that.setData({
      phoneNum: e.detail.value
    })
  },
  getNum: function (e) {
    var that = this;
    console.log(that.data.array)
    for (let i = 0; i < that.data.array.length; i++) {
      if (that.data.array[i].id == e.target.dataset.id) {
        let index = i;
        that.data.array[i].num = e.detail.value
      }
    }

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
                }
              })
            }
          }
        })
      }
    })
  },
  showTab: function (e) {
    console.log('this is showtabBar');
    console.log(e);
  },
  //社群详情
  channeldetail: function () {
    var that = this;
    utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.index/channeldetail?token=' + wx.getStorageSync("token"), 'post', { "id": that.data.id })
      .then(function (response) {
        if (response.statusCode == 200) {
          //成功 //end == 1 未结束   0已结束
          if (response.data.code == 1) {
            that.setData({
              channel: response.data.data,
              channeldetail: response.data.data.channel,
              imgUrls: response.data.data.channel.image.split(","),
              cate: response.data.data.channel.cate,
              name: response.data.data.channel.name,
              description: response.data.data.channel.description,
              currentWordNumber: response.data.data.channel.description.length,
              address: response.data.data.channel.address,
              is_club: response.data.data.channel.is_club,
              picPaths: response.data.data.channel.image.split(","),
              time1: response.data.data.channel.bus_starttime,
              time2: response.data.data.channel.bus_endtime,
              phoneNum: response.data.data.channel.mobile,
              gender: response.data.data.channel.gender,
            })
            for (var x in that.data.items) {
              if (that.data.items[x].value == response.data.data.channel.gender) {
                that.data.items[x].checked = "true"
                that.setData({
                  items: that.data.items
                })
              }
            }
            if (response.data.data.channel.is_club == 0 ){
              that.setData({
                hidden:true,
                hidden1:false,
                disabled1:true
              })
            } else if (response.data.data.channel.is_club == 1){
              that.setData({
                hidden:false,
                hidden1:true,
                disabled1:false
              })
            }
            that.triggerEvent("showTab", response.data.data.channel.is_club)
            that.data.img_url = response.data.data.channel.image.split(",")
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
  //监听社群名称输入
  getName:function(e){
    var that = this;
    that.setData({
      name:e.detail.value
    })
  },

  bindinput10: function (e) {//社群简介
    this.setData({
      description: e.detail.value
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

  // e.detail.value   提交form表单
  formSubmit: function (e) {
    var that = this;
    
    if (that.data.is_club == "1" && that.data.address == ""){
      wx.showToast({
        title: "请填写地址",
        icon: "none",
        duration: 2000,
      })
    }else{
      that.setData({
        disabled: true
      })
      utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.user/createChannel?token=' + wx.getStorageSync("token"), 'post', { name: that.data.name, description: that.data.description, image: that.data.picPaths.join(","), cate: that.data.array, id: that.data.id, is_club: that.data.is_club, address: that.data.address, bus_starttime: that.data.time1, bus_endtime: that.data.time2, mobile: that.data.phoneNum, gender: that.data.gender })
        .then(function (response) {
          if (response.statusCode == 200) {

            //成功
            if (response.data.code == 1) {
              that.onLoad();
              wx.showToast({
                title: response.data.msg,
                icon: "none",
                duration: 2000,
              })

              setTimeout(function () {
                wx.navigateTo({
                  url: '/pages/myAssociation/myAssociation',
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
    }
  
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
  //   // return {
  //   //   title: '天天好球',
  //   //   path: '/pages/publishBall/publishBall',
  //   // }
  // }
})