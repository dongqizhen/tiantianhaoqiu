const app = getApp();
const utils = require('../../utils/util');
var img_url;
var picPaths;
Page({
  data: {
    img_url: [],
    content: '',
    channel_id:"",
    picPaths: [],
    disabled:false
  },
  //token=' + wx.getStorageSync("token")
  onLoad: function (options) {
    console.log(options)
    var that = this;
    that.setData({
      channel_id: options.channelid
    })
  },
  input: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
  //选择图片
  //选择图片
  chooseimage: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9 
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有 
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有 
      success: function (photo) {
        console.log(photo)
        wx.getImageInfo({
          src: photo.tempFilePaths[0],
          success: function (res) {
            var ctx = wx.createCanvasContext('photo_canvas');
            // var ratio = 1;
            var ratio = 2;
            var canvasWidth = res.width
            var canvasHeight = res.height;
            // 保证宽高均在200以内
            while (canvasWidth > 800 || canvasHeight > 800) {
              //比例取整
              canvasWidth = Math.trunc(res.width / ratio)
              canvasHeight = Math.trunc(res.height / ratio)
              ratio++;
            }
            that.setData({
              canvasWidth: canvasWidth,
              canvasHeight: canvasHeight
            })//设置canvas尺寸
            ctx.drawImage(photo.tempFilePaths[0], 0, 0, canvasWidth, canvasHeight)
            ctx.draw(true, setTimeout(function () {
              wx.canvasToTempFilePath({
                canvasId: 'photo_canvas',
                destWidth: canvasWidth,
                destHeight: canvasHeight,
                success: function (res) {
                  console.log(res)
                  var tempFilePaths = res.tempFilePath;
                  that.setData({
                    img_url: that.data.img_url.concat(res.tempFilePath)
                  });
                  var pic = that.data.img_url
                  wx.showLoading({
                    title: '图片上传中',
                  })
                  that.uploadimg({
                    url: app.globalData.publicAdress + 'api/common/alyupload',//这里是你图片上传的接口
                    filePath: [res.tempFilePath],//这里是选取的图片的地址数组  
                  });
                },
                fail: function (error) {
                  console.log(error)
                },

              })

            }, 1000))
            //下载canvas图片

          },
          fail: function (error) {
            console.log(error)
          }
        })


      }
    })
  },
  //多张图片上传
  uploadimg(data) {
    var that = this,
      i = data.i ? data.i : 0,//当前上传的哪张图片
      success = data.success ? data.success : 0,//上传成功的个数
      fail = data.fail ? data.fail : 0;//上传失败的个数
    wx.uploadFile({
      url: data.url,
      filePath: data.filePath[i],
      name: 'file',//这里根据自己的实际情况改
      formData: null,//这里是上传图片时一起上传的数据
      success: (resp) => {
        wx.hideLoading()
        var data = JSON.parse(resp.data);
        that.data.picPaths.push(data.data['file'])
        that.setData({
          picPaths: that.data.picPaths
        })
        img_url = that.data.picPaths;
        if (img_url.length >= 6) {
          that.setData({
            hideAdd: 1
          })
        } else {
          that.setData({
            hideAdd: 0
          })
        }
      },
      fail: (res) => {
        fail++;//图片上传失败，图片上传失败的变量+1

      },
      complete: () => {
        i++;//这个图片执行完上传后，开始上传下一张
        if (i == data.filePath.length) {   //当图片传完时，停止调用          
          // console.log('执行完毕');
          // console.log('成功：' + success + " 失败：" + fail);
        } else {//若图片还没有传完，则继续调用函数
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data);
        }
        // resolve(data)
      }
    });
  },
  delImg: function (e) {
    console.log(e)
    var that = this;
    var nowidx = e.currentTarget.dataset.idx;//当前索引
    var index = e.currentTarget.dataset.src;
    // img_url.splice(nowidx, 1)
    that.data.picPaths.splice(nowidx, 1)
    that.setData({
      img_url: img_url,
      picPaths: that.data.picPaths
    })
    if (that.data.picPaths.length >= 6) {
      that.setData({
        hideAdd: 1
      })
    } else {
      that.setData({
        hideAdd: 0
      })
    }
  },
  // 点击图片进行大图查看
  LookPhoto: function (e) {
    console.log(e)
    var current = e.currentTarget.dataset.idx;
    const developer_file = e.currentTarget.dataset.photurl
    wx.previewImage({
      current: developer_file[current],
      urls: developer_file
    })
  },
  //点击发表
  send:function(){
    var that = this;
    that.setData({
      disabled: true
    })
    utils.sendRequest(app.globalData.publicAdress + 'addons/cms/wxapp.index/pubQuan?token=' + wx.getStorageSync("token"), 'post', { channel_id: that.data.channel_id, content: that.data.content, image: that.data.picPaths.join(",")})
      .then(function (response) {
        if (response.statusCode == 200) {
         
          //成功
          if (response.data.code == 1) {
            // that.onLoad();
            wx.showToast({
              title: response.data.msg,
              icon: "none",
              duration: 2000,
            })

            setTimeout(function () {
              wx.redirectTo({
                url: '/pages/associationDetail/associationDetail?id=' + that.data.channel_id,
              })
            }, 2000)

          } else {
            that.setData({
              disabled:false
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
  },
  //发布按钮事件
  // send: function () {
  //   var that = this;
  //   var user_id = wx.getStorageSync('userid')
  //   wx.showLoading({
  //     title: '上传中',
  //   })
  //   that.img_upload()
  // },
  // //图片上传
  // img_upload: function () {
  //   let that = this;
  //   let img_url = that.data.img_url;
  //   let img_url_ok = [];
  //   //由于图片只能一张一张地上传，所以用循环
  //   for (let i = 0; i < img_url.length; i++) {
  //     wx.uploadFile({
  //       //路径填你上传图片方法的地址
  //       url: 'http://wechat.homedoctor.com/Moments/upload_do',
  //       filePath: img_url[i],
  //       name: 'file',
  //       formData: {
  //         'user': 'test'
  //       },
  //       success: function (res) {
  //         console.log('上传成功');
  //         //把上传成功的图片的地址放入数组中
  //         img_url_ok.push(res.data)
  //         //如果全部传完，则可以将图片路径保存到数据库
  //         if (img_url_ok.length == img_url.length) {
  //           var userid = wx.getStorageSync('userid');
  //           var content = that.data.content;
  //           wx.request({
  //             url: 'http://wechat.homedoctor.com/Moments/adds',
  //             data: {
  //               user_id: userid,
  //               images: img_url_ok,
  //               content: content,
  //             },
  //             success: function (res) {
  //               if (res.data.status == 1) {
  //                 wx.hideLoading()
  //                 wx.showModal({
  //                   title: '提交成功',
  //                   showCancel: false,
  //                   success: function (res) {
  //                     if (res.confirm) {
  //                       wx.navigateTo({
  //                         url: '/pages/my_moments/my_moments',
  //                       })
  //                     }
  //                   }
  //                 })
  //               }
  //             }
  //           })
  //         }
  //       },
  //       fail: function (res) {
  //         console.log('上传失败')
  //       }
  //     })
  //   }
  // }
})