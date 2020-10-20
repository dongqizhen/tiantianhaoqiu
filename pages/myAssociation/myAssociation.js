// pages/association/association.js
const app = getApp()
const utils = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    page: 1,              //记录加载数据的页数参数
    flag: true,            //记录是否请求数据的状态
    list:[],
    myCareList:[],//我关注的
    name:"",//搜索框的字
    type:1,//类型
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
    that.getList(that.data.page);//社群列表
    // that.myCareList(that.data.page);
  },
  getList(page) {
    //把this对象复制到临时变量that
    var that = this;
    //打开记录请求的状态flag
    this.setData({
      flag: false
    })
    utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.user/myChannel?page=' + that.data.page + '&name=' + that.data.name + '&type=' + that.data.type + '&token=' + wx.getStorageSync("token"), 'get')
    //&token=" + wx.getStorageSync("token")
      .then(function (response) {
        if (response.statusCode == 200) {
          //成功
          if (response.data.code == 1) {
            if (response.data.data.length < 10) {
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
  myCareList:function(){
    var that = this;
    //打开记录请求的状态flag
    this.setData({
      flag: false
    })
    utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.user/myJoinChannel?page=' + that.data.page +'&token=' + wx.getStorageSync("token"), 'get')
      //&token=" + wx.getStorageSync("token")
      .then(function (response) {
        if (response.statusCode == 200) {
          //成功
          if (response.data.code == 1) {
            if (response.data.data.length < 10) {
              //记录请求状态，把reqState传值给flag
              var reqState = false;
            } else {
              var reqState = true;
            }
            //接收数据，保证每次都拼接上
            var list = that.data.myCareList.concat(response.data.data);
            //为下一页的请求参数做准备
            var nextPage = ++that.data.page;
            that.setData({
              myCareList: list,
              page: nextPage,
              flag: reqState,
            })


          } else if (response.data.code == 0) {
            that.data.myCareList = [];
            that.setData({
              myCareList: that.data.myCareList
            })
          }

        }
      }, function (error) {
        console.log(error);
      })
  },
  search:function(e){
    var that = this;
    that.setData({
      name:e.detail.value
    })
    
  },
  //点击搜索框里的图标
  // getSearch:function(){
  //   var that =this;
  //   that.data.list = []
  //   that.getList(that.data.page, that.data.name, that.data.type);
  // },
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
    console.log(e)
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
      that.getList(that.data.page, that.data.name, that.data.type);
    } else if (e.currentTarget.dataset.type == "2") {
      that.data.myCareList = [];
      that.setData({
        type: "2",
        page: 1,
      });
      that.myCareList(that.data.page);
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
      if (that.data.type == "1"){
        that.getList(that.data.page);
      } else if (that.data.type == "2"){
        that.myCareList(that.data.page);
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
      if (that.data.type == "1") {
        that.getList(that.data.page);
      } else if (that.data.type == "2") {
        that.myCareList(that.data.page);
      }
    }
    },
    //编辑社群
  edit:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/editAssociation/editAssociation?id=' + id,
    })
  },
  //社群详情
  toDetail:function(e){
    var id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '/pages/associationDetail/associationDetail?id=' + id+'&name='+name,
    })
  },
  //创建社群
  toCreate:function(){
    var that = this;
    // if (wx.getStorageSync("is_pub") == 0) {
    //   wx.navigateTo({
    //     url: '/pages/certification/certification',
    //   })
    // } else if (wx.getStorageSync("is_pub") == 1) {
    //   wx.navigateTo({
    //     url: '/pages/createAssociation/createAssociation',
    //   })
    // } else if (wx.getStorageSync("is_pub") == 2) {
    //   wx.showToast({
    //     title: "审核中，请耐心等待",
    //     icon: "none",
    //     duration: 2000,
    //   })
    // } else if (wx.getStorageSync("is_pub") == 3) {
    //   wx.navigateTo({
    //     url: '/pages/certification/certification',
    //   })
    // }
    wx.navigateTo({
      url: '/pages/createAssociation/createAssociation',
    })
  }
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})