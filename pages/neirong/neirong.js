// pages/newbook1/newbook1.js
Page({
    data:{
        good:{},
        
    },
    
    onLoad(opt){ 
        console.log('yes',opt.id)
        var id = opt.id 
        wx.cloud.database().collection('BookChildren')
        .doc(id)
        .get()
            .then(res =>{
                console.log('ok',res)
                this.setData({
                    good:res.data
                })
            })
            .catch(res =>{
                console.log('no good',res)  
            })
    },
   
})