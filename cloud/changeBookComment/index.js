// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
        const {grade_type,book_id,content}=event;
        try {
                return db.collection(grade_type).doc(book_id).update({
                        data: {
                                comment: content
                        }
                }).then(value => {
                        return value;
                }).catch(err => {
                        return err;
                })
        } catch (err) {
                return err;
        }
}