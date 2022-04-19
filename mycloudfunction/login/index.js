const cloud = require('wx-server-sdk')
cloud.init({
    env: "mayi-watermark-0g87wx951786b6b6"
})
cloud.init()
const db = cloud.database()
//         openid: wxContext.OPENID,
//         appid: wxContext.APPID,
//         unionid: wxContext.UNIONID,
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    console.log(wxContext, 'wxContext')
    try {
        let OPENID = wxContext.OPENID
        // 防止重复存储(查询是否存在)
        let userInfo = await db
            .collection('USERS')
            .where({
                openid: OPENID,
            })
            .get()
        console.log(userInfo)
        if (userInfo.data.length) {
            return {
                ...userInfo.data[0],
                code:200
            }
        } else {
            if (event.nickName) { //如果有昵称便是 授权登录  添加数据
                console.log({...event},'...event')
                const result = await db.collection('USERS').add({
                    data: {
                        ...event,
                        openid: OPENID,
                    },
                })
                let userInfo = await db
                    .collection('USERS')
                    .where({
                        openid: OPENID,
                    })
                    .get()

                return {
                    ...userInfo.data[0],
                    code:200
                }
            } else {
                return {
                    msg: '没有授权',
                    code: 500
                }
            }

        }


    } catch (err) {
        console.log(err)
        return err
    }
}