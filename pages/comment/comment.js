// pages/comment/comment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    select: false,
    goselect: false,
    grade_name: '∨------请选择------∨',
    book_name: '∨------请选择------∨',
    grade_type: {},
    inputValue: '',
    books: {},
    book_img: {},
    book_id: {},
    grades: {},
    book_comment: []
  },
  /**
 * 图书类型点击事件
 */

  bindShowMsg() {
    this.setData({
      select: !this.data.select,
      goselect: false
    })
  },

  bindShow() {
    this.setData({
      goselect: !this.data.goselect,
      select: false
    })
  },

  mySelect(e) {
    var type = 'kcsj_' + e.currentTarget.dataset.type
    var name = e.currentTarget.dataset.name
    wx.cloud.database().collection(type).get()
      .then(res => {
        this.setData({
          books: res.data,
        })
      })
    this.setData({
      grade_name: name,
      grade_type: type,
      select: false
    })
  },

  bookSelect(e) {
    var name = e.currentTarget.dataset.name
    var id = e.currentTarget.dataset.id
    var img = e.currentTarget.dataset.img
    this.setData({
      book_name: name,
      book_id: id,
      book_img: img,
      goselect: false
    })
  },

  bindKeyInput(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  send(e) {
    const { inputValue, book_name, book_img, grade_type, book_id } = this.data;
    console.log(grade_type, book_id);
    wx.cloud.database().collection('talk').add({
      data: {
        content: inputValue,
        name: book_name,
        img: book_img
      }
    })
    wx.showToast({
      title: "提交成功",
      icon: "success",
      durantion: 2000
    })
    // 添加评论
    const addComments = function () {
      return new Promise((resolve, reject) => {
        wx.showLoading({
          title: '提交中'
        })
        wx.getStorage({
          key: "userInfo",
          success: res => {
            resolve([res.data.nickName, res.data.avatarUrl]);
          }
        })
      })
    }

    addComments().then(value => {
      return new Promise((resolve, reject) => {
        const time = new Date();
        const year = time.getFullYear();
        const month = time.getMonth();
        const day = time.getDate();
        const hour = time.getHours();
        const minute = time.getMinutes();
        const submit = `${year}-${month}-${day} ${hour}.${minute}`;
        value.push(submit);
        resolve(value);
      })
    }).then(value => {
      return new Promise((resolve, reject) => {
        class Content {
          constructor(nickName, avatarUrl, inputValue, submit) {
            this.nickName = nickName,
              this.avatarUrl = avatarUrl,
              this.inputValue = inputValue,
              this.submit = submit
          }
        }
        const content = new Content(value[0], value[1], inputValue, value[2]);
        wx.cloud.database().collection(grade_type).doc(book_id).get().then(value => {
          
          const commentArray = value.data.comment;
          console.log(commentArray);
          commentArray.unshift(content);
          resolve(commentArray);
        })
      })
    }).then(value => {
      console.log(value);
      wx.cloud.callFunction({
        name: "changeBookComment",
        data: {
          grade_type,
          book_id,
          content: value
        }, success: res => {
          console.log(res);
          this.setData({
            grade_name: '∨------请选择------∨',
            book_name: '∨------请选择------∨',
            inputValue:''
          })
          wx.showToast({
            title:"提交成功"
          })
          wx.hideLoading();
        }, fail: err => {
          console.log(err);
        }
      })
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    wx.cloud.database().collection('test').get()
      .then(res => {
        this.setData({
          grades: res.data,

        })
      })
    /**
    * 图书名字
    */



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