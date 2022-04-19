const app = getApp()
Page({
    data: {
        isShowWeChat: false,
        userInfo: {},
        isLogin: true,
        canIUseGetUserProfile: false,
    },
    onLoad() {
        // 加载动画
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        wx.cloud.callFunction({
            name: 'login',
        }).then(res => {
            console.log(res)
            // 影藏加载动画
            wx.hideLoading()
            if (res.result.code == 200) {
                this.setData({
                    userInfo: res.result
                })
            } else {
                this.setData({
                    isLogin: false
                })
            }
        })
    },
    //点击登录
    login() {

        wx.getUserProfile({
            desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (info) => {
                wx.showLoading({
                    title: '登录中',
                    mask: true
                })
                console.log(info,'info')
                this.setData({
                    userInfo: info.userInfo,
                    isLogin: true
                })

                wx.cloud.callFunction({
                    name: 'login',
                    data: {
                        ...info.userInfo
                    },
                }).then(res => {
                    // 影藏加载动画
                    wx.hideLoading()
                    console.log(res)
                })
            },
            fail: (err) => {
                // console.log(err)
                app.util.toast('小哥哥，拒绝可不行哦！')
            }
        })
    },
    openHelper() {
        wx.switchTab({
            url: '/pages/index/index',
        })
    },
    openWeather() {
        wx.switchTab({
            url: '/pages/index/index',
        })
    },
    openBusEwm() { // 打开乘坐公交

        if (app.globalData.user) {
            wx.navigateTo({
                url: '/pages/signIn/index',
            })
        } else {
            app.util.toast('请先登录')
        }
    },
    showPopup() {
        this.setData({
            isShowWeChat: true
        });
    },

    onClosePopup() {
        this.setData({
            isShowWeChat: false
        });
    },
    onShareAppMessage: function () {},
    //朋友圈
    onShareTimeline() {},
})