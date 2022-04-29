// pages/Submit/Submit.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
       
       title:{},
       name:{},
       phone:{},
       imgUrl:{},
       noImage:true,
       selectAllStatus:false   
    },

    titleBlur:function(e) {
        this.setData({
          title: e.detail.value
        })
      },
    
      nameBlur:function(e) {
        this.setData({
          name: e.detail.value
        })
      },


      phoneBlur:function(e) {
        this.setData({
          phone: e.detail.value
        })
      },

      imgBlur:function (e) {
        console.log(123)
        let that = this
        wx.chooseImage({
          count: 1,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success (res) {
            // tempFilePath可以作为img标签的src属性显示图片
            wx.cloud.uploadFile({//上传至微信云存储
              cloudPath:'myImage/' + new Date().getTime() + "_" +  Math.floor(Math.random()*1000) + ".jpg",//使用时间戳加随机数作为上传至云端的图片名称
              filePath:res.tempFilePaths[0],// 本地文件路径
              success: res => {
                // 返回文件 ID
                console.log("上传成功",res.fileID)
                that.setData({
                  //获取上传云端的图片在页面上显示
                  imgUrl: res.fileID,
              noImage:false
                })
                wx.showToast({
                  title: '选择成功',
                })
              }
            })
          }
        })
      },

      send:function (e) {
        var title =e.currentTarget.dataset.title
        var name =e.currentTarget.dataset.name
        var phone = e.currentTarget.dataset.phone
        var img = e.currentTarget.dataset.img
        wx.cloud.database().collection('DonationBook').add({
          data:{
            title:title,
            name:name,
            phone:phone,
            img:img,
          }
        })
        wx.showToast({
          title: "提交成功",
          icon: "success",
          durantion: 2000
        })
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