// pages/newbook/newbook.js
Page({
    data:{
        list:{}
    },
    onLoad(){
        wx.cloud.database().collection('kcsj_Education').get()
            .then(res =>{
                console.log('ok',res)
                this.setData({
                    list:res.data
                })
            })
            .catch(res =>{
                console.log('no good',res)  
            })
    },
    goDetail:function (e) {
        console.log('ok',e.currentTarget.dataset.jihe)
        wx.navigateTo({
            url: '/pages/newbook1/newbook1?id='+e.currentTarget.dataset.id+'&type='+e.currentTarget.dataset.type,
        })
    }

})