Component({
  /**
   * 组件的属性列表
   */
  properties: {
    myoff: {
      type: String,
      value:"1"
    },//定义接收参数变量及允许传入参数类型
    //标题文字
    singerContent: {
      type: String,
      value: ''
    },
    singer_list: {
      type: Array,
      value: [{
        key: '',
        name: ''
      },]
    },
    text:{
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow: true,
    choose_type: "1",
  },
  onLoad: function () {
    
    console.log(this.properties.myoff)
    // this.data.choose_type == this.properties.myoff
    // this.data.choose_type = this.properties.myoff
    // this.setData({
    //   choose_type: this.data.choose_type
    // })
    // if (this.properties.myoff == null){
    //   this.properties.myoff ="2"
    // }
    this.properties
  },
  ready:function(){
    // this.data.choose_type = this.properties.myoff
    // this.setData({
    //   choose_type: this.data.choose_type
    // })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    clicktype: function (e) {
      this.setData({
        choose_type: e.currentTarget.dataset.key,
      })
      this.triggerEvent("type",{
        choose_type: e.currentTarget.dataset.key
      })
      
      // console.log(this.data.choose_type)
    },

    //隐藏弹框
    // hideSinger: function () {
    //   this.setData({
    //     isShow: false,
    //     json: {
    //       start: "",
    //       end: "",
    //     }
    //   })
    // },
    //展示弹框
    // showSinger: function () {
    //   this.setData({
    //     isShow: true,
    //   })
    // },
    /*
     * 内部私有方法建议以下划线开头
     * triggerEvent 用于触发事件
     */
    _singerCancel() {
      //触发取消回调
      this.triggerEvent("singerCancel")
    },
    _singerConfirm() {
      //触发成功回调
      this.triggerEvent("singerConfirm", this.data.choose_type);
    }
  }
})