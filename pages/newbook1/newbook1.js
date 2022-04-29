// pages/newbook1/newbook1.js
const db = wx.cloud.database();
Page({
  data: {
    good: {},
    ok: {},
    id: '',
    image: '',
    title: '',
    isF: true,
    ifhassssie: false,
    ifgo: false,
    ifhave: false,
    commentArray: []
  },
  aa: function () {
    this.setData({
      isF: !this.data.isF
    })
  },
  more:function(e){

    wx.navigateTo({
      url: '/pages/preview/preview?id='+e.currentTarget.dataset.id+'&jihe='+e.currentTarget.dataset.type,
    })
  },


  onLoad(opt) {
    var that = this
    var id = opt.id
    var type = opt.type
    wx.showLoading();
    wx.cloud.database().collection(type)
      .doc(id)
      .get()
      .then(res => {
        console.log(res);
        that.setData({
          good: res.data,
          id: id,
          commentArray: res.data.comment
        })
        db.collection('BorrowBook').where({
          title: res.data.title
        }).get().then(value => {
          if (value.data.length == 1) {
            this.setData({
              ifhave: true
            })
            wx.hideLoading()
          } else {
            wx.hideLoading()
          }
        })
        db.collection('MyBorrow').where({
          title: res.data.title
        }).get().then(value => {
          if (value.data.length == 1) {
            this.setData({
              ifgo: true
            })
            wx.hideLoading()
          } else {
            wx.hideLoading()
          }
        })
      })
  },
  // 加入书架
  addbook(e) {
    this.setData({
      ifhave: true
    })
    const addBook = function () {
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

    addBook().then(value => {
      var id1 = e.currentTarget.dataset.id
      const openId = value;
      var title1 = e.currentTarget.dataset.title
      var img1 = e.currentTarget.dataset.img
      var type1 = e.currentTarget.dataset.type
      console.log(type1);
      wx.cloud.database().collection('BorrowBook')
        .add({
          data: {
            _id: id1,
            title: title1,
            img: img1,
            type: type1,
            openid: openId
          }
        })
      wx.showToast({
        title: "添加成功",
        icon: "success",
        durantion: 2000
      })
    })
  },


  delectbook(e) {
    this.setData({
      ifhave: false
    })
    wx.clearStorageSync({
      key: this.data.id
    })
    db.collection('BorrowBook')
      .doc(e.currentTarget.dataset.id)
      .remove()
    wx.showToast({
      title: "取消成功",
      icon: "success",
      durantion: 2000
    })
  },
  
  



  // 立即借阅
  // borrowbook(e) {
  //   var id1 = e.currentTarget.dataset.id
  //   var title1 = e.currentTarget.dataset.title
  //   var img1 = e.currentTarget.dataset.img
  //   var type1 = e.currentTarget.dataset.type
  //   console.log(type1, id1);
  //   wx.cloud.database().collection('MyBorrow')
  //     .add({
  //       data: {
  //         _id: id1,
  //         title: title1,
  //         img: img1,
  //         type: type1
  //       }
  //     })

  //   wx.showLoading();
  //   wx.cloud.callFunction({
  //     name: "deleteBookNumber",
  //     data: {
  //       grade_type: type1,
  //       book_id: id1
  //     },
  //     success: res => {
  //       console.log('成功', res);
  //       wx.cloud.database().collection(type1)
  //         .doc(id1)
  //         .get()
  //         .then(res => {
  //           console.log(res);
  //           this.setData({
  //             good: res.data,
  //             ifgo: true
  //           })
  //           wx.hideLoading();
  //           wx.showToast({
  //             title: "借阅成功",
  //             icon: "success",
  //             durantion: 2000
  //           })
  //         })
  //     },
  //     fail: err => {
  //       console.log('失败', err);
  //     }
  //   })
  // },

  // havebook: function () {
  //   wx.navigateTo({
  //     url: '../myborrow/myborrow',
  //   })
  // }

})