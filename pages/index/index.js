var QQMapWX = require('../../lib/qqmap-wx-jssdk.js');
var qqmapsdk;
const formatTime = require('../../utils/util')
Page({
    data: {
        canvasWidth: 0,
        canvasHeight: 0,
        screenWidth: null, //屏幕宽度
        nowTime: formatTime.formatTime(new Date()),
        isPhoto: true,
        position: 'back', //摄像头朝向
        show: false, //
    },
    onLoad() {
        this.getTime()
        qqmapsdk = new QQMapWX({
            key: '2O2BZ-H36KU-QTYVY-4L2JZ-HSMW5-CVBHQ'
        });
        this.ctx = wx.createCameraContext()
        wx.getSystemInfo({ //获取屏幕宽度
            success: (res) => {
                this.setData({
                    screenWidth: res.screenWidth
                })
            }
        })
        //腾讯位置SDK解析位置
        qqmapsdk.reverseGeocoder({
            location: '', //获取表单传入的位置坐标,不填默认当前位置,示例为string格式
            get_poi: 1, //是否返回周边POI列表：1.返回；0不返回(默认),非必须参数
            poi_options: 'policy=2;radius=3000;page_size=20;page_index=1', //这里需要注意下  他文档 不怎么看得清楚
            success: res => { //成功后的回调
                console.log(res.result);
                this.setData({
                    addressInfo: res.result
                })
            },
            fail: function (error) {
                console.error(error);
            }
        })

    },
    //选择地址之后设置 到页面
    setAddress(e) {
        console.log(e)
        this.setData({
            addressInfo: {
                ...this.data.addressInfo,
                address: e.target.dataset.address
            },
            show: false
        })
    },
    onClickHide() { //关弹窗
        this.setData({
            show: false
        });
    },
    showAddressList() {
        this.setData({
            show: true,
        });
    },
    getTime() { //获取当前时间
        setInterval(() => {
            this.setData({
                // nowTime: new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds()
                nowTime: formatTime.formatTime(new Date())
            })
        }, 10000);
    },
    changePosition() {  //改变摄像头朝向（可以换前置）
        this.data.position == 'back' ? this.setData({
            position: 'front'
        }) : this.setData({
            position: 'back'
        })
    },
    save() { //保存图片
        wx.saveImageToPhotosAlbum({
            filePath: this.data.src,
            success(res) {
                console.log(res)
                wx.showToast({
                    title: '保存成功',
                    icon: 'success',
                    duration: 2000
                })
            },
            fail: err => {
                console.log(err)
                wx.showToast({
                    title: '保存失败',
                    icon: 'error',
                    duration: 2000
                })
            }
        })
    },
    //分享
    share() {
        wx.showShareImageMenu({
            path: this.data.src
        })
    },
    takePhoto() { //拍照
        let that = this
        this.ctx.takePhoto({
            quality: 'high',
            success: (res) => {
                this.setData({
                    src: res.tempImagePath,
                    isPhoto: false,
                })
                wx.getImageInfo({ //获取照片宽高
                    src: res.tempImagePath,
                    success: (ress) => {
                    let ctx = wx.createCanvasContext('firstCanvas')
                    that.setData({
                        canvasHeight: ress.height,
                        canvasWidth: ress.width
                    })
                    //将图片src放到cancas内，宽高为图片大小
                    ctx.drawImage(res.tempImagePath, 0, 0, that.data.screenWidth, 500) //五百和界面相机高度一致
                    ctx.setFontSize(14) //注意：设置文字大小必须放在填充文字之前，否则不生效
                    ctx.setFillStyle('white')
                    ctx.fillText(that.data.addressInfo.address, 20, 480)
                        ctx.setFontSize(30) //注意：设置文字大小必须放在填充文字之前，否则不生效
                        ctx.setFillStyle('white')
                        ctx.fillText(that.data.nowTime, 20, 450)
                        ctx.draw(false, function () {
                            wx.canvasToTempFilePath({
                                canvasId: 'firstCanvas',
                                fileType: 'jpg',
                                quality: 1,
                                success: (res1) => {
                                    console.log(res1)
                                    that.setData({
                                        src: res1.tempFilePath
                                    })
                                },
                                fail: (e) => {
                                    console.log(e)
                                }
                            })
                        })
                    }
                })
            }
        })
    },
    startRecord() {
        this.ctx.startRecord({
            success: (res) => {
                console.log('startRecord')
            }
        })
    },
    stopRecord() {
        this.ctx.stopRecord({
            success: (res) => {
                this.setData({
                    src: res.tempThumbPath,
                    videoSrc: res.tempVideoPath
                })
            }
        })
    },
    back() {
        this.setData({
            src: false,
            isPhoto: true,
        })

    },
    editVideo() {
        console.log(44)
        console.log(this.data.videoSrc)
        wx.openVideoEditor({
            filePath: this.data.videoSrc,
            success: res => {
                console.log(res)
            },
            fail: err => {
                console.log(err)
            }
        })
    },
    error(e) {
        console.log(e.detail)
    }
})