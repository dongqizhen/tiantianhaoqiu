// pages/personalInfo/personalInfo.js
const app = getApp()
const utils = require('../../utils/util')
var recordId;
var tradeId;
var typeId;
Page({

  /**
   * 页面的初始数据
   */
  // type:1= 普通用户，2= 助教，3= 球馆
  data: {
    personalInfo:"",
    nickname:"",
    years:"",
    trade: ['公务员、企事业', '技术人员', '商业、服务业', '农林牧渔', '军人', '自由职业、其他'],
    schoolList:['30后', '40后', '50后', '60后', '70后', '80后', '90后',"00后","10后"],//学历,
    type: ["普通用户", "助练", "实体俱乐部","非实体俱乐部"],
    j: 0,
    pickerIndex: 0,
    index:0,
    teamIdList: "",
    teamId: "",
    wxid:"",
    avatarUrl:"",
    mobile:"",
    gender:0,
    genderText:""
  },
  changeTitle:function(e){
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
  bindPickerChange: function (e) {
    this.setData({
      j: e.detail.value
    })
    recordId = this.data.schoolList[e.detail.value]
    console.log(recordId)
  },
  bindPickerChange2: function (e) {
    this.setData({
      pickerIndex: e.detail.value
    })
    tradeId = this.data.trade[e.detail.value]
    console.log(tradeId)
  },
  bindPickerChange3:function(e){
    this.setData({
      index: e.detail.value
    })
    typeId = this.data.type[e.detail.value]
    console.log(typeId)
  },
  changewxid: function (e) {
    var that = this;
    that.setData({
      wxid: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.getPersonalInfo();
  },
  getPersonalInfo: function () {
    var that = this;
    utils.sendRequest(app.globalData.publicAdress + 'api/user/index?token=' + wx.getStorageSync("token"), 'get')
      .then(function (response) {
        if (response.statusCode == 200) {
          //成功
          if (response.data.code == 1) {
            that.setData({
              personalInfo: response.data.data.userinfo,
              nickname: response.data.data.userinfo.username,
              wxid: response.data.data.userinfo.wxid,
              avatarUrl: response.data.data.userinfo.avatar,
              gender: response.data.data.userinfo.gender,
              mobile: response.data.data.userinfo.mobile,
            })
            if (response.data.data.userinfo.gender == 0){
              that.setData({
                genderText:"未知"
              })
            } else if (response.data.data.userinfo.gender == 1) {
              that.setData({
                genderText: "男"
              })
            } else if (response.data.data.userinfo.gender == 2) {
              that.setData({
                genderText: "女"
              })
            }
          }
          if (response.data.data.userinfo.years == "30后"){
            that.setData({
              j: 0
            })
          } else if (response.data.data.userinfo.years == "40后"){
            that.setData({
              j: 1
            })
          } else if (response.data.data.userinfo.years == "50后") {
            that.setData({
              j: 2
            })
          } else if (response.data.data.userinfo.years == "60后") {
            that.setData({
              j: 3
            })
          } else if (response.data.data.userinfo.years == "70后") {
            that.setData({
              j: 4
            })
          } else if (response.data.data.userinfo.years == "80后") {
            that.setData({
              j:5
            })
          } else if (response.data.data.userinfo.years == "90后") {
            that.setData({
              j: 6
            })
          } else if (response.data.data.userinfo.years == "00后") {
            that.setData({
              j: 7
            })
          } else if (response.data.data.userinfo.years == "10后") {
            that.setData({
              j: 8
            })
          }
// trade: ['公务员、企事业', '技术人员', '商业、服务业', '农林牧渔', '军人', '自由职业、其他'],
          if (response.data.data.userinfo.datawork == "公务员、企事业"){
            that.setData({
              pickerIndex:0
            })
          } else if (response.data.data.userinfo.work == "技术人员"){
            that.setData({
              pickerIndex:1
            })
          } else if (response.data.data.userinfo.work == "商业、服务业") {
            that.setData({
              pickerIndex:2
            })
          }
          else if (response.data.data.userinfo.work == "农林牧渔") {
            that.setData({
              pickerIndex: 3
            })
          }
          else if (response.data.data.userinfo.work == "军人") {
            that.setData({
              pickerIndex:4
            })
          }
          else if (response.data.data.userinfo.work == "自由职业、其他") {
            that.setData({
              pickerIndex: 4
            })
          }
          // "普通用户", "助练", "实体俱乐部","非实体俱乐部"
          if (response.data.data.userinfo.type == "普通用户"){
            that.setData({
              index:0
            })
          } else if (response.data.data.userinfo.type == "助练"){
            that.setData({
              index: 1
            })
          } else if (response.data.data.userinfo.type == "实体俱乐部") {
            that.setData({
              index:2
            })
          } else if (response.data.data.userinfo.type == "非实体俱乐部") {
            that.setData({
              index: 3
            })
          }
        }
      }, function (error) {
        console.log(error);
      })
  },
  formSubmit: function (e) {
    var that = this;
    utils.sendRequest(app.globalData.publicAdress + 'api/User/profile?token=' + wx.getStorageSync("token"), 'POST', { username: that.data.nickname, avatar: that.data.avatarUrl, gender: that.data.gender, years: recordId, work: tradeId, wxid: that.data.wxid, mobile: that.data.mobile, type: typeId})
      .then(function (response) {
        console.log(response)
        if (response.statusCode == 200) {
          if (response.data.code == 1){
            wx.showToast({
              title: response.data.msg,
              icon: "none",
              duration: 2000,
            })
            setTimeout(function () {
              wx.switchTab({
                url: '../personal/personal'
              })
            }, 2000)
          }else{
            wx.showToast({
              title: response.data.msg,
              icon: "none",
              duration: 2000,
            })
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
  // onShareAppMessage: function () {

  // }
})