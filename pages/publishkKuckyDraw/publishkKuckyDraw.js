// pages/publishkKuckyDraw/publishkKuckyDraw.js
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
const app = getApp();
const utils = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: Y + "-" + M + "-" + D,
    time: '请输入具体时间',
    channel_id:"",//社群id
    content:"",//描述
    num:"1",//最大人数
    disabled:false,
    showModel: true,
    isshowModel:false,
    couponList:"",
    toggle:false,
    pubAdress: app.globalData.publicAdress,
    idx:"",
    idx1:"",
    idx2: "",
    idx3: "",
    src1:"",
    src2: "",
    src3: "",
    prize_arr_id:"",//奖品id
    prize_arr:[],
    // hidden:false,
    prize_arrSrc:[],
    clickIndx:"",
    content:"",
    hidden1:false,
    hidden2: false,
    hidden3: false,
    hidden_1: true,
    hidden_2: true,
    hidden_3: true,
    prizeNum1:false,
    prizeNum2: true,
    prizeNum3: true,
    windowHeight:"",
    height:"",
    wheight:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      channel_id: options.channelid,
      windowHeight: wx.getSystemInfoSync().windowHeight
    })
    that.couponList();
    that.lastPrize()
    
    
  },
  //lastPrize最后一次社群发布的抽奖活动
  lastPrize:function(){
    var that = this;
    utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.index/lastPrize?token=' + wx.getStorageSync("token"), 'post', { channel_id: that.data.channel_id})
      .then(function (response) {
        if (response.statusCode == 200) {
          //成功
          if (response.data.code == 1) {
            that.setData({
              content: response.data.data.content,
              // date: response.data.data.date,
              // time: response.data.data.time,
              num: response.data.data.num,
            })
            for (var i = 0; i < response.data.data.prize.length;i++){
              //idx1
              if (response.data.data.prize.length == 1){
                that.setData({
                  src1: that.data.pubAdress + response.data.data.prize[0].imgurl,
                  idx1: response.data.data.prize[0].cid
                })
              }  
              if (response.data.data.prize.length == 2) {
                that.setData({
                  src1: that.data.pubAdress + response.data.data.prize[0].imgurl,
                  src2: that.data.pubAdress + response.data.data.prize[1].imgurl,
                  idx1: response.data.data.prize[0].cid,
                  idx2: response.data.data.prize[1].cid,
                })
            }
              if (response.data.data.prize.length == 3) {
                that.setData({
                  src1: that.data.pubAdress + response.data.data.prize[0].imgurl,
                  src2: that.data.pubAdress + response.data.data.prize[1].imgurl,
                  src3: that.data.pubAdress + response.data.data.prize[2].imgurl,
                  idx1: response.data.data.prize[0].cid,
                  idx2: response.data.data.prize[1].cid,
                  idx3: response.data.data.prize[2].cid
                })
              }
            }
            if (that.data.num == 1) {
              that.setData({
                prizeNum1: false,
                prizeNum2: true,
                prizeNum3: true,
                src2: "",
                idx2: "",
                src3: "",
                idx3: "",
                hidden_2: true,
                hidden2: false,
              })
            } else if (that.data.num == 2) {
              that.setData({
                prizeNum1: false,
                prizeNum2: false,
                prizeNum3: true,
                src3: "",
                idx3: "",
                hidden_3: true,
                hidden3: false
              })
            } else if (that.data.num == 0) {
              that.setData({
                prizeNum1: false,
                prizeNum2: true,
                prizeNum3: true,
                src2: "",
                idx2: "",
                src3: "",
                idx3: "",
                hidden_2: true,
                hidden_3: true,
                hidden2: false,
                hidden3: false
              })
            } else {
              that.setData({
                prizeNum1: false,
                prizeNum2: false,
                prizeNum3: false,
                // src2: "",
                // idx2: "",
                // src3: "",
                // idx3: "",
                // hidden_2: true,
                // hidden_3: true,
                // hidden2: false,
                // hidden3: false
              })
            }
            if (that.data.src1 != "") {
              that.setData({
                hidden_1: false,
                hidden1: true
              })
            } else{
              that.setData({
                hidden_1: true,
                hidden1: false
              })
            }
            if (that.data.src2 != ""){
              that.setData({
                hidden_2: false,
                hidden2: true
              })
            } else{
              that.setData({
                hidden_2: true,
                hidden2: false
              })
            }
            if (that.data.src3 != "") {
              that.setData({
                hidden_3: false,
                hidden3: true
              })
            }else{
              that.setData({
                hidden_3: true,
                hidden3: false
              })
            }
          }
        }
      }, function (error) {
        console.log(error);
      })
  },
  close: function () {
    var that = this;
    that.setData({
      showModel: true,
      idx:"",
      isshowModel:false
    })
    if (that.data.src1 != "") {
      that.setData({
        hidden_1: false,
        hidden1: true
      })
    } else {
      that.setData({
        hidden_1: true,
        hidden1: false
      })
    }
    if (that.data.src2 != "") {
      that.setData({
        hidden_2: false,
        hidden2: true
      })
    } else {
      that.setData({
        hidden_2: true,
        hidden2: false
      })
    }
    if (that.data.src3 != "") {
      that.setData({
        hidden_3: false,
        hidden3: true
      })
    } else {
      that.setData({
        hidden_3: true,
        hidden3: false
      })
    }
  },
  growthValue: function (e) {
    this.setData({
      showModel: false,
      isshowModel:true
    })
    if (e.currentTarget.dataset.idx == 1){
      this.setData({
        clickIndx:1
      })
    } else if (e.currentTarget.dataset.idx == 2){
      this.setData({
        clickIndx:2
      })
    } else if (e.currentTarget.dataset.idx == 3){
      this.setData({
        clickIndx:3
      })
    }
    
  },
  //getContent
  getContent:function(e){
    var that = this;
    that.setData({
      content:e.detail.value
    })
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  getNum:function(e){
    var that = this;
    that.setData({
      num:e.detail.value
    })
    if (that.data.num == 1){
      that.setData({
        prizeNum1: false,
        prizeNum2: true,
        prizeNum3: true,
        src2: "",
        idx2: "",
        src3: "",
        idx3: "",
        hidden_2: true,
        hidden2: false,
        hidden_3: true,
        hidden3: false
      })
    } else if (that.data.num ==2){
      that.setData({
        prizeNum1: false,
        prizeNum2: false,
        prizeNum3: true,
        src3: "",
        idx3: "",
        hidden_3: true,
        hidden3: false
      })
    }
    else{
      that.setData({
        prizeNum1: false,
        prizeNum2: false,
        prizeNum3: false
      })
      
    }
    // else if (that.data.num == 0){
    //   that.setData({
    //     prizeNum1: false,
    //     prizeNum2: true,
    //     prizeNum3: true,
    //     src2: "",
    //     idx2: "",
    //     src3: "",
    //     idx3: "",
    //     hidden_2: true,
    //     hidden_3: true,
    //     hidden2: false,
    //     hidden3: false
    //   })
    // }else{
    //   that.setData({
    //     prizeNum1: false,
    //     prizeNum2: false,
    //     prizeNum3: false,
    //     src2: that.data.src2,
    //     idx2: that.data.idx2,
    //     src3: that.data.src3,
    //     idx3: that.data.idx3,
    //     // hidden_2: true,
    //     // hidden_3: true,
    //     // hidden2: false,
    //     // hidden3: false
    //   })
    // }
  },
  //优惠券列表
  couponList:function(){
    var that = this;
    utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.coupon/couponList', 'post')
      .then(function (response) {
        if (response.statusCode == 200) {
          //成功
          if (response.data.code == 1) {
            that.setData({
              couponList: response.data.data
            })
          }
        }
      }, function (error) {
        console.log(error);
      })
  },
  //点击优惠券的列表的关闭
  closeImg:function(e){
    var that = this;
    if (e.currentTarget.dataset.index == 1){
      that.setData({
        src1:"",
        idx1:"",
        hidden_1: true,
        hidden1: false
      })
    } else if (e.currentTarget.dataset.index == 2) {
      that.setData({
        src2: "",
        idx2: "",
        hidden_2: true,
        hidden2: false
      })
    } else if (e.currentTarget.dataset.index ==3 ) {
      that.setData({
        src3: "",
        idx3: "",
        hidden_3: true,
        hidden3: false
      })
    }
  },
  //点击优惠券选项
  clickCoupon:function(e){
    // console.log(e)
    var that = this;
    let id = e.currentTarget.dataset.id;
    var src = e.currentTarget.dataset.src;
        
    if (that.data.clickIndx == 1){
      that.setData({
        idx1: id,
        src1: src,
        idx:id
      })
    } else if (that.data.clickIndx == 2){
      that.setData({
        idx2: id,
        src2: src,
        idx: id
      })
    } else if (that.data.clickIndx == 3) {
      that.setData({
        idx3: id,
        src3: src,
        idx: id
      })
    }
    // console.log(that.data.idx1 + ",,,,," + that.data.idx2 + ",,,," + that.data.idx3 )
    //var index = e.currentTarget.dataset.index;
    //var item = that.data.prize_arr[index];
    // var id = e.currentTarget.dataset.id;
    // var src = e.currentTarget.dataset.src;
    // item.isSelect = !item.isSelect;
    // that.setData({
    //   prize_arr: that.data.prize_arr,
    // })
    // if (item.isSelect){
    //   that.data.prize_arr_id.push(id);
    //   that.data.prize_arrSrc.push(src);
    //   console.log(that.data.prize_arrSrc)
    // } else{
    //   for (var i = 0; i < that.data.prize_arr_id.length;i++){
    //     if (id == that.data.prize_arr_id[i]){
    //       that.data.prize_arr_id.splice(i, 1);
    //         // that.data.prize_arrSrc.splice()
    //     }
    //   }
    // }
    // if (that.data.prize_arr_id.length < 1) {
    //   that.data.prize_arr_id = []  
    // }
    // console.log(that.data.prize_arr_id)
    
  },
  sure_btn:function(){
    var that = this;
    that.setData({
      showModel: true,
      isshowModel:false,
      idx:""
    })
    if (that.data.src1 != "") {
      that.setData({
        hidden_1: false,
        hidden1: true
      })
    } else {
      that.setData({
        hidden_1: true,
        hidden1: false
      })
    }
    if (that.data.src2 != "") {
      that.setData({
        hidden_2: false,
        hidden2: true
      })
    } else {
      that.setData({
        hidden_2: true,
        hidden2: false
      })
    }
    if (that.data.src3 != "") {
      that.setData({
        hidden_3: false,
        hidden3: true
      })
    } else {
      that.setData({
        hidden_3: true,
        hidden3: false
      })
    }
  },
  formSubmit: function (e) {
    var that = this;
    if (that.data.time =="请输入具体时间"){
      wx.showToast({
        title: '请输入具体时间',
        icon: 'none',
        duration: 1000
      })
    } else if (that.data.num == "" || that.data.num == 0){
      wx.showToast({
        title: "请输入抽奖人数",
        icon: "none",
        duration: 2000,
      })
    } else if (that.data.idx3 == "" && that.data.idx2 == "" && that.data.idx1==""){
      wx.showToast({
        title: "请至少选择一项奖品",
        icon: "none",
        duration: 2000,
      })
    } else if (that.data.idx1 == "" && (that.data.idx2 != "" || that.data.idx3 != '')){
      wx.showToast({
        title: "请设置一等奖",
        icon: "none",
        duration: 2000,
      }) 
    } else if (that.data.idx2 == "" && that.data.idx3 != ""){
      wx.showToast({
        title: "请设置二等奖",
        icon: "none",
        duration: 2000,
      })
    }else{
      // that.setData({
      //   disabled: true
      // })
      if (that.data.idx3 == ""){
        that.data.prize_arr_id= that.data.idx1+","+that.data.idx2
      }else if (that.data.idx2 == ""){
        that.data.prize_arr_id = that.data.idx1+","+that.data.idx3
      }else if (that.data.idx1 == "") {
        that.data.prize_arr_id = that.data.idx2+","+that.data.idx3
      }else{
        that.data.prize_arr_id = that.data.idx1+","+that.data.idx2 + "," + that.data.idx3
      }
      // console.log(that.data.prize_arr_id+"....."+that.data.idx1 + "..." + that.data.idx2 + "..." + that.data.idx3)
      utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.index/pubPrize?token=' + wx.getStorageSync("token"), 'post', { channel_id: that.data.channel_id, content: that.data.content, endtime: that.data.date + " " + that.data.time, num: that.data.num, prize_arr_id: that.data.prize_arr_id })
        .then(function (response) {
          if (response.statusCode == 200) {
            //成功
            if (response.data.code == 1) {
              wx.showToast({
                title: response.data.msg,
                icon: "none",
                duration: 2000,
              })
// pages/kuckyDrawDetail/kuckyDrawDetail.js
              //
              setTimeout(function () {
                wx.redirectTo({
                  url: '/pages/kuckyDrawDetail/kuckyDrawDetail?id=' + response.data.data,
                })
              }, 2000)

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
    
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that= this;
    var query = wx.createSelectorQuery();
    //选择id
    query.select('.every').boundingClientRect(function (rect) {
      that.setData({
        height: rect.width + 'px'
      })
    }).exec();
    that.setData({
      wheight: that.data.windowHeight - that.data.height
    })
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