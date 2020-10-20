// pages/CircleFriends/CircleFriends.js
var app = getApp()
const utils = require('../../utils/util')
var url;//获取当前页面路径
Page({
  /**
   * 页面的初始数据
   */
  data: {
    photoWidth: wx.getSystemInfoSync().windowWidth / 5,
    popTop: 0, //弹出点赞评论框的位置
    popWidth: 0, //弹出框宽度
    // isShow: true, //判断是否显示弹出框
    id:"",
    list:"",
    comment:"",
    hidden: true,
    remarkinfo: [],
    remarkinfoTwo:[],
    num:"",
    send_text: "",//回复内容
    pid:"0",
    aid:"",
    huifu: "",
    commentList0: "",
    pidArry:[],
    idx:"",
    userId: wx.getStorageSync("userId")

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
   var  that = this;
    url = that.route;
   that.setData({
     id: options.channelid
   });
    that.quanList();
  },
  quanList:function(){
    var that = this;
    utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.index/quanList?token=' + wx.getStorageSync("token"), 'get', { "channel_id":that.data.id})
      .then(function (response) {
        if (response.statusCode == 200) {
          //成功
          if (response.data.code == 1) {
            that.setData({
              num: response.data.data,
              list: response.data.data.quan,
            })
            // that.data.remarkinfo = [];
            for (var i = 0; i < response.data.data.quan.length; i++) {
              that.data.remarkinfo.push(true);
              that.data.pidArry.push(i)
              that.setData({
                remarkinfo: that.data.remarkinfo,
                pidArry: that.data.pidArry
              })
              
              
              if (response.data.data.quan.length == 0) {
                that.setData({
                  aid: 0
                })
              } else {
                that.setData({
                  commentList0: response.data.data.quan[0]
                })
              }
              for (var j = 0; j < response.data.data.quan[i].comment.length;j++){
                that.data.remarkinfoTwo.push(true);
                // that.data.pidArry.push(response.data.data.quan[i].comment[j].id)
                that.setData({
                  comment: response.data.data.quan[i].comment,
                  remarkinfoTwo: that.data.remarkinfoTwo,
                  pidArry: that.data.pidArry
                })
              }
            }
            
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
  zanLeft:function(e){
    ///addons/cms/wxapp.user/followchannel
    var that = this;
    var id = e.currentTarget.dataset.aid;
    utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.user/followchannel?token=' + wx.getStorageSync("token"), 'post', { "type": "quan", "aid": id })
      .then(function (response) {
        if (response.statusCode == 200) {
          //成功
          if (response.data.code == 1) {
            that.quanList();
            // that.setData({
            //   list: response.data.data
            // })
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
  sendComment: function (e) {
    var that = this;
    that.setData({
      send_text: e.detail.value
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
                utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.comment/post?token=' + wx.getStorageSync("token"), 'post', { content: comment, aid: that.data.aid, pid: that.data.pid, type: "quan" })
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
                        // that.data.remarkinfo = [];
                        for (var i = 0; i < that.data.list.length; i++) {
                          // that.data.remarkinfo[i] = false;
                          that.data.remarkinfo[i] = true;
                          that.setData({
                            remarkinfo: that.data.remarkinfo
                          })
                        }
                        for (var i = 0; i < that.data.comment.length; i++) {
                          that.data.remarkinfoTwo[i] = true;
                          that.setData({
                            remarkinfoTwo: that.data.remarkinfoTwo
                          })
                        }
                        that.quanList();
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
            // wx.setStorageSync("baseUrl_to", url);
            wx.navigateTo({
              url: '../login/login',
            })
          }
        }
      })
    

  },
  //删除  delete
  deleteA: function (e) {
    var id = e.currentTarget.dataset.sid;
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
              utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.comment/delComment?token=' + wx.getStorageSync("token"), 'get', { "type": "quan", "id": id })
                .then(function (response) {
                  if (response.statusCode == 200) {
                    //成功
                    if (response.data.code == 1) {
                      wx.showToast({
                        title: response.data.msg,
                        icon: "none",
                        duration: 3000,
                      })
                      that.quanList();
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
  reply: function (e) {
    var that = this;
    that.setData({
      aid: e.currentTarget.dataset.aid
    })
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            lang: "zh_CN",
            success: function (res) {
              let userInfo = res.userInfo;
              wx.removeStorageSync("baseUrl_to");
              // that.data.remarkinfo = [];
              
              for (var i = 0; i < that.data.list.length; i++) {
                // that.data.remarkinfoTwo.push(true);
                // that.setData({
                //   remarkinfoTwo: that.data.remarkinfoTwo
                // })
                that.data.remarkinfo.push(true);
                that.setData({
                  remarkinfo: that.data.remarkinfo,
                  remarkinfoTwo: that.data.remarkinfoTwo
                })
                if (e.currentTarget.dataset.index == [i]) {
                  that.data.remarkinfo[i] = false;
                  that.data.remarkinfoTwo[i] = true;
                  that.setData({
                    remarkinfo: that.data.remarkinfo,
                    remarkinfoTwo: that.data.remarkinfoTwo
                  })
                }
                that.setData({
                  remarkinfo: that.data.remarkinfo
                })
              }
            }
          })
        } else {
          // wx.setStorageSync("baseUrl_to", url);
          wx.navigateTo({
            url: '../login/login',
          })
        }
      }
    })

  },
  replayTwo: function (e) {
    var that = this;
    that.setData({
      aid: e.currentTarget.dataset.aid,
      pid: e.currentTarget.dataset.pid,
      idx: e.currentTarget.dataset.idx
    })
    
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            lang: "zh_CN",
            success: function (res) {
              let userInfo = res.userInfo;
              wx.removeStorageSync("baseUrl_to");
               
              for (var i = 0; i < that.data.list.length; i++) {
                that.data.remarkinfoTwo.push(true);
                that.data.remarkinfo.push(true);
                that.setData({
                  remarkinfo: that.data.remarkinfo,
                  remarkinfoTwo: that.data.remarkinfoTwo
                })
              
                if (e.currentTarget.dataset.idx == [i]) {
                  that.data.remarkinfo[i] = false;
                  that.data.remarkinfoTwo[i] = true;
                  that.setData({
                    remarkinfo: that.data.remarkinfo,
                    remarkinfoTwo: that.data.remarkinfoTwo
                  })
                }
                that.setData({
                  remarkinfo: that.data.remarkinfo
                })
              }
            }
          })
        } else {
          // wx.setStorageSync("baseUrl_to", url);
          wx.navigateTo({
            url: '../login/login',
          })
        }
      }
    })

  },
  // 点击图片进行大图查看
  LookPhoto: function (e) {
    // console.log(e)
    // var index = e.currentTarget.dataset.index;
    // var current = e.currentTarget.dataset.idx[index];
    const developer_file = e.currentTarget.dataset.photurl;
    var src = e.currentTarget.dataset.src
    wx.previewImage({
      current: src,
      urls: developer_file
    })
  },

  // 点击点赞的人
  // TouchZanUser: function(e) {
  //   wx.showModal({
  //     title: e.currentTarget.dataset.name,
  //     showCancel: false
  //   })
  // },

  // 删除朋友圈
  delete: function() {
    wx.showToast({
      title: '删除成功',
    })
  },

  // 点击了点赞评论
  TouchDiscuss: function(e) {
    // this.data.isShow = !this.data.isShow
    // 动画
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear',
      delay: 0,
    })

    if (that.data.isShow == false) {
      that.setData({
        popTop: e.target.offsetTop - (e.detail.y - e.target.offsetTop) / 2,
        popWidth: 0,
        isShow: true
      })

      // 0.3秒后滑动
      setTimeout(function() {
        animation.width(0).opacity(1).step()
        that.setData({
          animation: animation.export(),
        })
      }, 100)
    } else {
      // 0.3秒后滑动
      setTimeout(function() {
        animation.width(120).opacity(1).step()
        that.setData({
          animation: animation.export(),
        })
      }, 100)

      that.setData({
        popTop: e.target.offsetTop - (e.detail.y - e.target.offsetTop) / 2,
        popWidth: 0,
        isShow: false
      })
    }
  },
  //新消息
  toNews:function(){
    var that = this;
    wx.navigateTo({
      url: '../news/news?id='+that.data.id,
    })
  },
  //发圈
  publish:function(e){
    var that = this;
    if (wx.getStorageSync("joinAssion")) {
      wx.showToast({
        title: "您还未关注俱乐部，请先关注这个俱乐部",
        icon: "none",
        duration: 2000,
      })
    }else{
      var channelid = e.currentTarget.dataset.channelid;
      wx.redirectTo({
        url: '/pages/publish/publish?channelid=' + channelid,
      })
    }
    
    // wx.navigateTo({
    //   url: '../publish/publish?',
    // })
  },
})