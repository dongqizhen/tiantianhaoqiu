// pages/playDetail/playDetail.js
const app = getApp()
const utils = require('../../utils/util')
var time = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    ids: '',
    detailArr: '',
    showModel1: true,
    showModel2: true,
    botInfo: '',
    playlog: '',
    balla: '',
    ballb: '',
    balls: '',
    nums: '',
    height: '196',
    roominfo:'',
    isIphoneX: false,
  },
  //时间差
  shijiancha: function (faultDate, completeTime) {
    var stime = new Date(faultDate.replace(/-/g, "/")).getTime();
    var etime = new Date(completeTime.replace(/-/g, "/")).getTime();
    var usedTime = etime - stime; //两个时间戳相差的毫秒数
    var days = Math.floor(usedTime / (24 * 3600 * 1000));
    //计算出小时数
    var leave1 = usedTime % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000));
    //计算相差分钟数
    var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000));
    //计算相差秒数
    var leave3=leave2%(60*1000);     //计算分钟数后剩余的毫秒数
    var seconds=Math.round(leave3/1000);
    if (hours < 10) {
      hours = '0' + hours
    }
    if (minutes < 10) {
      minutes = '0' + minutes
    }
    if (seconds < 10) {
      seconds = '0' + seconds
    }
    var dayStr = days == 0 ? "" : days + "天";
    var hoursStr = hours == 0 ? "00:" : hours + ":";
    var minutesStr = minutes == 0 ? "00:" : minutes + ":";

    var time = dayStr + hoursStr + minutesStr + seconds;
    return time;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      ids: options.id,
      "isIphoneX": this.isIphoneX(),
    })
    utils.sendRequest(app.globalData.publicAdress + 'api/myRoomLevelInfo', 'get', { "levelid": that.data.ids, "userid": wx.getStorageSync('userId'), 'room_id': wx.getStorageSync('Groomids') })
      .then(function (response) {
        console.log(response)
        if (response.statusCode == 200) {
          that.setData({
            roominfo:response.data.room
          })
          //对局信息
          var botInfo = [];
          var balla = [];
          var ballb = [];
          var balls = [];
          for (var i = 0; i < response.data.level.length; i++) {
            var playsdone = response.data.level[i].plays_done;
            response.data.level[i].height = 196
            response.data.level[i].my_score = parseInt(response.data.level[i].my_score)
            response.data.level[i].rival_score = parseInt(response.data.level[i].rival_score)
            if (playsdone) {
              for (var pi = 0; pi < playsdone.length; pi++) {
                if (playsdone[pi].player == response.data.level[i].userinfo_a.id) {
                  playsdone[pi].player = response.data.level[i].userinfo_a.avatar
                } else if (playsdone[pi].player == response.data.level[i].userinfo_b.id) {
                  playsdone[pi].player = response.data.level[i].userinfo_b.avatar
                }
                for (var ii = 0; ii < playsdone[pi].plays.length; ii++) {
                  
                  if (playsdone[pi].plays[ii].ball == 1) {
                    playsdone[pi].plays[ii].ball = 'red'
                  } else if (playsdone[pi].plays[ii].ball == 2) {
                    playsdone[pi].plays[ii].ball = 'org'
                  } else if (playsdone[pi].plays[ii].ball == 3) {
                    playsdone[pi].plays[ii].ball = 'green'
                  } else if (playsdone[pi].plays[ii].ball == 4) {
                    playsdone[pi].plays[ii].ball = 'brown'
                  } else if (playsdone[pi].plays[ii].ball == 5) {
                    playsdone[pi].plays[ii].ball = 'blue'
                  } else if (playsdone[pi].plays[ii].ball == 6) {
                    playsdone[pi].plays[ii].ball = 'pink'
                  } else if (playsdone[pi].plays[ii].ball == 7) {
                    playsdone[pi].plays[ii].ball = 'black'
                  }
                  var playdata = {
                    'playinfo': playsdone[pi].plays[ii]
                  }
                  balls.push(playdata)
                }  
                
                that.setData({
                  balls: balls,
                })
              }
              console.log(that.data.balls)
            }
            response.data.level[i].playtime=that.shijiancha(response.data.level[i].create_at, response.data.level[i].stop_at)
          }

          
          // botInfo.push(datas)
          that.setData({
            botInfo: response.data.level
          })
          console.log(that.data.botInfo)
        }
      }, function (error) {
        console.log(error);
      })
  },
  isIphoneX() {
    let mobile = wx.getSystemInfoSync();
    if (mobile.model.indexOf("iPhone X") >= 0) {
      return true;
    } else {
      return false;
    }
  },
  toChange(e) {
    var that = this;
    let index = e.currentTarget.dataset.index
    let currect = "botInfo[" + index + "].height";
    console.log(currect)
    if (that.data.botInfo[index].height == 196) {
      that.setData({
        [currect]: ''
      })
    } else {
      that.setData({
        [currect]: '196'
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