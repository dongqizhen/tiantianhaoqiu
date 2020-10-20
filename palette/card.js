class LastMayday {
  constructor(res, fileName) {
    this.temp = this.palette(res, fileName)
  }
  palette(res, fileName) {
    var name;
    var image;
    var lo1;
    var bm_num;
    var line;
    var num;
    var per;
    var start;
    var starttime;
    var end;
    var endtime;
    var adress_img;
    var adress; 
    var box;
    var nickName;
    var code = "https://tq.wooloo.top/images/qrcode.png"
    var tit = "邀请您加入我们的俱乐部";
    if (res.data.data.page.title.length > 14){
      name = rres.data.data.page.title.substr(0, 15) + "..."
    }else{
      name = res.data.data.page.title
    }
    image = res.data.data.page.image.split(',')[0]
    lo1 = "/images/p1.png";
    bm_num = res.data.data.page.bm_num;
    line = "/";
    num = res.data.data.page.num;
    per = "人";
    starttime = res.data.data.page.starttime;
    start = "开始时间";
    end = "结束时间";
    endtime = res.data.data.page.endtime;
    adress_img = "/images/p2.png";
    if (res.data.data.page.address.length > 22){
      adress = res.data.data.page.address.substr(0, 22) + "..."
    }else{
      adress = res.data.data.page.address;
    }
    box = "/images/line.png";
    // nickName = wx.getStorageSync("nickName")
    function _textA() {
      return (
        {
          type: 'text',
          text: name,
          css: {
            fontSize: '40rpx',
            fontWeight: '800',
            left: '45rpx',
            top: '55rpx',
            color: "#333",
          },
        }
      )
    }
    function _textB() {
      return (
        {
          type: 'image',
          url: image,
          css: {
            width: '573rpx',
            height: '273rpx',
            borderRadius: '27rpx',
            top: '159rpx',
            left: '45rpx'
          },
        }
      )
    }
    function _textC() {
      return (
        {
          type: 'image',
          url: lo1,
          css: {
            width: '22rpx',
            height: '23rpx',
            top: '458rpx',
            left: '45rpx'
          },
        }
      )
    }
    function _textD() {
      return (
        {
          type: 'text',
          text: bm_num,
          css: {
            fontSize: '24rpx',
            top: '458rpx',
            left: '85rpx',
            color: "#333",
          },
        }
      )
    }
    function _textE() {
      return (
        {
          type: 'text',
          text: line,
          css: {
            fontSize: '24rpx',
            top: '458rpx',
            left: '100rpx',
            color: "#333",
          },
        }
      )
    }
    function _textF() {
      return (
        {
          type: 'text',
          text: num,
          css: {
            fontSize: '24rpx',
            top: '458rpx',
            left: '110rpx',
            color: "#333",
          },
        }
      )
    }
    function _textG() {
      return (
        {
          type: 'text',
          text: per,
          css: {
            fontSize: '24rpx',
            top: '458rpx',
            left: '140rpx',
            color: "#333",
          },
        }
      )
    }
    //starttime
    function _textH() {
      return (
        {
          type: 'text',
          text: start,
          css: {
            fontSize: '24rpx',
            top: '508rpx',
            left: '45rpx',
            color: "#333",
          },
        }
      )
    }
    function _textI() {
      return (
        {
          type: 'text',
          text: starttime,
          css: {
            fontSize: '24rpx',
            top: '508rpx',
            left: '155rpx',
            color: "#333",
          },
        }
      )
    }
    //endtime
    function _textJ() {
      return (
        {
          type: 'text',
          text: end,
          css: {
            fontSize: '24rpx',
            top: '548rpx',
            left: '45rpx',
            color: "#333",
          },
        }
      )
    }
    function _textK() {
      return (
        {
          type: 'text',
          text: endtime,
          css: {
            fontSize: '24rpx',
            top: '548rpx',
            left: '155rpx',
            color: "#333",
          },
        }
      )
    }
    //adress_img
    function _textL() {
      return (
        {
          type: 'image',
          url: adress_img,
          css: {
            width: '20rpx',
            height: '23rpx',
            top: '600rpx',
            left: '45rpx'
          },
        }
      )
    }
    //adress
    function _textM() {
      return (
        {
          type: 'text',
          text: adress,
          css: {
            top: '598rpx',
            left: '75rpx',
            color:"#666",
          },
        }
      )
    }
    //box
    function _textN() {
      return (
        {
          type: 'image',
          url: box,
          css: {
            top: '658rpx',
            left: '45rpx',
            width:"580rpx",
            height:"1rpx",
          },
        }
      )
    }
    //nickName
    function _textO() {
      return (
        {
          type: 'text',
          text: wx.getStorageSync("nickname"),
          css: {
            top: '684rpx',
            left: '55rpx',
            fontSize:"30rpx",
            color:"#000",
          },
        }
      )
    }
    //tit
    function _textP() {
      return (
        {
          type: 'text',
          text: tit,
          css: {
            top: '726rpx',
            left: '55rpx',
            color: "#666",
            fontSize: "29rpx",
          },
        }
      )
    }
    function _textQ() {
      return (
        {
          type: 'image',
          url: code,
          css: {
            width: '80rpx',
            height: '80rpx',
            top: '688rpx',
            right: '45rpx'
          },
        }
      )
    }
    return ({
      width: '667rpx',
      height: '805rpx',
      background: '#ffffff',
      borderRadius:"27rpx",
      overflowHidden: 'hidden',
      views: [
        _textA(),
        _textB(),
        _textC(),
        _textD(),
        _textE(),
        _textF(),
        _textG(),
        _textH(),
        _textI(),
        _textJ(),
        _textK(),
        _textL(),
        _textM(),
        _textN(),
        _textO(),
        _textP(),
        _textQ(),
        // _twocode(),
        // _words(),
        // _words2(),
        // _words3(),
      ],
    });
  }
}


function getPosterInfo(cb) {

  wx.request({
    url: 'https://tq.wooloo.top/addons/cms/wxapp.index/pagedetail?token=' + wx.getStorageSync("token"),
    method: 'POST',
    data: {
      id: wx.getStorageSync("billId")
    },
    success: function (res) {
      console.log(res)
      wx.setStorageSync("nickname", res.data.data.page.nickname)
      // name = res.data.data.name
      // position=res.data.data.position
      // company = res.data.data.company
      // mobile = res.data.data.mobile
      // wechat = res.data.data.WeChat
      // adress = res.data.data.site
      // logo=res.data.data.logo
      let LMD = new LastMayday(res)

      cb && cb(LMD.temp)
    },
  })

}


function drawImg(cb) {
  getPosterInfo( cb)
  // var urls;
  // var ctx;
  // var showImgData;
  // var fileName = "";
  // wx.request({
  //   url: 'https://www.mp.wooloo.top/api/user/GetImgCode',
  //   method: 'POST',
  //   data: {
  //     'openid': wx.getStorageSync("openid"),
  //     'scene': '1',
  //     'page': 'pages/Sharing_posters/Sharing_posters',
  //   },
  //   responseType: 'arraybuffer',
  //   success: function (res) {
  //     var that = this
  //     // console.log(res.data)
  //     var imgarray = new Uint8Array(res.data)
  //     urls = wx.arrayBufferToBase64(imgarray)
  //     const fsm = wx.getFileSystemManager();

  //     showImgData = urls

  //     showImgData = showImgData.replace(/\ +/g, ""); //去掉空格方法

  //     showImgData = showImgData.replace(/[\r\n]/g, "");

  //     const buffer = wx.base64ToArrayBuffer(showImgData);

  //     fileName = wx.env.USER_DATA_PATH + '/share_img.png'

  //     fsm.writeFileSync(fileName, buffer, 'binary')

  //     const ctx = wx.createCanvasContext('myPoster')

  //     ctx.drawImage(fileName, 0, 0, 300, 449.5)

  //     ctx.draw()

  //     getPosterInfo(fileName, cb)
  //     console.log(fileName)
  //   }

  // })
}

export default drawImg

/*
import  DrawImg from "./LastMayday.js"

DrawImg(res=>{
  this.setData({
    this.setData({
       template:res
    })
  })
})
 */

