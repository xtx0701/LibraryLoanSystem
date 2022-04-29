// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
    const { img, title, type, _id, openid,day,checked,name,number } = event;
        db.collection('appointmentBook').add({
            data: {
                img,
                title,
                type,
                _id,
                openid,
                day,
                checked,
                name,
                number
            }
        }).then(res => {
            return res;
        }).catch(err => {
            return err;
        })
}