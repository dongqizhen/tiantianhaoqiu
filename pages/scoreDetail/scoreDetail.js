// pages/scoreDetail/scoreDetail.js
const app = getApp()
const utils = require('../../utils/util')
var Dtime = require('../../utils/dateUtil.js');
var timelist=[]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab:0,
    months:'',
    // date:'2020-06',
    years:'',
    // nextmonth:'07',
    roomList:'',
    faildata:'',
    playTime:'',
    datems:'',
    // showModel1:true,
    // showModel2: true,
    deviceList: [],
    deviceLoading: false,
    deviceLoadingComplete: false,
    pageNum: 1,
    callbackCount: 5,
    isdeviceList: true,
    timelist:[],
    userid: wx.getStorageSync('userId'),
    isIphoneX: false,
    titleArray:[
      '斯诺克147','中式107','斯诺克75','中⼋','九球','追分','抢兔⼦'
    ],
    index:0,
    isShowLoading:false,
    dateIndex:0,
    date:[
      '2020','2019','2018'
    ]
  },
  //点击切换
  clickTab: function (e) {
    console.log(e)
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
        months:e.target.dataset.ids
      })
    }
    var nextmonth =Number(e.target.dataset.ids)+1;
      if (Number(e.target.dataset.ids)==12){
        nextmonth='01'
      }
      that.setData({
        nextmonth:nextmonth,
        deviceList:[],
        pageNum: 1
      })
      that.onPullDownRefresh();
      //that.singList()
      that.monthsChange()
  },
  //切换选择玩法
  bindPickerChange(e){
    console.log(e)
    if(e.detail.value <= 2){
      this.setData({
        index: e.detail.value,
        pageNum: 1,
        deviceLoading: true, 
        deviceLoadingComplete: false
      })
      this.singList()
    }
    
  },
  bindDatePickerChange(e){
    this.setData({
      dateIndex: e.detail.value,
      years:this.data.date[e.detail.value]
    })
    this.singList()
  },
  //跳转对局明细
  palyDetail:function(e){
    console.log(e)
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/playDetail/playDetail?id=' + id,
    })
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
    if (hours<10){
      hours = '0' + hours
    }
    if (minutes < 10) {
      minutes = '0' + minutes
    }
    if (seconds<10){
      seconds = '0' + seconds
    }
    var dayStr = days == 0 ? "" : days + "天";
    var hoursStr = hours == 0 ? "00:" : hours + ":";
    var minutesStr = minutes == 0 ? "00:" : minutes + ":";

    var time = dayStr + hoursStr + minutesStr+seconds;
    return time;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    // wx.startPullDownRefresh()
    console.log(wx.getStorageSync('userId'))
    var that = this;
    this.setData({
      CustomBar: app.globalData.CustomBar,
      StatusBar:app.globalData.navTop,
      userid:wx.getStorageSync('userId')
    })
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);

    this.setData({
      index:options.index
    })
    
    // var pages = getCurrentPages();//获取页面栈
    // if (pages.length > 1) {
    //   //上一个页面实例对象
    //   var prePage = pages[pages.length - 2];
    //   //调用上一个页面的onShow方法
    //   prePage.onShow()
    // }
    //获取年份  
    var Ys =date.getFullYear();
    //获取月份  
    var Ms = (date.getMonth() + 1 < 10 ? '' + (date.getMonth() + 1) : date.getMonth() + 1);
    var len = Ms;
    var arr = [];
    for (var i = len; i > 0; i-- ) {
      if (i < 10) {
        i = i;
      }  else {
        i = i;
      }
        arr.push(i); 
      }
       //console.log(arr)
      var nextmonth =Number(Ms)+1;
      if (Number(Ms)==12){
        nextmonth='01'
      }
      
      let yearArr=[];
      for(let i=0;i<=5;i++){
        yearArr.push(Ys-i)
      }

      this.setData({
        date:yearArr
      })

      that.setData({
        years:Ys,
        monthlist:arr,
        months:Ms,
        nextmonth:nextmonth
      })
      // wx.showToast({
      //   title: '加载中...',
      //   mask: true,
      //   icon: 'loading'
      // })
      that.singList()
      that.setData({
        "isIphoneX": this.isIphoneX(),
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
  
  //对局列表
  singList(){
    var that=this;

    console.log("this.userid:::", this.data.userid)

    //如果请求的是第一页数据，将原来的数据清空
    if (that.data.pageNum == 1){
      this.setData({
        deviceList: []
      })
    }
    
    wx.showLoading({
      title: '加载中...',
    })

    let pageNum = that.data.pageNum, //第几页
      callbackCount = that.data.callbackCount; //返回数据个数
      console.log(that.data.months)
      let newY,endDate;
      if(that.data.months == 12){
        newY = that.data.years+1
        endDate = newY + `-01-01` 
      }else{
        endDate = that.data.years + '-' + that.data.nextmonth + '-01'
      }

    utils.sendRequest(app.globalData.publicAdress + 'api/myRoom', 'get', { "userid": wx.getStorageSync('userId'), 'start_date': that.data.years + '-' + that.data.months + '-01', 'end_date': endDate, 'take': callbackCount, 'page': pageNum,type:(this.data.index==1?4:this.data.index==2?3:'')})
      .then(function (response) {
        console.log(response)
        that.setData({
          roomList:response.data,
          // userid: that.data.userid
        })
        timelist=[]
        for(var i=0;i<response.data.length;i++){
          var times=response.data[i].start_at
          var str1 = times.indexOf(' ')
          var joinstr = times.substring(str1 + 1)//取空格后的字符
          var times2 = response.data[i].start_at
          times2 = times2.substring(8, 10);
          var stopTime = response.data[i].stop_at;
          var startTime = response.data[i].start_at;
          if (response.data[i].userinfo_b==null){
            var formdata = {
              'type': response.data[i].type,
              'kilocalorie': response.data[i].kilocalorie,
              'id': response.data[i].id,
              'stoptime': response.data[i].stop_at,
              'days': times2,
              'starttime': joinstr,
              'playtime': that.shijiancha(startTime,stopTime),
              'onemax': response.data[i].get_levels.one_max_score,
              'score': response.data[i].get_levels.score,
              'win_level': response.data[i].get_levels.win_level,
              'all_level': response.data[i].get_levels.all_level,
              // 'nicknameB': response.data[i].userinfo_b.nickname,
              // 'avatarB': response.data[i].userinfo_b.avatar,
              'nicknameA': response.data[i].userinfo_a.nickname,
              'avatarA': response.data[i].userinfo_a.avatar,
              'ida': response.data[i].userinfo_a.id,
              // 'idb': response.data[i].userinfo_b.id,
            }
            
          }else{
            var formdata = {
              'type': response.data[i].type,
              'kilocalorie': response.data[i].kilocalorie,
              'id': response.data[i].id,
              'stoptime': response.data[i].stop_at,
              'days': times2,
              'starttime': joinstr,
              'playtime': that.shijiancha(startTime,stopTime),
              'onemax': response.data[i].get_levels.one_max_score,
              'score': response.data[i].get_levels.score,
              'win_level': parseInt(response.data[i].get_levels.win_level),
              'all_level': parseInt(response.data[i].get_levels.all_level),
              'nicknameA': response.data[i].userinfo_a.nickname,
              'avatarA': response.data[i].userinfo_a.avatar,
              'ida': response.data[i].userinfo_a.id,
              'idb': response.data[i].userinfo_b.id,
              'nicknameB': response.data[i].userinfo_b.nickname,
              'avatarB': response.data[i].userinfo_b.avatar,
            }
            // if (response.data[i].userinfo_a.id== wx.getStorageSync('userId')) {
            //   console.log(222, 'a')
            //   that.setData({
            //     showModel1: true,
            //     showModel2: false
            //   })
            // } else{
            //   console.log(111, 'b')
            //   that.setData({
            //     showModel1: false,
            //     showModel2: true
            //   })
            // }
            // if (response.data[i].userinfo_b.id== wx.getStorageSync('userId')) {
            //   that.setData({
            //     showModel1: false,
            //     showModel2: true
            //   })
            // }else{
            //   that.setData({
            //     showModel1: true,
            //     showModel2: false
            //   })
            // }
            // } else {
            //   that.setData({
            //     showModel1: true,
            //     showModel2: true
            //   })
            // }
          }
          
          timelist.push(formdata)
        }
        console.log(timelist)
        if (that.data.pageNum == 1) {
          wx.stopPullDownRefresh();//下拉刷新收起来
        }
        // that.data.isdeviceList ? timelist = response.data : timelist = that.data.deviceList.concat(response.data);
        if (response.data.length < that.data.callbackCount) {
          that.setData({
            deviceLoading: false,
            deviceLoadingComplete:true
          });
        }
        that.setData({
          deviceList: that.data.deviceList.concat(timelist),
        })
        
      }).finally(()=>{
        
          wx.hideLoading({
            complete:()=>{}
          })
        
      })
  },

  //选择日期
  // bindDateChange: function (e) {
  //   var that=this;
  //   var datas = e.detail.value
  //   var str = datas.indexOf('-')
  //   var months = datas.substring(str + 1) //取-后的字符
  //   var nextmonth =Number(months)+1;
  //   var year = datas.substring(0, str) 
  //   if (Number(months)==12){
  //     nextmonth='01'
  //   }
  //   console.log(year)
  //   this.setData({
  //     date: e.detail.value,
  //     months: months,
  //     year: year,
  //     nextmonth: nextmonth
  //   })
  //   that.singList();
  //   that.monthsChange();
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //选择日期转英文
  monthsChange(){
    var that = this;
    if (that.data.months == '1') {
      that.setData({
        datems: 'Jan'
      })
    } else if (that.data.months == '2') {
      that.setData({
        datems: 'Feb'
      })
    } else if (that.data.months == '3') {
      that.setData({
        datems: 'Mar'
      })
    } else if (that.data.months == '4') {
      that.setData({
        datems: 'Apr'
      })
    } else if (that.data.months == '5') {
      that.setData({
        datems: 'May'
      })
    } else if (that.data.months == '6') {
      that.setData({
        datems: 'Jun'
      })
    } else if (that.data.months == '7') {
      that.setData({
        datems: 'Jul'
      })
    } else if (that.data.months == '8') {
      that.setData({
        datems: 'Ang'
      })
    } else if (that.data.months == '9') {
      that.setData({
        datems: 'Sep'
      })
    } else if (that.data.months == '10') {
      that.setData({
        datems: 'Oct'
      })
    } else if (that.data.months == '11') {
      that.setData({
        datems: 'Nov'
      })
    } else if (that.data.months == '12') {
      that.setData({
        datems: 'Dec'
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.monthsChange()
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
    // console.log("下拉刷新")
    this.setData({
      pageNum: 1,
      deviceList: [],
      deviceLoading: true, //"上拉加载"的变量，默认false，隐藏  
      deviceLoadingComplete: false //“没有数据”的变量，默认false，隐藏  
    })
    this.singList();
  },

  /**
   * 页面上拉触底事件的处理函数(原来的代码，压根就没有触发上拉加载)
   */
  onReachBottom: function () {
    // console.log(111111111111)
    // let that = this;
    // if (!that.data.deviceLoadingComplete) {
    //   var currentPageNo = that.data.pageNum;
    //   that.setData({
    //     pageNum: currentPageNo + 1,
    //   })
      // that.singList();
    // }
  },

  scrollToLower: function (e) {
    console.log(111111111111, this.data.deviceLoadingComplete)
    let that = this;
    if (!that.data.deviceLoadingComplete) {
      var currentPageNo = that.data.pageNum;
      that.setData({
        pageNum: currentPageNo + 1,
      })
      console.log(that.data.deviceList)

      that.singList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})