class LastMayday {
  constructor(res, fileName) {
    this.temp = this.palette(res, fileName)
  }
  palette(res, fileName) {
    var name;
    var image;
    var shengwang;
    var sw_text = "声望";
    var box;
    var nickName;
    var code = "https://tq.wooloo.top/images/qrcode.png";
    var score;
    var time1= "创建日期";
    var time2 = "俱乐部人数";
    var cTime;
    var sqNum;
    // var end = "人";
    var lshd = "历史活动";
    var lshdNum;
    var lscy = "历史参与";
    var tit = "邀请您加入我们的俱乐部"
    // var lsNum = "次";
    var part_num = "";
    if (res.data.data.channel.name.length > 14) {
      name = rres.data.data.channel.name.substr(0, 15) + "..."
    } else {
      name = res.data.data.channel.name
    }
    shengwang = "/images/huo.png";
    
    image = res.data.data.channel.image.split(',')[0]

    score = res.data.data.channel.score;
    cTime = res.data.data.channel.createtime;
    sqNum = res.data.data.channel.user_num;
    lshdNum = res.data.data.channel.a_num;
    part_num = res.data.data.channel. part_num;
    box = "/images/line.png";
    // nickName = wx.getStorageSync("nickName")

    function _textA() {
      return (
        {
          type: 'text',
          text: name,
          css: {
            fontSize: '40rpx',
            left: '45rpx',
            top: '55rpx',
            color: "#000",
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
          url: shengwang,
          css: {
            width: '20rpx',
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
          text: sw_text,
          css: {
            fontSize: '24rpx',
            top: '458rpx',
            left: '85rpx',
            color: "#999",
          },
        }
      )
    }
    function _textE() {
      return (
        {
          type: 'text',
          text: score,
          css: {
            fontSize: '24rpx',
            top: '458rpx',
            left: '150rpx',
            color: "#333",
          },
        }
      )
    }
    function _textF() {
      return (
        {
          type: 'text',
          text: time1,
          css: {
            fontSize: '24rpx',
            top: '508rpx',
            left: '45rpx',
            color: "#999",
          },
        }
      )
    }
    function _textG() {
      return (
        {
          type: 'text',
          text: cTime,
          css: {
            fontSize: '24rpx',
            top: '508rpx',
            left: '150rpx',
            color: "#999",
          },
        }
      )
    }
    //starttime
    function _textH() {
      return (
        {
          type: 'text',
          text: time2,
          css: {
            fontSize: '24rpx',
            top: '508rpx',
            left: '350rpx',
            color: "#999",
          },
        }
      )
    }
    function _textI() {
      return (
        {
          type: 'text',
          text: sqNum+"人",
          css: {
            fontSize: '24rpx',
            top: '508rpx',
            left: '455rpx',
            color: "#999",
          },
        }
      )
    }
    //endtime
    // function _textJ() {
    //   return (
    //     {
    //       type: 'text',
    //       text: end,
    //       css: {
    //         fontSize: '24rpx',
    //         top: '498rpx',
    //         left: '500rpx',
    //         color: "#999",
    //       },
    //     }
    //   )
    // }
    function _textK() {
      return (
        {
          type: 'text',
          text: lshd,
          css: {
            fontSize: '24rpx',
            top: '558rpx',
            left: '45rpx',
            color: "#999",
          },
        }
      )
    }
    //adress_img
    function _textL() {
      return (
        {
          type: 'text',
          text: lshdNum + "次",
          css: {
            fontSize: '24rpx',
            top: '558rpx',
            left: '160rpx',
            color: "#999",
          },
        }
      )
    }
    //adress
    function _textM() {
      return (
        {
          type: 'text',
          text: lscy,
          css: {
            top: '558rpx',
            fontSize: '24rpx',
            left: '350rpx',
            color: "#999",
          },
        }
      )
    }
    function _part_num(){
      return (
        {
          type: 'text',
          text: part_num + "人次",
          css: {
            top: '558rpx',
            fontSize: '24rpx',
            left: '455rpx',
            color: "#999",
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
            top: '648rpx',
            left: '45rpx',
            width: "580rpx",
            height: "1rpx",
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
            fontSize: "30rpx",
            color: "#000",
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
            color: "#999",
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
      borderRadius: "27rpx",
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
        // _textJ(),
        _textK(),
        _textL(),
        _textM(),
        _part_num(),
        _textN(),
        _textO(),
        _textP(),
        _textQ(),
       
      ],
    });
  }
}


function getPosterInfo(cb) {

  wx.request({
    url: 'https://tq.wooloo.top/addons/cms/wxapp.index/channeldetail?token=' + wx.getStorageSync("token"),
    method: 'POST',
    data: {
      id: wx.getStorageSync("billId")
    },
    success: function (res) {
      console.log(res)
     
      let LMD = new LastMayday(res)

      cb && cb(LMD.temp)
    },
  })

}


function drawImg(cb) {
  getPosterInfo(cb)
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

