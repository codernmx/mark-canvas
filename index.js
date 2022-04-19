module.exports = {
        downloadFile: wx.downloadFile, // 文件下载
        loadFontFace: wx.loadFontFace, // 字体加载
        getFileSystemManager: wx.getFileSystemManager, // 模板功能用文件系统接口实现本地包缓存
        realtimeLogManager: wx.getRealtimeLogManager(), // 错误日志上传
        USER_DATA_PATH: wx.env.USER_DATA_PATH // 文件系统中的用户目录路径 (本地路径)
}