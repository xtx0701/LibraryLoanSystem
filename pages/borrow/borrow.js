var numbers = 1;
var bool = true;
const db = wx.cloud.database();

Page({

  data: {
    good: {},
    new: {},
    hasList: true,
    noBook: true,
    selectAllStatus: false,
    borrowBook: [],
    isLogin: false, //是否登陆
    bookNum: 100
  },
  onLoad() {

  },


  onShow: function () {
    wx.getStorage({
      key: "userInfo",
      success: res => {
        this.getBorrowBook();
      },
      fail: err => {
        wx.showModal({
          title: "请先登陆",
          content: '登陆才能继续查阅借书架',
          success: res => {
            if (res.confirm === true) {
              wx.getUserProfile({
                desc: '登陆',
                success: res => {
                  wx.setStorage({
                    key: "userInfo",
                    data: res.userInfo
                  })
                  this.getBorrowBook();
                },
                fail: err => {
                  console.log(err);
                }
              })
            } else if (res.cancel === true) {
              wx.showToast({
                title: '需要登陆才能查阅借书架',
              })
            }
          }
        })
      }
    })
  },

  getBorrowBook: function () {
    const getBorrowBook = function () {
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
    getBorrowBook().then(value => {
      db.collection('BorrowBook').where({
        _openid: value
      }).get().then(value => {
        this.setData({
          good: value.data,
          selectAllStatus: false,
          bookNum: value.data.length
        })
        console.log(this.data.bookNum);
      })
    })
  },

  gobook: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/newbook1/newbook1?id=' + e.currentTarget.dataset.id + '&type=' + e.currentTarget.dataset.type,
    })
  },
  //icon单选的方法
  selectList(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var list = that.data.good;
    var id = e.currentTarget.dataset.id;
    var type = e.currentTarget.dataset.type;
    var borrowBook = this.data.borrowBook;
    let img = e.currentTarget.dataset.img;
    let title = e.currentTarget.dataset.title;
    that.data.selectAllStatus = true;
    list[index].selected = !list[index].selected;
    for (var i = list.length - 1; i >= 0; i--) {
      if (!list[i].selected) {
        that.data.selectAllStatus = false;
        break;
      }
    }
    that.setData({
      good: list,
      selectAllStatus: that.data.selectAllStatus
    })
    let borrowArray = {};
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
    console.log(this.data.borrowBook);
  },

  //icon反选之后的点击方法
  selectOut(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var list = that.data.good;
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
      good: list,
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
    let list = that.data.good;
    for (let i = 0; i < list.length; i++) {
      list[i].selected = selectAllStatus;
    }
    that.setData({
      selectAllStatus: selectAllStatus,
      good: list,
      borrowBook: that.data.good,
    })
    //console.log(that.data.borrowBook)
  },

  btn_submit_order(e) {
    let that = this;
    console.log(that.data.borrowBook);
    const borrowBook = that.data.borrowBook;
    if (that.data.bookNum === 0) {
      wx.showToast({
        title: '请先添加书本',
        icon: 'error'
      })
    } else {
      const checkStatus = function () {
        return new Promise((resolve, reject) => {
          wx.cloud.callFunction({
            name: 'getUserOpenId',
            success: res => {
              resolve(res.result.openid);
            }
          })
        })
      }

      checkStatus().then(value => {
        return new Promise((resolve, reject) => {
          wx.cloud.database().collection('User').where({
            _openid: value
          }).get().then(value => {
            resolve(value);
          })
        })
      }).then(value => {
        if (value.data.length == 0 || !value.data[0].state) {
          wx.showToast({
            title: '请先进行认证',
            icon: 'error'
          })
          return;
        } else if (value.data[0].state) {
          wx.showLoading({
            title: '借阅中',
          })
          const {name,number}=value.data[0];
          for (let i in borrowBook) {
            const {
              img,
              title,
              _id,
              type
            } = borrowBook[i];
            db.collection('MyBorrow').add({
              data: {
                img,
                title,
                _id,
                name,
                number
              }
            }).then(value => {
              console.log(value);
            })
            wx.cloud.callFunction({
              name: "deleteBookNumber",
              data: {
                grade_type: type,
                book_id: _id
              },
              success: res => {
                console.log(res);
              },
              fail: err => {
                console.log(err);
              }
            })
            db.collection('BorrowBook').doc(_id).remove({
              success: res => {
                console.log('删除成功', res);
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
            wx.cloud.database().collection('BorrowBook').where({
                _openid: value
              }).get()
              .then(res => {
                wx.showToast({
                  title: '借阅成功',
                })
                wx.hideLoading();
                that.setData({
                  selectAllStatus: false,
                  good: res.data,
                  bookNum: res.data.length
                })
              })
              .catch(res => {
                console.log(res);
              })
          })
        }
      })
    }
  },

  delectBook() {
    let that = this;
    var borrowBook = that.data.borrowBook;
    wx.showLoading();
    if (that.data.bookNum === 0) {
      wx.showToast({
        title: '请先添加书本',
        icon: 'error'
      })
    } else {
      for (var i = 0; i < borrowBook.length; i++) {
        let id = borrowBook[i]._id;
        db.collection("BorrowBook").doc(id).remove().then(res => {
          db.collection('BorrowBook').get()
            .then(res => {
              that.setData({
                good: res.data,
                selectAllStatus: false,
                bookNum: res.data.length
              })
              wx.hideLoading({})
            })
        })
      }

    }
  },

  onReady: function () {

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