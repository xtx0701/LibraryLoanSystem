// pages/newbook/newbook.js
const db = wx.cloud.database();
Page({
    data: {
        list: {},
        borrowNum: 100, //用于判断无借阅时的展示
        selectAllStatus: false,
        borrowBook: []
    },
    onShow: function () {
        const getMyBorrow = function () {
            return new Promise((resolve, reject) => {
                wx.cloud.callFunction({
                    name: 'getUserOpenId',
                    success: res => {
                        resolve(res.result.openid);
                    },
                    fail: err => {
                        reject(err);
                    }
                })
            })
        }

        getMyBorrow().then(value => {
            wx.cloud.database().collection('MyBorrow').where({
                    _openid: value
                }).get()
                .then(res => {
                    this.setData({
                        list: res.data,
                        borrowNum: res.data.length
                    })
                })
                .catch(res => {
                    console.log('no good', res)
                })
        })
    },
    goDetail: function (e) {
        console.log('ok', e)
        wx.navigateTo({
            url: '/pages/newbook1/newbook1?id=' + e.currentTarget.dataset.id + '&type=' + e.currentTarget.dataset.type,
        })
    },

    selectList(e) {
        console.log(this.data.list);
        var that = this;
        var index = e.currentTarget.dataset.index;
        var list = that.data.list;
        var id = e.currentTarget.dataset.id;
        var type = e.currentTarget.dataset.type;
        let img = e.currentTarget.dataset.img;
        let title = e.currentTarget.dataset.title;
        var borrowBook = this.data.borrowBook;
        that.data.selectAllStatus = true;
        list[index].selected = !list[index].selected;
        for (var i = list.length - 1; i >= 0; i--) {
            if (!list[i].selected) {
                that.data.selectAllStatus = false;
                break;
            }
        }
        that.setData({
            list: list,
            selectAllStatus: that.data.selectAllStatus
        })
        let borrowArray = {};
        wx.getStorage({
            key: "userOpenId",
            success: res => {
                borrowArray._openid = res.data;
            }
        })
        borrowArray._id = id;
        borrowArray.type = type;
        borrowArray.index = index;
        borrowArray.img = img;
        borrowArray.title = title;
        //console.log(borrowArray);
        borrowBook.unshift(borrowArray);
        for (var i = 1; i < borrowBook.length; ++i) {
            for (var j = i; j > 0; j--) {
                if (borrowBook[j - 1].index > borrowBook[j].index) {
                    [borrowBook[j - 1], borrowBook[j]] = [borrowBook[j], borrowBook[j - 1]];
                }
            }
        };
    },

    selectOut(e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        var list = that.data.list;
        var borrowBook = this.data.borrowBook;
        that.data.selectAllStatus = true;
        list[index].selected = !list[index].selected;
        for (var i = list.length - 1; i >= 0; i--) {
            if (!list[i].selected) {
                that.data.selectAllStatus = false;
                break;
            }
        }
        that.setData({
            list: list,
            selectAllStatus: that.data.selectAllStatus
        })
        for (var i = 0; i < borrowBook.length; i++) {
            if (borrowBook[i].index == index) {
                borrowBook.splice(i, 1);
                break;
            }
        }
        console.log(borrowBook);
    },

    selectAll(e) {
        let that = this;
        let selectAllStatus = that.data.selectAllStatus;
        selectAllStatus = !selectAllStatus;
        let list = that.data.list;
        for (let i = 0; i < list.length; i++) {
            list[i].selected = selectAllStatus;
        }
        that.setData({
            selectAllStatus: selectAllStatus,
            list: list,
            borrowBook: that.data.list,
        })
        console.log(that.data.borrowBook)
    },

    appointmentBook: function () {
        const that = this;
        wx.showLoading({
            title: '预约中',
        })
        const borrowBook = that.data.borrowBook;
        const appointmentBook = function () {
            return new Promise((resolve, reject) => {
                wx.cloud.callFunction({
                    name: 'getUserOpenId',
                    success: res => {
                        resolve(res.result.openid);
                    }
                })
            })
        }

        appointmentBook().then(value => {
            wx.cloud.database().collection('User').where({
                _openid: value
            }).get().then(res => {
                const {
                    name,
                    number
                } = res.data[0];
                for (let i = 0; i < borrowBook.length; i++) {
                    console.log(borrowBook[i]._openid);
                    const {
                        img,
                        title,
                        type,
                        _id,
                        _openid
                    } = borrowBook[i]
                    db.collection('MyBorrow').doc(_id).remove().then(value => {})
                    wx.cloud.callFunction({
                        name: "userAppointmentBook",
                        data: {
                            img,
                            title,
                            type,
                            _id,
                            openid: _openid,
                            day: "undefined",
                            checked: "等待管理员确定",
                            name,
                            number
                        },
                        success: res => {
                            console.log(res);
                            wx.cloud.callFunction({
                                name: "addBookNumber",
                                data: {
                                    grade_type: type,
                                    book_id: _id
                                }
                            })
                        },
                        fail: err => {
                            console.log(err);
                        }
                    })
                }
                const getMyBorrow = function () {
                    return new Promise((resolve, reject) => {
                        wx.cloud.callFunction({
                            name: 'getUserOpenId',
                            success: res => {
                                resolve(res.result.openid);
                            },
                            fail: err => {
                                reject(err);
                            }
                        })
                    })
                }

                getMyBorrow().then(value => {
                    wx.cloud.database().collection('MyBorrow').where({
                            _openid: value
                        }).get()
                        .then(res => {
                            wx.showToast({
                                title: '预约成功',
                            })
                            wx.hideLoading();
                            this.setData({
                                selectAllStatus: false,
                                list: res.data,
                                borrowNum: res.data.length
                            })
                        })
                        .catch(res => {
                            console.log('no good', res)
                        })
                })
            })
        })
    }

})