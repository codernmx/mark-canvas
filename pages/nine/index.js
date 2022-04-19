// pages/compressImage/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentValue: 50,
        size: '0M', //压缩之后的图片大小
        resPath: null, //压缩之后的路径
        width: null,
        height: null,
        fileList: [],
        screenWidth: null,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.getSystemInfo({ //获取屏幕宽度
            success: (res) => {
                this.setData({
                    screenWidth: res.screenWidth
                })
            }
        })

    },
    onChange(event) {
        this.setData({
            currentValue: event.detail
        })
        if (this.data.src) {
            this.changeImg()
        }
    },
    handleShow() {
        const _this = this
        const src = this.data.src
        const width = this.data.width
        const height = this.data.height
        const screenWidth = this.data.screenWidth
        let file = []
        let config = {
            0: {
                w: 0,
                h: 0,
            },
            1: {
                w: width / 3,
                h: 0,
            },
            2: {
                w: 2 * width / 3,
                h: 0,
            },
            3: {
                w: 0,
                h: height / 3,
            },
            4: {
                w: width / 3,
                h: height / 3,
            },
            5: {
                w: 2 * width / 3,
                h: height / 3,
            },
            6: {
                w: 0,
                h: 2 * height / 3,
            },
            7: {
                w: width / 3,
                h: height * 2 / 3,
            },
            8: {
                w: 2 * width / 3,
                h: 2 * height / 3,
            },
        }
        for (let i = 0; i < 9; i++) {
            let ctx = wx.createCanvasContext(`c${i}`)
            // console.log(config[i]['w'], config[i]['h'], width / 3, height / 3)
            ctx.scale(screenWidth / width, screenWidth / height)
            // console.log(300 / width / 3, 300 / height / 3, 's')
            ctx.drawImage(src, config[i]['w'], config[i]['h'], width / 3, height / 3, 0, 0, width / 3, height / 3)
            ctx.draw(false, function () {
                wx.canvasToTempFilePath({
                    canvasId: `c${i}`,
                    fileType: 'png',
                    quality: 1,
                    success: (res1) => {
                        console.log(res1)
                        file.push(res1.tempFilePath)
                        // that.setData({
                        //     src: res1.tempFilePath
                        // })
                        // that.uploadimg(res.tempFilePath); //上传图片，加了水印的图片
                    },
                    fail: (e) => {
                        console.log(e)
                    }
                })
            })
        }

        _this.setData({
            fileList: file
        })
    },
    save() {
        if (this.data.fileList.length > 0) {
            this.data.fileList.forEach(v => {
                wx.saveImageToPhotosAlbum({
                    filePath: v,
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
            });
        } else {
            wx.showToast({
                title: '请先上传图片',
                icon: 'none'
            })
        }
    },
    chooseImg() {
        let _this = this
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                console.log(res)
                // tempFilePath可以作为img标签的src属性显示图片
                const tempFilePaths = res.tempFilePaths[0]
                _this.setData({
                    src: tempFilePaths
                })
                wx.getImageInfo({ //得到图片信息
                    src: tempFilePaths,
                    success(res) {
                        console.log(res, '压缩之前')
                        _this.setData({
                            width: res.width,
                            height: res.height,
                        })
                        _this.handleShow()
                    }
                })

                // _this.changeImg()

            }
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})