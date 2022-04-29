// logs.js
Page({

  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    info: {},
    nickName: '',
    touxiang: '',
    noLogin: true,
    approve:0
  },

  login: function () {
    wx.getUserProfile({
      desc: '要授权',
      success: res => {
        let user = res.userInfo;
        wx.cloud.callFunction({
          name: "getUserOpenId",
          success: res => {
            wx.setStorage({
              key: "userOpenId",
              data: res.result.openid
            })
          }, fail: err => {
            console.log(err);
          }
        })
        wx.setStorage({
          key: 'userInfo',
          data: user,
          success: res => {
            console.log('成功');
          }
        })
        console.log(res);
        this.setData({
          noLogin: false,
          nickName: user.nickName,
          touxiang: user.avatarUrl
        })
      }
    })
  },

  loginOut: function () {
    this.setData({
      noLogin: true,
      nickName: '',
      touxiang: ''
    })
    wx.removeStorage({
      key: 'userInfo',
    })
    wx.removeStorage({
      key: 'userOpenId',
    })
  },

  loginMethod: function () {
    wx.getStorage({
      key: "userInfo",
      success: res => {
        this
      }, fail: err => {
        wx.showModal({
          title: "请先登陆",
          content: '登陆才能使用该功能',
          success: res => {
            if (res.confirm === true) {
              wx.getUserProfile({
                desc: '登陆',
                success: res => {
                  wx.setStorage({
                    key: "userInfo",
                    data: res.userInfo
                  })
                  this.setData({
                    nickName: res.userInfo.nickName,
                    touxiang: res.userInfo.avatarUrl,
                    noLogin: false
                  })
                }, fail: err => {
                  console.log(err);
                }
              })
            } else if (res.cancel === true) {
              wx.showToast({
                title: '需要登陆才能使用',
              })
            }
          }
        })
      }
    })
  },

  Authentication:function(){
      wx.navigateTo({
        url: '/pages/Useradd/Useradd'
     })
  },



  myborrow: function () {
    wx.getStorage({
      key: "userInfo",
      success: res => {
        wx.navigateTo({
          url: '/pages/myborrow/myborrow?id=1'
        })
      }, fail: err => {
        this.loginMethod()
      }
    })

  },
  mycomment: function () {
    wx.getStorage({
      key: "userInfo",
      success: res => {
        wx.navigateTo({
          url: '/pages/history/history?id=1'
        })
      }, fail: err => {
        this.loginMethod()
      }
    })
  },
  comment: function () {
    wx.getStorage({
      key: "userInfo",
      success: res => {
        wx.navigateTo({
          url: '/pages/comment/comment?id=1'
        })
      }, fail: err => {
        this.loginMethod()
      }
    })
  },
  donation: function () {
    wx.getStorage({
      key: "userInfo",
      success: res => {
        wx.navigateTo({
          url: '/pages/Submit/Submit?id=1'
        })    
      }, fail: err => {
        this.loginMethod()
      }
    })
  },

  zhuyi: function () {
    wx.getStorage({
      key: "userInfo",
      success: res => {
        wx.navigateTo({
          url: '/pages/attention/attention?id=1'
        })
      }, fail: err => {
        this.loginMethod()
      }
    })
  },

  bindGetUserInfo(e) {
    console.log(e.detail.userInfo)
  },

  onShow: function () {
    wx.getStorage({
      key: 'userInfo',
      success: res => {
        console.log(res);
        this.setData({
          nickName: res.data.nickName,
          touxiang: res.data.avatarUrl,
          noLogin: false
        })
      }
    })
   const userStatus=function(){
     return new Promise((resolve,reject)=>{
       wx.cloud.callFunction({
         name:'getUserOpenId',
         success:res=>{
           resolve(res.result.openid);
         }
       })
     })
   }

   userStatus().then(value=>{
     wx.cloud.database().collection('User').where({
       _openid:value
     }).get().then(value=>{
       console.log(value.data[0].state);
       if(value.data.length==0){
         this.setData({approve:0})
       }else if (!value.data[0].state){
        this.setData({approve:1})
       }else if(value.data[0].state){
        this.setData({approve:2})
       }
     })
   })
  },

  goappointmentBook: function () {
    wx.getStorage({
      key: "userInfo",
      success: res => {
        wx.navigateTo({
          url: '../backbook/backbook',
        })
      }, fail: err => {
        this.loginMethod()
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  }
})



