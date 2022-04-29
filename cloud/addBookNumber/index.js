// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db=cloud.database();
const _=db.command;
// 云函数入口函数
exports.main = async (event, context) => {
        const {grade_type,book_id}=event;
        try {
                return db.collection(grade_type).doc(book_id).update({
                        data: {
                                number:_.inc(1)
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