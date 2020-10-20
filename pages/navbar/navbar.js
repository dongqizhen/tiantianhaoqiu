const app = getApp();
Component({
  /**
   * 组件的一些选项
   */
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  /**
   * 组件的对外属性
   */
  properties: {
    bgColor: {
      type: String,
      default: ''
    },
    isCustom: {
      type: [Boolean, String],
      default: false
    },
    isBack: {
      type: [Boolean, String],
      default: false
    },
    bgImage: {
      type: String,
      default: ''
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    // StatusBar: app.globalData.StatusBar,
    // CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom
  },
  ready() {
    this.setData({
      CustomBar: app.globalData.CustomBar,
      StatusBar:app.globalData.navTop
    })
    var that = this;
    let menuBtn = wx.getMenuButtonBoundingClientRect();
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        // if ((res.model).indexOf('iPhone X') != -1) {
        //   that.setData({
        //     CustomBar: '88',
        //     StatusBar: '34'
        //   })
        // } else if ((res.model).indexOf('iPhone XR') != -1) {
        //   that.setData({
        //     CustomBar: '88',
        //     StatusBar: '34'
        //   })
        // } else if ((res.model).indexOf('iPhone 11') != -1) {
        //   that.setData({
        //     CustomBar: '88',
        //     StatusBar: '36'
        //   })
        // } else if ((res.model).indexOf('iPhone') != -1) {
        //   that.setData({
        //     CustomBar: '64',
        //     StatusBar: '20'
        //   })
        // } else {
        //   that.setData({
        //     CustomBar: '64',
        //     StatusBar: '20'
        //   })
        // }
      },
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    BackPage() {
      wx.navigateBack({
        delta: 1
      });
    },
    toHome() {
      wx.reLaunch({
        url: '/pages/motion/motion',
      })
    }
  }
})