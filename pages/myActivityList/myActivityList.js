// pages/association/association.js
const app = getApp()
const utils = require('../../utils/util')
import DrawImg from '../../palette/card';
var showImgData;
var showImgData1;
var fileName = "";
var fileName1 = "";
var urls;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /** 
            * 页面配置 
            */
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    page: 1,              //记录加载数据的页数参数
    flag: true,            //记录是否请求数据的状态
    myList: [],
    list:[],
    showModel: true,
    cardsmeans: '',
    template: {},
    url: '',
    name: '',
    position: '',
    company: '',
    mobile: '',
    wechat: '',
    adress: '',
    logo: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({

      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }

    });
    //我参加的活动
    that.joinPage();
    //我发布的活动
    that.myPageList(that.data.page);
  },
  //我参加的活动

  joinPage(page) {
    //把this对象复制到临时变量that
    var that = this;
    //打开记录请求的状态flag
    this.setData({
      flag: false
    })
    utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.user/myjoinPage?token=' + wx.getStorageSync("token"), 'get')
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
  //我发布的活动
  myPageList(page) {
    //把this对象复制到临时变量that
    var that = this;
    //打开记录请求的状态flag
    this.setData({
      flag: false
    })
    utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.user/myPage?page=' + that.data.page + "&token=" + wx.getStorageSync("token"), 'get')
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
            var list = that.data.myList.concat(response.data.data);
            //为下一页的请求参数做准备
            var nextPage = ++that.data.page;
            that.setData({
              myList: list,
              page: nextPage,
              flag: reqState,
            })
          } else if (response.data.code == 0) {
            that.data.myList = [];
            that.setData({
              myList: that.data.myList
            })
          }
        }
      }, function (error) {
        console.log(error);
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
    if (e.currentTarget.dataset.current == 0){
      //我参加的活动
      that.data.list = [];
      that.joinPage();
    } else if (e.currentTarget.dataset.current == 1){
      that.setData({
        page:1
      })
      that.data.myList = [];
      that.myPageList(that.data.page);
    }

  },
  //点击编辑
  // edit:function(e){
  //   var id = e.currentTarget.dataset.id;
  //   var channelid = e.currentTarget.dataset.channelid
  //   wx.navigateTo({
  //     url: '/pages/editAssociationActivity/editAssociationActivity?id=' + id + '&channelid=' + channelid,
  //   })
  // },
  //点击分享
  share: function (e) {
    wx.removeStorageSync("billId");
    wx.setStorageSync("billId", e.currentTarget.dataset.billid)
    this.setData({
      showModel: false
    })
    DrawImg(res => {
      this.setData({
        template: res
      })
    })
  },
  close:function(){
    this.setData({
      showModel: true
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onImgOK(e) {
    this.imagePath = e.detail.path;
    // console.log(e);
  },

  download() {
    wx.saveImageToPhotosAlbum({
      filePath: this.imagePath,
      success: function (data) {
        // console.log(data);
        wx.showToast({
          title: '图片保存成功',
        })
      },
    });
  },
  //去活动详情
  toDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/activityDetail/activityDetail?id=' + id,
    })
  },
  //myActivityDetail
  toDetailMY: function (e) {
      var id = e.currentTarget.dataset.id;
      // var channelid = e.currentTarget.dataset.channelid
      // wx.navigateTo({
      //   url: '/pages/editAssociationActivity/editAssociationActivity?id=' + id + '&channelid=' + channelid,
      // })
    wx.navigateTo({
      url: '/pages/myActivityDetail/myActivityDetail?id=' + id,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // DrawImg(res => {
    //   this.setData({
    //     template: res
    //   })
    // })
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
    var that = this;
    //根据请求状态flag请求数据
    if (this.data.flag) {
      if (that.data.currentTab == 1){
        that.myPageList(that.data.page);
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
      if (that.data.currentTab == 1) {
        that.myPageList(that.data.page);
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})