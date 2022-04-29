//index.js

Page({
  data: {
    list:{}
  },
  onLoad(){

    wx.cloud.callFunction({
      name:"getUserOpenId",
      success:res=>{
        wx.cloud.database().collection('talk').where({
          _openid:res.result.openid
        }).get()
    .then(res =>{
        this.setData({
            list:res.data
        })
        console.log(res.data)
    })
      }
    })
    
  }
  
  
})