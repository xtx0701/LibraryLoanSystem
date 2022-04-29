// pages/backbook/backbook.js
const db = wx.cloud.database();
Page({

        /**
         * 页面的初始数据
         */
        data: {
                list: {},
                bookNum: 100
        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {

        },

        /**
         * 生命周期函数--监听页面初次渲染完成
         */
        onReady: function () {

        },

        /**
         * 生命周期函数--监听页面显示
         */
        onShow: function () {
                const getappointmentBook = function () {
                        return new Promise((resolve, reject) => {
                                wx.cloud.callFunction({
                                        name: "getUserOpenId",
                                        success: res => {
                                                resolve(res.result.openid);
                                        }
                                })
                        })
                }
                getappointmentBook().then(value => {
                        db.collection('appointmentBook').where({
                                openid: value
                        }).get().then(value => {
                                
                                function time_format(time) {
                                        // 判断时间戳是否为13位数，如果不是则*1000，时间戳只有13位数(带毫秒)和10(不带毫秒)位数的
                                        if (time.toString().length == 13) {
                                                var tme = new Date(time);
                                        } else {
                                                var tme = new Date(time * 1000);
                                        }
                                        var Y = tme.getFullYear();
                                        var M = (tme.getMonth() + 1 < 10 ? '0' + (tme.getMonth() + 1) : tme.getMonth() + 1);
                                        var D = tme.getDate();
                                        var h = tme.getHours();
                                        var m = tme.getMinutes();
                                        var s = tme.getSeconds();
                                        var tem1 = Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s
                                        return tem1;
                                }
                                const message = value.data.map((vObj) => {
                                        vObj.day = time_format(vObj.day);
                                        return vObj;
                                })
                                this.setData({
                                        list: message,
                                        bookNum: value.data.length
                                        
                                })
                                console.log(this.data.list)
                        })
                })
        },

        /**
         * 生命周期函数--监听页面隐藏
         */
        onHide: function () {

        },

        /**
         * 生命周期函数--监听页面卸载
         */
        onUnload: function () {

        },

        /**
         * 页面相关事件处理函数--监听用户下拉动作
         */
        onPullDownRefresh: function () {

        },

        /**
         * 页面上拉触底事件的处理函数
         */
        onReachBottom: function () {

        },

        /**
         * 用户点击右上角分享
         */
        onShareAppMessage: function () {

        }
})