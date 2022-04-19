// app.js
const plugin = requirePlugin("myPlugin")
App({
    onLaunch() {
        // 展示本地存储能力
        const logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

        wx.cloud.init({
            env: 'mayi-watermark-0g87wx951786b6b6', //填上你的云开发环境id
            traceUser: true,
        })


        //视频插件
        if (plugin.initPlugin) {
            const settings = {
                theme: {
                    primaryColor: "rgba(255,88,76)", // 主题色
                    textColor: "#fff", // 文字色
                    disableColor: "#ddd", // 禁用色
                    backgroundColor: "#000", // 整体背景色
                },
                common: {
                    clipMaxDuration: 60, // 裁切时长的默认限制
                    clipMinDuration: 1, // 裁切时长最短限制
                    chooseMaxDuration: 1000, // 选择视频的默认时长限制
                    imgDisplayDuration: 3, // 单张图片默认展示时间（秒）
                    allMediaNum: 9, // 所有素材数量限制
                    videoMediaNum: 5, // 视频素材数量限制
                },
                // 其他配置项
            }
            plugin.initPlugin(settings) // 手动初始化插件
        }
    },
    globalData: {
        userInfo: null
    }
})