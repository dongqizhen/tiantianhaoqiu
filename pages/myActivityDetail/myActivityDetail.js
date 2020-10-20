// pages/activityDetail/activityDetail.js
const app = getApp()
const utils = require('../../utils/util')
import DrawImg from '../../palette/card';
var showImgData;
var showImgData1;
var fileName = "";
var fileName1 = "";
var url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: "",
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    circular: true,
    id: "",
    showModel: true,
    channelid:"",
    lat: "",
    commentList: "",
    lng: "",
    pid: 0,//默认为0   评论id
    comment_text: "",//评论内容
    send_text: "",//回复内容
    pid: 0,//默认为0   评论id
    commentList: "",//评论信息列表
    commentList0: "",
    date: "",
    time: "",
    hidden: true,
    remarkinfo: [],
    otherUrl: "",//评论列表的头像,
    huifu: "",
    lat: "",
    lng: "",
    len: 0,
    perUrl: wx.getStorageSync("FaceUrl")
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    url = that.route + "?id=" + options.id
    that.setData({
      id: options.id,
      avatarUrls: "",
      perUrl: wx.getStorageSync("FaceUrl")
    })
    that.getDetail();
    that.getCommentList();
  },
  getDetail() {
    var that = this;
    //token=' + wx.getStorageSync("token")
    utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.index/pagedetail?token=' + wx.getStorageSync("token"), 'post', { "id": that.data.id })
      .then(function (response) {
        if (response.statusCode == 200) {
          if (response.data.code == 1) {
            that.setData({
              detail: response.data.data,
              imgUrls: response.data.data.page.image.split(","),
              lat: response.data.data.page.lat,
              lng: response.data.data.page.lng,
              channelid: response.data.data.page.channel_id
            })
            wx.setStorageSync("nickname", response.data.data.page.nickname)
          }
        }
      }, function (error) {
        console.log(error);
      })
  },
  //点击进去社群
  toDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/associationDetail/associationDetail?id=' + id,
    })
  },
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
  //点击回复按钮
  reply: function (e) {
    // var that = this;
    // that.setData({
    //   hidden:false
    // })
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            lang: "zh_CN",
            success: function (res) {
              let userInfo = res.userInfo;
              wx.removeStorageSync("baseUrl_to");
              for (var i = 0; i < that.data.commentList.length; i++) {
                that.data.remarkinfo.push(true);
                // that.data.isJianTou1.push(false);
                that.setData({
                  remarkinfo: that.data.remarkinfo,
                  pid: e.currentTarget.dataset.pid
                })
                if (e.currentTarget.dataset.index == [i]) {
                  that.data.remarkinfo[i] = false;
                  that.setData({
                    remarkinfo: that.data.remarkinfo
                  })
                }
                that.setData({
                  remarkinfo: that.data.remarkinfo
                })
              }
            }
          })
        } else {
          wx.setStorageSync("baseUrl_to", url);
          wx.navigateTo({
            url: '../login/login',
          })
        }
      }
    })

  },
  //点击评论按钮
  publishComment: function (e) {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            lang: "zh_CN",
            success: function (res) {
              let userInfo = res.userInfo;
              wx.removeStorageSync("baseUrl_to");
              utils.sendRequest(app.globalData.publicAdress + 'api/user/index?token=' + wx.getStorageSync("token"), 'get')
                .then(function (response) {
                  if (response.statusCode == 200) {
                    //成功
                    if (response.data.code == 1) {

                      if (response.data.data.userinfo.mobile == "" || response.data.data.userinfo.mobile == null || response.data.data.userinfo.mobile == undefined) {
                        wx.setStorageSync("baseUrl1", url);
                        wx.navigateTo({
                          url: '../register/register',
                        })
                      } else if (that.data.comment_text == "" || that.data.comment_text == null) {
                        wx.showToast({
                          title: '请输入评论内容',
                          icon: "none",
                          duration: 3000,
                        })
                      } else {
                        that.pushComment(that.data.comment_text)
                      }
                    } else {

                    }


                  }
                }, function (error) {
                  console.log(error);
                })
            }
          })
        } else {
          wx.setStorageSync("baseUrl_to", url);
          wx.navigateTo({
            url: '../login/login',
          })
        }
      }
    })


  },

  pushComment: function (comment) {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            lang: "zh_CN",
            success: function (res) {
              let userInfo = res.userInfo;
              wx.removeStorageSync("baseUrl_to");
              utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.comment/post?token=' + wx.getStorageSync("token"), 'post', { content: comment, aid: that.data.id, pid: that.data.pid, type: "page" })
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
                        comment_text: "",
                        send_text: ""
                      })
                      for (var i = 0; i < that.data.commentList.length; i++) {
                        // that.data.remarkinfo[i] = false;
                        that.data.remarkinfo[i] = true;
                        that.setData({
                          remarkinfo: that.data.remarkinfo
                        })
                      }
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
            }
          })
        } else {
          wx.setStorageSync("baseUrl_to", url);
          wx.navigateTo({
            url: '../login/login',
          })
        }
      }
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
    utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.comment/index?aid=' + that.data.id, 'post', { type: "page" })
      .then(function (response) {
        if (response.statusCode == 200) {
          //成功
          if (response.data.code == 1) {
            that.setData({
              commentList: response.data.data.commentList
            })

            for (var i = 0; i < response.data.data.commentList.length; i++) {
              // that.data.remarkinfo[i] = false;
              that.data.remarkinfo.push(true);
              that.setData({
                remarkinfo: that.data.remarkinfo,
                huifu: response.data.data.commentList[i].huifu
                // otherUrl: response.data.data.commentList[0].avatar
              })
              for (var j = 0; j < response.data.data.commentList[i].huifu.length; j++) {
                that.setData({
                  len: response.data.data.commentList[i].huifu.length
                })

              }
              if (response.data.data.commentList.length == 0) {
                that.setData({
                  pid: 0
                })
              } else {
                that.setData({

                  commentList0: response.data.data.commentList[0]
                })
                // if (response.data.data.commentList.huifu) {
                // that.setData({
                //   huifu: response.data.data.commentList[i].huifu
                // })
                // }
                // console.log( ":::" + that.data.huifu)
              }
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
  //点击立即报名
  nowEnter: function () {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            lang: "zh_CN",
            success: function (res) {
              utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.order/joinPage?token=' + wx.getStorageSync("token"), 'post', { id: that.data.id })
                .then(function (response) {
                  if (response.statusCode == 200) {
                    //成功
                    if (response.data.code == 1) {
                      wx.showToast({
                        title: response.data.msg,
                        icon: "none",
                        duration: 3000,
                      })
                      that.onLoad()
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
            }
          })
        } else {
          wx.setStorageSync("baseUrl_to", url);
          wx.navigateTo({
            url: '../login/login',
          })
        }
      }
    })

  },
  //点击地址
  activity_adress: function (e) {
    var that = this;
    wx.openLocation({
      latitude: Number(that.data.lat),
      // lat: response.data.data.archivesInfo.lat,
      // likeratio: response.data.data.archivesInfo.likeratio
      longitude: Number(that.data.lng),
      // name: "花园桥肯德基",
      scale: 10
    })
    // }
  },
  //点击分享
  share: function (e) {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            lang: "zh_CN",
            success: function (res) {
              wx.removeStorageSync("billId");
              wx.setStorageSync("billId", e.currentTarget.dataset.billid)
              that.setData({
                showModel: false
              })
              DrawImg(res => {
                that.setData({
                  template: res
                })
              })
            }
          })
        } else {
          wx.setStorageSync("baseUrl_to", url);
          wx.navigateTo({
            url: '../login/login',
          })
        }
      }
    })

  },
  close: function () {
    this.setData({
      showModel: true
    })
  },

  //点击编辑
  edit: function () {
    var that = this;
    var id = that.data.id;
    var channelid = that.data.channelid;
    wx.redirectTo({
      url: '/pages/editAssociationActivity/editAssociationActivity?id=' + id + '&channelid=' + channelid,
    })
  },
  //点击删除
  deleteActivity:function(){
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            lang: "zh_CN",
            success: function (res) {
              wx.showModal({
                title: '删除确认',
                content: '您确认要删除该条活动吗？删除后将不可恢复，请慎重哦！',
                confirmText: "删除",
                cancelText: "返回",
                // cancelColor:"",
                confirmColor: "#7966FE",
                success(res) {
                  if (res.confirm) {
                    utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.index/delPage?id=' + that.data.id + '&token=' + wx.getStorageSync("token"), 'get')
                      .then(function (response) {
                        if (response.statusCode == 200) {
                          //成功
                          if (response.data.code == 1) {
                            wx.showToast({
                              title: response.data.msg,
                              icon: "success",
                              duration: 3000,
                            })
                            wx.navigateTo({
                              url: '../myActivityList/myActivityList',
                            })
                            //pages/myActivityList/myActivityList
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
            }
          })
        } else {
          wx.setStorageSync("baseUrl_to", url);
          wx.navigateTo({
            url: '../login/login',
          })
        }
      }
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {

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
  //   var that = this;
  //   return {
  //     title: '天天好球',
  //     // pages/activityDetail/activityDetail.js
  //     path: '/pages/activityDetail/activityDetail?id=' + that.data.id,
  //   }
  // }
})