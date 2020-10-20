// pages/associationDetail/associationDetail.js
const app = getApp()
const utils = require('../../utils/util')
// var myPackage = require('../../miniprogram_npm/cos-wx-sdk-v5/index.js')
// var packageOther = require('../../miniprogram_npm/tim-wx-sdk/index.js')
import DrawImg from '../../palette/card1';

// const userSig = require("../../utils/GenerateTestUserSig")
// import TIM from 'tim-wx-sdk'; // 微信小程序环境请取消本行注释，并注释掉 import TIM from 'tim-js-sdk';
// // import COS from 'cos-js-sdk-v5';
// import COS from 'cos-wx-sdk-v5'; // 微信小程序环境请取消本行注释，并注释掉 import COS from 'cos-js-sdk-v5';
// let options = {
//   SDKAppID: '1400255392', // 接入时需要将0替换为您的即时通信应用的 SDKAppID
//   // SECRETKEY: 'ee7ea34f007f93873e17a4394dc3f5afe7d29e747d0c01b9e14fd917a50a9b29'
// };
// // const _SECRETKEY = 'ee7ea34f007f93873e17a4394dc3f5afe7d29e747d0c01b9e14fd917a50a9b29';
// // 创建 SDK 实例，TIM.create() 方法对于同一个 SDKAppID 只会返回同一份实例
// let tim = TIM.create(options); // SDK 实例通常用 tim 表示
// tim.setLogLevel(1);
// // 注册 COS SDK 插件
// tim.registerPlugin({ 'cos-wx-sdk': COS });//如果聊天发送的是纯文字，这里不需要注册

var showImgData;
var showImgData1;
var fileName = "";
var fileName1 = "";
var interval
var url;//获取当前页面路径ons


Page({

  /**
   * 页面的初始数据
   */
  data: {
    pinDaning:"",
    publicimgUrl: app.globalData.publicimgUrl,
    imgUrls: "",
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    circular: true,
    winWidth: 0,
    winHeight: 0,
    name:"",
    channeldetail:"",
    channel:"",
    cate:"",
    isJoin:"加入俱乐部",
    nowDate:"",//系统当前时间
    quanImg:[],
    showModel: true,
    isZan:"../../images/zan.png",
    is_join:"0",
    noPub:true,
    isKuckyDraw:true,
    lat:"",
    lng:"",
    userid:"",//用户
    isUserID:"",
    group_id:"",//群聊ID
    GroupIdList:"",//用户加入的群
    contnet: [{
      'firstname': '张三',
      'content': '你好漂亮呀！！'
    },
    {
      'firstname': '李四',
      'content': '纳尼！！'
    },
    {
      'firstname': '王五',
      'content': '鬼扯咧'
    },
    {
      'firstname': '王宝',
      'content': '昨晚11点左右，一则郑爽胡彦斌疑似复合的消息刷爆各大论坛，微博在深夜11点热度高达200万直接爆掉，中国意难忘又开始了！！！'
    }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      // name:options.name,
      id:options.id
    })
    url = that.route + "?id=" + options.id
      //社群详情
    that.channeldetail();
    var time = utils.formatTime(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据
    that.setData({
      nowDate: time.replace(/\//g, '-').substring(0,16)
    })
    
      //获取用户加入的群
    // utils.sendRequest(app.globalData.publicAdress + 'api/Im/get_joined_group_list', 'post', { user_id: wx.getStorageSync("userId")})
    //   .then(function (response) {
    //     if (response.statusCode == 200) {
    //       //成功
    //       that.setData({
    //         GroupIdList: response.data.data.GroupIdList
    //       })
    //     }
    //   }, function (error) {
    //     console.log(error);
    //   })
  },
  
  //点击进入群聊
  enteringGroup:function(){
    var that = this;
    // let promise = tim.joinGroup({ groupID: that.data.id, type: TIM.TYPES.GRP_AVCHATROOM });
    // promise.then(function (imResponse) {
    //   switch (imResponse.data.status) {
    //     case TIM.TYPES.JOIN_STATUS_WAIT_APPROVAL:
    //     console.log("似懂非懂是")
    //       break; // 等待管理员同意
    //     case TIM.TYPES.JOIN_STATUS_SUCCESS: // 加群成功
    //       console.log(imResponse.data.group); // 加入的群组资料
    //       break;
    //     default:
    //       break;
    //   }
    // }).catch(function (imError) {
    //   console.warn('joinGroup error:', imError); // 申请加群失败的相关信息
    // });
    for (var i = 0; i < that.data.GroupIdList.length;i++){
      if (that.data.group_id == that.data.GroupIdList[i].GroupId){
        wx.navigateTo({
          url: '/pages/chat/chat?group_id=' + that.data.group_id,
        })
        return;
      } else if (that.data.isUserID == that.data.userid){
        wx.navigateTo({
          url: '/pages/chat/chat?group_id=' + that.data.group_id,
        })
        return;
      } else if (that.data.group_id != that.data.GroupIdList[i].GroupId && that.data.isUserID != that.data.userid){
        //加入群聊
        
        utils.sendRequest(app.globalData.publicAdress + 'api/Im/join_flock', 'post', { GroupId: that.data.group_id, user_id: wx.getStorageSync("userId") })
          .then(function (response) {
            if (response.statusCode == 200) {
              //成功
              wx.navigateTo({
                url: '/pages/chat/chat?group_id=' + that.data.group_id,
              })
              return;
            }
          }, function (error) {
            console.log(error);
          })
      }
    }
    
    
   
  },
  //点击分享    海报
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
  //社群详情
  channeldetail:function(){
    var that = this;
    utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.index/channeldetail?token=' + wx.getStorageSync("token"), 'post',{"id":that.data.id})
      .then(function (response) {
        if (response.statusCode == 200) {
          //成功 //end == 1 未结束   0已结束
          if (response.data.code == 1) {
            wx.setStorageSync("nickname", response.data.data.channel.nickname)
              that.setData({
                channel: response.data.data,
                channeldetail: response.data.data.channel,
                imgUrls: response.data.data.channel.image.split(","),
                cate: response.data.data.channel.cate,
                name: response.data.data.channel.name,
                is_join: response.data.data.is_join,
                userid: response.data.data.channel.user_id,
                group_id: response.data.data.channel.group_id,
                lat: response.data.data.channel.lat,
                lng: response.data.data.channel.lng
                // quanImg: response.data.data.channel.image
              })

            var oldPin = response.data.data.prize;
            var newPin = []
            clearInterval(interval)
             interval = setInterval(function () {
              for (var i = 0; i < oldPin.length; i++) {
                var enddate = oldPin[i].endtime ;
                var nowdate = Date.parse(new Date()) / 1000;
                var second = Number(enddate) - Number(nowdate) ;
                // var second = 1559254131 - nowdate;
                if (second > 0) {
                  // 天数位
                  var day = Math.floor(second / 3600 / 24);
                  var dayStr = day.toString();
                  if (dayStr.length == 1) dayStr = '0' + dayStr;

                  // 小时位
                  var hr = Math.floor((second - day * 3600 * 24) / 3600);
                  var hrStr = hr.toString();
                  if (hrStr.length == 1) hrStr = '0' + hrStr;

                  // 分钟位
                  var min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
                  var minStr = min.toString();
                  if (minStr.length == 1) minStr = '0' + minStr;

                  // 秒位
                  var sec = second - day * 3600 * 24 - hr * 3600 - min * 60;
                  var secStr = sec.toString();
                  if (secStr.length == 1) secStr = '0' + secStr;
                  newPin.push({
                    'old': oldPin[i],
                    'endtime': dayStr + '天' + hrStr + '时' + minStr + '分' + secStr + '秒'
                  })
                } else {
                  newPin.push({
                    'old': oldPin[i],
                    'endtime': '活动已结束'
                  })
                }
              }
              that.setData({
                pinDaning: newPin
              })
              newPin = []
            }.bind(this), 1000, that)
            
            if (response.data.data.is_join == 1){
                that.setData({
                  isJoin:"取消加入"
                })
              wx.removeStorageSync("joinAssion")
            } else if (response.data.data.is_join == 0){
              wx.removeStorageSync("joinAssion")
              wx.setStorageSync("joinAssion", "joinAssion")
              that.setData({
                isJoin: "加入俱乐部"
              })
            }
              //is_join，1=已经关注，0=未关注
            wx.setNavigationBarTitle({
              title: that.data.name
            })
            utils.sendRequest(app.globalData.publicAdress + 'api/user/index?token=' + wx.getStorageSync("token"), 'get')
              .then(function (response) {
                if (response.statusCode == 200) {
                  //成功
                  if (response.data.code == 1) {
                    
                    if (parseInt(response.data.data.userinfo.id) == parseInt(that.data.userid)) {
                      that.setData({
                        noPub: false,
                        isKuckyDraw: false,
                        isuserid: response.data.data.userinfo.id
                      })
                    } else {
                      that.setData({
                        noPub: true,
                        isKuckyDraw: true,
                        isUserID: response.data.data.userinfo.id
                      })
                    }
                  }

                }
              }, function (error) {
                console.log(error);
              })
          }
        }
      }, function (error) {
        console.log(error);
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
  //发布活动
  publishActivity:function(e){
    var that = this;
    //noPub
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            lang: "zh_CN",
            success: function (res) {
              var channelid = e.currentTarget.dataset.channelid;
              wx.redirectTo({
                url: '/pages/createAssociationActivity/createAssociationActivity?channelid=' + channelid,
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
  //发布抽奖
  publishkKuckyDraw:function(e){
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            lang: "zh_CN",
            success: function (res) {
              var channelid = e.currentTarget.dataset.channelid;
              wx.redirectTo({
                url: '/pages/publishkKuckyDraw/publishkKuckyDraw?channelid=' + channelid,
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
  //查看全部
  // lookAll:function(e){
  //   var channelid = e.currentTarget.dataset.channelid;
  //   wx.navigateTo({
  //     url: '/pages/kuckyDrawList/kuckyDrawList?channelid=' + channelid,
  //   })
  // },
  //去抽奖详情
  toDetail: function (e) {
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            lang: "zh_CN",
            success: function (res) {
              var id = e.currentTarget.dataset.id;
              wx.navigateTo({
                url: '/pages/kuckyDrawDetail/kuckyDrawDetail?id=' + id,
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
  //点击发布圈信息
  publish:function(e){
    var that = this;
    if (that.data.isJoin == "加入俱乐部"){
      wx.showToast({
        title: "您还未关注俱乐部，请先关注",
        icon: "none",
        duration: 2000,
      })
    }else{
      // 查看是否授权
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              lang: "zh_CN",
              success: function (res) {
                var channelid = e.currentTarget.dataset.channelid;
                wx.navigateTo({
                  url: '/pages/publish/publish?channelid=' + channelid,
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
    }
   
    
  },
  // 点击图片进行大图查看
  LookPhoto: function (e) {
    const developer_file = e.currentTarget.dataset.photurl;
    var src = e.currentTarget.dataset.src
    wx.previewImage({
      current: src,
      urls: developer_file
    })
  },
  LookBanner: function (e) {
    var current = e.currentTarget.dataset.idx;
    const developer_file = e.currentTarget.dataset.photurl
    wx.previewImage({
      current: developer_file[current],
      urls: developer_file
    })
  },
  //加入社群
  joinCommunity:function(){
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            lang: "zh_CN",
            success: function (res) {
              //token=' + wx.getStorageSync("token")
              that.followchannel("channel", that.data.id)
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
  //关注社群  取消,点赞取消点赞
  followchannel:function(type,id){
    var that = this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            lang: "zh_CN",
            success: function (res) {
              utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.user/followchannel?token=' + wx.getStorageSync("token"), 'post', { "type": type, "aid": id })
                .then(function (response) {
                  if (response.statusCode == 200) {
                    if (response.data.code == 1) {
                      wx.showToast({
                        title: response.data.msg,
                        icon: "none",
                        duration: 2000,
                      })
                      that.channeldetail()
                    } else if (response.data.code == 0){
                      wx.showToast({
                        title: response.data.msg,
                        icon: "none",
                        duration: 2000,
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
  //社群成员 查看全部
  // allAssociationMember:function(){
  //   var that = this;
  //   var channelid = that.data.id;
  //   wx.redirectTo({
  //     url: '/pages/allAssociationMember/allAssociationMember?id=' + channelid,
  //   })
  // },
  //点击社群圈 查看全部
  // quan_lookAll:function(){
  //   var that = this;
  //   var channelid = that.data.id;
  //   wx.redirectTo({
  //     url: '/pages/CircleFriends/CircleFriends?channelid=' + channelid,
  //   })
  // },
  //点击社群圈 查看全部
  // allAssociationActivity:function(){
  //   var that = this;
  //   var channelid = that.data.id;
  //   wx.redirectTo({
  //     url: '/pages/allAssociationActivity/allAssociationActivity?id=' + channelid,
  //   })
  // },
  //去活动详情
  toDetailA: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/activityDetail/activityDetail?id=' + id,
    })
  },
  toNews:function(e){
    var id = e.currentTarget.dataset.channelid;
    wx.navigateTo({
      url: '/pages/news/news?id=' + id,
    })
  },
  //社群圈点赞
  // zanLeft:function(e){
  //   var that = this;
  //   var id = e.currentTarget.dataset.uid;
  //   that.followchannel("quan",id);
  // },
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
    // that.onLoad();
    clearInterval(interval)
    that.channeldetail();
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
  onShareAppMessage: function (res) {
    return {
      title: '天天好球',
      path: '/pages/associationDetail/associationDetail?id='+that.data.id,
    }
  }
})