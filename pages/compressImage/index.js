// pages/compressImage/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentValue: 50,
        size: '0M', //压缩之后的图片大小
        resPath: null, //压缩之后的路径
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },
    onChange(event) {
        this.setData({
            currentValue: event.detail
        })
        if (this.data.src) {
            this.changeImg()
        }
    },
    //压缩图片
    changeImg() {
        let _this = this
        wx.compressImage({
            src: this.data.src, // 图片路径
            quality: 100 - this.data.currentValue, // 压缩质量
            success: res => {
                console.log(res, '压缩结果')
                this.setData({
                    resPath: res.tempFilePath
                })
                wx.getFileInfo({ //得到图片信息
                    filePath: res.tempFilePath,
                    success(res) {
                        console.log(res.size)
                        _this.setData({
                            size: (res.size / 1024 / 1024).toFixed(3) + 'M'
                        })
                    }
                })
            }
        })
    },
    save() {
        if (this.data.resPath) {
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
                wx.getFileInfo({ //得到图片信息
                    filePath: tempFilePaths,
                    success(res) {
                        console.log(res, '压缩之前')
                    }
                })

                _this.changeImg()
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