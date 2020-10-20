// pages/ballDetail/ballDetail.js
const app = getApp()
const utils = require('../../utils/util')
// var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
// var qqmapsdk;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    publicimgUrl: app.globalData.publicimgUrl,
    isIphoneX: false,
    id: "",
    ballDetail: "",
    comment_text: "",//评论内容
    send_text: "",//回复内容
    pid: 0,//默认为0   评论id
    commentList: "",//评论信息列表
    commentList0: "",
    date:"",
    time:"",
    lat: "",//纬度
    lng: "",//精度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      "isIphoneX": this.isIphoneX(),
      id: options.id
    });
    that.getDetail();
    that.getCommentList();
    // that.setAreday();
  },
  isIphoneX() {
    let mobile = wx.getSystemInfoSync();
    if (mobile.model.indexOf("iPhone X") >= 0) {
      return true;
    } else {
      return false;
    }
  },
  tel: function (e) {
    var mobile = e.currentTarget.dataset.mobile;
    wx.makePhoneCall({
      phoneNumber: mobile,
    })
  },
  //一键复制
  getWxID: function (e) {
    var wxid = e.currentTarget.dataset.wx;
    wx.setClipboardData({
      data: wxid,
      success(res) {
        wx.getClipboardData({
          success(res) {
          }
        })
      }
    })
  },
  getDetail: function () {
    var that = this;
    utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.archives/detail?id=' + that.data.id, 'get')
      .then(function (response) {
        if (response.statusCode == 200) {
          //成功
          if (response.data.code == 1) {
            that.setData({
              ballDetail: response.data.data.archivesInfo,
              date: response.data.data.archivesInfo.starttime.substring(0,10),
              time: response.data.data.archivesInfo.starttime.substring(11, 17),
              //纬度
              lat: response.data.data.archivesInfo.lat,
              lng: response.data.data.archivesInfo.lng,
            })
            
          }

        }
      }, function (error) {
        console.log(error);
      })
  },
  //点击回复按钮
  reply: function () {
    var that = this;
    that.setData({
      hidden: false
    })
  },
  //将未读消息设置为已读
  // setAreday:function(){
  //   var that = this;
  //   utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.user/setread?aid=' + that.data.id + '&token=' + wx.getStorageSync("token"), 'get')
  //     .then(function (response) {
  //       if (response.statusCode == 200) {
  //         //成功
  //         if (response.data.code == 1) {
            
  //         }

  //       }
  //     }, function (error) {
  //       console.log(error);
  //     })
  // },
  //评论内容
  getComment: function (e) {
    var that = this;
    that.setData({
      comment_text: e.detail.value
    })
  },
  //回复内容
  sendComment: function (e) {
    var that = this;
    that.setData({
      send_text: e.detail.value
    })
  },
  //点击评论按钮
  publishComment: function (e) {
    var that = this;
    if (that.data.comment_text == "" || that.data.comment_text == null) {
      wx.showToast({
        title: '请输入评论内容',
        icon: "none",
        duration: 3000,
      })
    } else {
      that.pushComment(that.data.comment_text)
    }
  },
  //点击地址
  activity_adress:function(e){
    var that = this;
    wx.openLocation({
      latitude: Number(that.data.lat),
      // lat: response.data.data.archivesInfo.lat,
      // likeratio: response.data.data.archivesInfo.likeratio
      longitude: Number(that.data.lng),
      // name: "花园桥肯德基",
      scale:10
    })
  // }
  },
  pushComment: function (comment) {
    var that = this;
    utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.comment/post?token=' + wx.getStorageSync("token"), 'post', { content: comment, aid: that.data.id, pid: that.data.pid })
      .then(function (response) {
        if (response.statusCode == 200) {
          //成功
          if (response.data.code == 1) {
            // that.onLoad()
            wx.showToast({
              title: response.data.msg,
              icon: "success",
              duration: 3000,
            })
            that.setData({
              comment_text:""
            })
            that.getCommentList();
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
  //点击软键盘的发送
  wxSearchConfirm: function (e) {
    var that = this;

    that.setData({
      send_text: e.detail.value['search - input'] ? e.detail.value['search - input'] : e.detail.value
    })
    that.pushComment(that.data.send_text)
  },
  //评论信息列表
  getCommentList: function () {
    var that = this;
    utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.comment/index?aid=' + that.data.id, 'post', { page: 1 })
      .then(function (response) {
        if (response.statusCode == 200) {
          //成功
          if (response.data.code == 1) {
            that.setData({
              commentList: response.data.data.commentList
            })
           
            if (response.data.data.commentList.length == 0) {
              that.setData({
                pid: 0
              })
            } else {
              that.setData({
                pid: response.data.data.commentList[0].pid,
                commentList0: response.data.data.commentList[0]
              })
            }
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
  btn_del: function () {
    var that = this;
    wx.showModal({
      title: '删除确认',
      content: '您确认要删除约球活动吗？删除后将不可恢复，请慎重哦！',
      confirmText: "删除",
      cancelText: "返回",
      // cancelColor:"",
      confirmColor: "#7966FE",
      success(res) {
        if (res.confirm) {
          utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.archives/delarchives?id=' + that.data.id + '&token=' + wx.getStorageSync("token"), 'get')
            .then(function (response) {
              if (response.statusCode == 200) {
                //成功
                if (response.data.code == 1) {
                  wx.showToast({
                    title: response.data.msg,
                    icon: "success",
                    duration: 3000,
                  })
                  wx.switchTab({
                    url: '../index/index',
                  })
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
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  goEditDetail: function (e) {
    //点击去编辑页面
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/editBallDetail/editBallDetail?id=' + id,
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
    var that = this;

    // that.onLoad()
    // that.getCommentList();
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