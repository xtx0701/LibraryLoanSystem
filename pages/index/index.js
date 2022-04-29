// index.js
// 获取应用实例


Page({
  data:{
    list:[],
    list2:[],
    list3:[],
    list4:[],
    isSearch:false,
    searchContent:[]
},
closeSearch:function(){
this.setData({
  isSearch:false
})
},

search:function(e){
    console.log(e.detail.value);
    let searchKey = e.detail.value
    let db = wx.cloud.database()
    let _ = db.command
    db.collection('Search')
      .where(_.or([
        {//标题
          title: db.RegExp({
            regexp: searchKey,
            options: 'i', 
          }),
        }
      ])).get()
      .then(res => {
          console.log(res);
          this.setData({
              searchContent:res.data,
              isSearch:true
          })
      })
      .catch(res => {
        console.log('查询失败', res)
      })
},

  onLoad(){
    // 新书1
    wx.cloud.database().collection('kcsj_Biography').get()
        .then(res =>{
           
            this.setData({
                list:res.data
            })
        })
        .catch(res =>{
            console.log('no good',res)  
        })
        // 新书2
        wx.cloud.database().collection('kcsj_Administration').get()
        .then(res =>{
            
            this.setData({
                list2:res.data
            })
        })
        .catch(res =>{
            console.log('no good',res)  
        }) 
        // 文学    
        wx.cloud.database().collection('kcsj_ChineseLiterature').get()
        .then(res =>{
            
            this.setData({
                list3:res.data
            })
        })
        .catch(res =>{
            console.log('no good',res)  
        }) 
        // 教育    
        wx.cloud.database().collection('kcsj_Education').get()
        .then(res =>{
           
            this.setData({
                list4:res.data
            })
        })
        .catch(res =>{
            console.log('no good',res)  
        }) 
},

  morenew:function () {
    wx.navigateTo({
        url: '/pages/kcsj_Biography/kcsj_Biography?id=1'
      })
},
morenew1:function () {
    wx.navigateTo({
        url: '/pages/wenxue/wenxue?id=1'
      })
},
morenew2:function () {
    wx.navigateTo({
        url: '/pages/teach/teach?id=1'
      })
},
bookit :function (e) {
    console.log(e)
    wx.navigateTo({
        url: '/pages/newbook1/newbook1?id='+e.currentTarget.dataset.id+'&type='+e.currentTarget.dataset.type,
      })
},


})

