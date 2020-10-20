
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
const app = getApp()
const utils = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:"",
    date:"",
    tagsList: "",//活动内容列表
    tagsarray: [],
    time: "选择活动的具体时间",
    address: "",
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
    pickerIndex: 0,
    teamIdList: "",
    teamId: "",
    objectIndex: 0,//默认显示位置
    index: 0,
    min: 5,//最少字数
    max: 300, //最多字数 (根据自己需求改变)
    remark: "",
    currentWordNumber: 0,
    isIphoneX: false,
    title: "",//活动名称
    starttime: "",//开始时间
    // fee_type:"",//费用方式
    tags: "",//活动内容  字段
    nickname: "",//发布人名称
    mobile: "",//手机号
    wxid: "",//微信号
    disabled:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      id:options.id,
      date: Y + "-" + M + "-" + D,
      "isIphoneX": this.isIphoneX(),
      nickname: app.globalData.nickName
    })
    that.gettags();
    var schoolArr = [];
    var teamArr = [];
    for (var i = 0; i < that.data.schoolList.length; i++) {
      teamArr.push(that.data.schoolList[i].teamId);
      schoolArr.push(that.data.schoolList[i].name)
    }
    that.setData({
      schoolList: schoolArr,
      teamIdList: teamArr
    })
    that.getDetail();
  },
  isIphoneX() {
    let mobile = wx.getSystemInfoSync();
    if (mobile.model.indexOf("iPhone X") >= 0) {
      return true;
    } else {
      return false;
    }
  },
  // 活动内容标签列表
  gettags: function () {
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
  //获取详情
  getDetail: function () {
    var that = this;
    utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.archives/detail?id=' + that.data.id, 'get')
      .then(function (response) {
        if (response.statusCode == 200) {
          //成功
          if (response.data.code == 1) {
            that.setData({
              ballDetail: response.data.data.archivesInfo,
              title: response.data.data.archivesInfo.title,
              date: response.data.data.archivesInfo.starttime.substring(0, 10),
              time: response.data.data.archivesInfo.starttime.substring(11, 16),
              address: response.data.data.archivesInfo.address,
              nickname: response.data.data.archivesInfo.nickname,
              mobile: response.data.data.archivesInfo.mobile,
              wxid: response.data.data.archivesInfo.wxid,
              remark: response.data.data.archivesInfo.description,
            })
            that.data.tagsarray = [];
            for (var j = 0; j < that.data.tagsList.length;j++){
              for (var i = 0; i < response.data.data.archivesInfo.tagslist.length; i++) {
                if (that.data.tagsList[j].name == response.data.data.archivesInfo.tagslist[i].name){
                    that.data.tagsList[j].checked = true;
                }
                that.data.tagsarray.push(response.data.data.archivesInfo.tagslist[i].name)
              }
            }
           
            that.setData({ tagsList: that.data.tagsList })
            console.log(that.data.tagsarray)
            var arr1 = that.data.tagsarray;
            function arrayUnique(arr) {
              var result = [], hash = {};
              for (var i = 0, elem; (elem = arr[i]) != null; i++) {
                if (!hash[elem]) {
                  result.push(elem);
                  hash[elem] = true;
                }
              }
              return result;
            }
            that.setData({
              tagsarray: arrayUnique(arr1)
            })
            if (response.data.data.archivesInfo.fee_type == "1"){
              that.setData({
                pickerIndex:0
              })
            } else if (response.data.data.archivesInfo.fee_type == "2"){
              that.setData({
                pickerIndex: 1
              })
            } else if (response.data.data.archivesInfo.fee_type == "3"){
              that.setData({
                pickerIndex: 2
              })
            }
          }

        }
      }, function (error) {
        console.log(error);
      })
  },
  //监听活动名称的输入
  changeTitle: function (e) {
    var that = this;
    // var inputSearch = event.detail.value;
    that.setData({
      title: e.detail.value
    })
  },
  //监听昵称
  changeNickName: function (e) {
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
    this.setData({
      date: e.detail.value
    })
  },
  //时间选择器
  bindTimeChange: function (e) {
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
    
  },
  //点击昵称的关闭图标
  del_nickName: function () {
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
      wxid: ""
    })
  },
  //定位活动地址
  chooseMapViewTap: function () {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
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
              address: res.address
            })
          },
        })
      }
    })
  },
  // e.detail.value   提交form表单
  formSubmit: function (e) {
    var that = this;
    e.detail.value.teamId = this.data.teamIdList[e.detail.value.teamId]
    if (that.data.title == '' || that.data.date == '' || that.data.time == '' || that.data.free_type == '' || that.data.nickname == '' || that.data.address == "") {
      wx.showToast({
        title: "请将必填项填写完整",
        icon: "none",
        duration: 3000,
      })
    } else if (!myreg.test(this.data.mobile) && this.data.mobile != "") {
      wx.showToast({
        title: "请输入正确的手机号",
        icon: "none",
        duration: 3000,
      })
    } else {

      that.setData({
        free_type: e.detail.value.teamId
      })
      that.setData({
        disabled: true
      })
      //发布约球信息
      utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.archives/addarchive?token=' + wx.getStorageSync("token"), 'post', { id:that.data.id,title: that.data.title, starttime: that.data.date + "" + that.data.time, address: that.data.address, tags: that.data.tagsarray.join(","), fee_type: that.data.free_type, nickname: that.data.nickname, mobile: that.data.mobile, wxid: that.data.wxid, description: that.data.remark })
        .then(function (response) {
          if (response.statusCode == 200) {
           
            //成功
            if (response.data.code == 1) {
              wx.switchTab({
                url: "../index/index",
              })
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
    if (value.length > 2) {
      this.data.tagsList[index].checked = false;
      this.setData({ tagsList: this.data.tagsList })
      wx.showToast({
        title: '最多只能选两项',
        icon: 'none',
        duration: 1000
      })
    } else {
      for (var i = 0; i < value.length; i++) {
        this.data.tagsarray.push(value[i].name)
      }
    }
    // for (var i = 0; i < value.length; i++) {
    //   this.data.tagsarray.push(value[i].name)
    // }
    //数据转成字符串  传给后台
    console.log(this.data.tagsarray.join(","))

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