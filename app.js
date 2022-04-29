// app.js
App({

  onLaunch() {
    // 云开发初始化 

    wx.cloud.init({
      env: 'test-7g9g7bce713b7eb7',
      traceUser: true,
    })
  },

  getOpenid() {

    let that = this;

    wx.cloud.callFunction({

      name: 'getOpenid',

      complete: res => {
        

        console.log('openid: ', res.result.openid)

        console.log('appid: ', res.result.appid)

         var openid = res.result.openId;

         that.setData({

         openid: openid

        })

      }

    })

  }


})