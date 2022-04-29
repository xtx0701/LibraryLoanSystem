Page({
       data:{
          list:[],
          book:[],
          leftCur: 0,
          book1:[]
         
       },


    onLoad(){
        
        wx.cloud.database().collection('test').get()
        .then(res =>{
            this.setData({
                list:res.data
            })
        })
        .catch(res =>{
            console.log('no good',res)  
        })
        wx.cloud.database().collection('kcsj_ChineseLiterature').get()
        .then(res =>{
            this.setData({
                book:res.data
            })
        })
        .catch(res =>{
            console.log('no good',res)  
        })


    },
    bookgo:function (e) {
        console.log('书的数据库',e.currentTarget.dataset.type)
        console.log(e)
        let index = e.target.dataset.index;
        console.log(index)
        this.setData({
            leftCur: index,
		})
	
        var type = 'kcsj_'+e.currentTarget.dataset.type
        console.log(type)
        wx.cloud.database().collection(type).get()
        .then(res =>{
           
            this.setData({
                book:res.data, 
                
            })

        })
        .catch(res =>{
            
        })
        if(wx.pageScrollTo){
			wx.pageScrollTo({
			  scrollTop:0,
			  duration:100
			})
		}
           
    },
    bookmove:function (a) {
        console.log(a.currentTarget)
        wx.navigateTo({
            url: '/pages/newbook1/newbook1?id='+a.currentTarget.dataset.id+'&type='+a.currentTarget.dataset.type,
          })
        
    }



    

})