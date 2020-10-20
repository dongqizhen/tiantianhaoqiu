
const app = getApp();
const utils = require('../../utils/util');
var img_url;
var json = [];
// var a;
var cate = [];
var picPaths;
var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;//手机号正则
var url;//获取当前页面路径
Page({

  /**
   * 页面的初始数据
   */
  data: {
    publicimgUrl: app.globalData.publicimgUrl,
    isIphoneX: false,
    singer_list: [{
      key: "1",
      name: "个体组织者"
    }, {
      key: "2",
      name: "有实体球馆"
    }],
    img_url: [],//球馆照片
    picPaths:[],
    mobile:"",//手机号
    code: '',//验证码
    iscode: null,//用于存放验证码接口里获取到的code
    codename: '| 获取验证码',
    disabled: false,
    type:2,//默认选择有球馆
    username:"",//联系人姓名
    // id_num:"130823198712028765",//身份证号
    id_pos:"",//身份证正面
    id_neg:"",//身份证反面
    company_img:[],//营业执照
    address:"",//球馆地址
    phone:"",//联系人电话
    // ball_img:"",
    getcategory:"",//基础设施列表
    name:"",//基础设置的名称
    num:"",//基础设施的数字,
    array:[],
    idCard:true,
    license:false,
    licenseImg:[],
    posImg:[],
    negImg:[],
    img1:[],
    img2:[],
    img3:[],
    isFalse:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      "isIphoneX": this.isIphoneX(),
      publicimgUrl: app.globalData.publicimgUrl,
    })
    //基础设施
    that.getcategory();

  },
  //获取基础设施列表
  getcategory:function(){
    var that = this;
    utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.common/getcategory', 'post')
      .then(function (response) {
        if (response.statusCode == 200) {
          //成功
          if (response.data.code == 1) {
            that.setData({
              getcategory: response.data.data
            })
            
            let newArray = [];
            for (var i = 0; i < response.data.data.length; i++) {
              newArray.push({ "id": response.data.data[i].id,"num":0})
              // this.setData(你在data命名的空数组：kongshuzu)
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
  getNum:function(e){
    var that = this;
    for (let i = 0; i < that.data.array.length; i++) {
      if (that.data.array[i].id == e.target.dataset.id) {
        let index = i;
        that.data.array[i].num = e.detail.value
      }
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
  //changeMobile监听输入手机号
  changeMobile:function(e){
    var that = this;
    that.setData({
      mobile: e.detail.value
    })
  },
  //验证码值
  getCodeValue: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  //获取验证码方法
  getCode: function () {
    var a = this.data.mobile;
    var _this = this;
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    if (this.data.mobile == "") {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (!myreg.test(this.data.mobile)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else {
      utils.sendRequest(app.globalData.publicAdress + 'api/sms/send?mobile=' + _this.data.mobile + '&event=' + "auth", 'get')
        .then(function (response) {
          if (response.statusCode == 200) {
            //验证码
            wx.showToast({
              title: '验证码' + response.data.msg,
              icon: 'none',
              duration: 2500
            })
            if (response.data.code == 1) {
              var num = 61;
              var timer = setInterval(function () {
                num--;
                if (num <= 0) {
                  clearInterval(timer);
                  _this.setData({
                    codename: '重新发送',
                    disabled: false
                  })
                } else {
                  _this.setData({
                    codename: num + "s",
                    disabled: true
                  })
                }
              }, 1000)
            } else {
              //验证码
              wx.showToast({
                title: '验证码' + response.data.msg,
                icon: 'none',
                duration: 2500
              })
            }
          } else {
            wx.showToast({
              title: response.data.msg,
              icon: 'none',
              duration: 2500
            })
          }
        }, function (error) {
          // console.log(error);
        })
    }

  },
  //获取验证码
  getVerificationCode() {
    var _this = this;
    this.getCode();
    _this.setData({
      disabled: false
    })
  },
  //选择个体组织者还是球馆
  clickType:function(e){
    var that = this;
    that.setData({
      type: e.detail.choose_type
    })
    if (e.detail.choose_type == 1){
      //个人
      that.setData({
        idCard: false,
        license: true,
        company_img:[],
        img3:"",
      })
    } else if (e.detail.choose_type == 2){
      //有球馆
      that.setData({
        idCard: true,
        license: false,
        id_neg:[],
        id_pos:[],
        img1:"",
        img2:""
      })

    }
  },
  //地址
  getAddress:function(e){
    var that = this;
    that.setData({
      address: e.detail.value
    })
  },
  //联系人姓名
  getUserName:function(e){
    var that = this;
    that.setData({
      username: e.detail.value
    })
  },
  //联系人电话
  getPhone:function(e){
    var that = this;
    that.setData({
      phone: e.detail.value
    })
  },
  //取消事件
  _singerCancel() {
    this.singer.hideSinger();
  },
  //确认事件
  _singerConfirm(e) {
    this.singer.hideSinger();
  },
  //license    上传营业执照
  license:function(){
    var that = this;
    wx.chooseImage({
      count: 1, // 可选择图片的数量，默认为9
      sizeType: ['original'], // 可以指定是原图上传还是压缩图上传
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机
      success: function (res) {
        console.log(res)
        wx.showLoading({
          title: '图片上传中',
        })
        //返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: app.globalData.publicAdress + 'api/common/alyupload', //此处换上你的接口地址  
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data",
          },
          formData: {
            'file': tempFilePaths[0]
          },
          success: function (res) {
            if (res.statusCode == '200') {
              wx.hideLoading()
              var data = JSON.parse(res.data);
              // _this.data.picPaths = [];
              that.data.licenseImg = [];
              that.data.licenseImg.push(data.data['file']);
              that.setData({
                company_img: that.data.licenseImg
              })
            } 
          },
          fail: function (res) {
            console.log('fail');
          },
        })

      }
    })
  },
  //上传身份证正面
  idCard1: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 可选择图片的数量，默认为9
      sizeType: ['original'], // 可以指定是原图上传还是压缩图上传
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机
      success: function (res) {
        //返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        wx.showLoading({
          title: '图片上传中',
        })
        wx.uploadFile({
          url: app.globalData.publicAdress + 'api/common/alyupload', //此处换上你的接口地址  
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data",
          },
          formData: {
            'file': tempFilePaths[0]
          },
          success: function (res) {
            if (res.statusCode == '200') {
              wx.hideLoading()
              var data = JSON.parse(res.data); 
              // _this.data.picPaths = [];
              that.data.posImg = [];
              that.data.posImg.push(data.data['file']);
              that.setData({
                id_pos: that.data.posImg
              })
            }
          },
          fail: function (res) {
            console.log('fail');
          },
        })

      }
    })
  },
  //上传身份证反面
  idCard2: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 可选择图片的数量，默认为9
      sizeType: ['original'], // 可以指定是原图上传还是压缩图上传
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机
      success: function (res) {
        //返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        wx.showLoading({
          title: '图片上传中',
        })
        wx.uploadFile({
          url: app.globalData.publicAdress + 'api/common/alyupload', //此处换上你的接口地址  
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data",
          },
          formData: {
            'file': tempFilePaths[0]
          },
          success: function (res) {
            if (res.statusCode == '200') {
              wx.hideLoading()
              var data = JSON.parse(res.data);
              // _this.data.picPaths = [];
              that.data.negImg = [];
              that.data.negImg.push(data.data['file']);
              that.setData({
                id_neg: that.data.negImg
              })
            }
          },
          fail: function (res) {
            console.log('fail');
          },
        })

      }
    })
  },
  //选择图片  多图
  chooseimage: function () {
    var that = this;
    wx.chooseImage({
      count: 4 - that.data.picPaths.length, // 默认9 
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有 
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有 
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          img_url: that.data.img_url.concat(res.tempFilePaths)
        });
        var pic = that.data.img_url
        wx.showLoading({
          title: '图片上传中',
        })
        that.uploadimg({
          url: app.globalData.publicAdress + 'api/common/alyupload',//这里是你图片上传的接口
          filePath: res.tempFilePaths,//这里是选取的图片的地址数组  
        });
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
  //删除多图
  delImg: function (e) {
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
  //delLicense   删除单图   营业执照
  delLicense:function(e){
    var that = this;
    var nowidx = e.currentTarget.dataset.idx;//当前索引
    var index = e.currentTarget.dataset.src;
    that.data.company_img.splice(nowidx, 1)
    that.setData({
      company_img: that.data.company_img
    })
  },
  //删除身份证正面
  delid_pos:function(e){
    var that = this;
    var nowidx = e.currentTarget.dataset.idx;//当前索引
    var index = e.currentTarget.dataset.src;
    that.data.id_pos.splice(nowidx, 1)
    that.setData({
      id_pos: that.data.id_pos
    })
  },
  //删除身份证反面
  delid_neg: function (e) {
    var that = this;
    var nowidx = e.currentTarget.dataset.idx;//当前索引
    var index = e.currentTarget.dataset.src;
    that.data.id_neg.splice(nowidx, 1)
    that.setData({
      id_neg: that.data.id_neg
    })
  },
  //发布按钮事件
  // send: function () {
  //   var that = this;
  //   var user_id = wx.getStorageSync('userid')
  //   wx.showLoading({
  //     title: '上传中',
  //   })
  //   that.img_upload()
  // },
  //图片上传
  // img_upload: function () {
  //   let that = this;
  //   let img_url = that.data.img_url;
  //   let img_url_ok = [];
  //   //由于图片只能一张一张地上传，所以用循环
  //   for (let i = 0; i < img_url.length; i++) {
  //     wx.uploadFile({
  //       //路径填你上传图片方法的地址
  //       url: 'http://wechat.homedoctor.com/Moments/upload_do',
  //       filePath: img_url[i],
  //       // name: 'file',
  //       // formData: {
  //       //   'user': 'test'
  //       // },
  //       name: 'file',
  //       header: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //       formData: {
  //         'file': tempFilePaths[0]
  //       },
  //       success: function (res) {
  //         console.log('上传成功');
  //         //把上传成功的图片的地址放入数组中
  //         img_url_ok.push(res.data)
  //         //如果全部传完，则可以将图片路径保存到数据库
  //         if (img_url_ok.length == img_url.length) {
  //           var userid = wx.getStorageSync('userid');
  //           var content = that.data.content;
  //           wx.request({
  //             url: 'http://wechat.homedoctor.com/Moments/adds',
  //             data: {
  //               user_id: userid,
  //               images: img_url_ok,
  //               content: content,
  //             },
  //             success: function (res) {
  //               if (res.data.status == 1) {
  //                 wx.hideLoading()
  //                 wx.showModal({
  //                   title: '提交成功',
  //                   showCancel: false,
  //                   success: function (res) {
  //                     if (res.confirm) {
  //                       wx.navigateTo({
  //                         url: '/pages/my_moments/my_moments',
  //                       })
  //                     }
  //                   }
  //                 })
  //               }
  //             }
  //           })
  //         }
  //       },
  //       fail: function (res) {
  //         console.log('上传失败')
  //       }
  //     })
  //   }
  // },
  // e.detail.value   提交form表单
  formSubmit: function (e) {
    var that = this;
    for (let i = 0; i < json.length; i++) {
      if (json[i].id == e.target.dataset.id) {
        let index = i;
        json[i].id = e.target.dataset.id
      }
    }
    // e.detail.value.teamId = this.data.teamIdList[e.detail.value.teamId];
    // if (that.data.title == '' || that.data.date == '' || that.data.time == '' || that.data.free_type == '' || that.data.nickname == '' || that.data.address == "") {
    //   wx.showToast({
    //     title: "请将必填项填写完整",
    //     icon: "none",
    //     duration: 3000,
    //   })
    // } else 
    if (this.data.mobile == "") {
      wx.showToast({
        title: "请输入手机号",
        icon: "none",
        duration: 3000,
      })
    } 
    // else if (that.data.type == 1 && (that.data.id_pos == '' || that.data.id_neg == '' )){
    //   //个人
    //   wx.showToast({
    //     title: "请上传身份证正反面",
    //     icon: "none",
    //     duration: 3000,
    //   })
    // } else if (that.data.type == 2 && that.data.company_img == ''){
    //   //实体球馆
    //   wx.showToast({
    //     title: "请上传营业执照",
    //     icon: "none",
    //     duration: 3000,
    //   })
    // } 
    else if (that.data.username == ""){
      wx.showToast({
        title: "请填写联系人姓名",
        icon: "none",
        duration: 3000,
      })
    } else if (that.data.phone == ""){
      wx.showToast({
        title: "请填写联系人电话",
        icon: "none",
        duration: 3000,
      })
    }else {

      // that.setData({
      //   free_type: e.detail.value.teamId
      // })
      if (that.data.id_pos.length == 0){
        that.setData({
          img1:""
        })
      }else{
        that.data.img1 = that.data.id_pos[0]
        that.setData({
          img1: that.data.img1
        })
      }
      if (that.data.id_neg.length == 0){
        that.setData({
          img2:""
        })
      }else{
        that.data.img2 = that.data.id_neg[0]
        that.setData({
          img2: that.data.img2
        })
      }
      if (that.data.company_img.length == 0){
        that.setData({
          img3: ""
        })
      }else{
        that.data.img3 = that.data.company_img[0]
        that.setData({
          img3: that.data.img3
        })
      }
      that.setData({
        isFalse:true
      })
      //发布约球信息
      utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.user/userAuth?token=' + wx.getStorageSync("token"), 'post', { username: that.data.username, ball_img: that.data.picPaths.join(","), id_pos: that.data.img1, id_neg: that.data.img2, address: that.data.address, mobile: that.data.mobile, captcha: that.data.code, type: that.data.type, cate: that.data.array, contact_mobile: that.data.phone, company_img: that.data.img3})
        .then(function (response) {
          if (response.statusCode == 200) {
            //成功
            if (response.data.code == 1) {
              wx.showToast({
                title: response.data.msg,
                icon: "none",
                duration: 2000,
              })
              setTimeout(function () {
                
                wx.switchTab({
                  url: '/pages/personal/personal',
                })
              }, 2000)

            } else {
              that.setData({
                isFalse:false
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //获得input_select组件
    this.input_select = this.selectComponent("#input_select");

    //获得singer组件 单选
    this.singer = this.selectComponent("#singer");

    //获得multiple组件  多选
    this.multiple = this.selectComponent("#multiple");
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
          wx.setStorageSync("baseUrl_to", url);
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
  onShareAppMessage: function () {

  }
})