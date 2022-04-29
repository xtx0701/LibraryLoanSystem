// pages/Useradd/Useradd.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        name:{},
        number:{}
    },
    
    nameBlur:function(e) {
        this.setData({
          name: e.detail.value
        })
      },

    numberBlur:function(e) {
        this.setData({
          number: e.detail.value
        })
      },

      send:function (e) {
       
        var name =e.currentTarget.dataset.name
        var number = e.currentTarget.dataset.number
        
        wx.cloud.database().collection('User').add({
          data:{
            name:name,
            number:number,
            state:false
          }
        }).then(value=>{
            console.log('成功')
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