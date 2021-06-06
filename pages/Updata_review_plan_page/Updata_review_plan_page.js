// pages/Updata_review_plan_page/Updata_review_plan_page.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        reviewNum: 1,
        review1: [1,2,3,4,5,6,7,8,9,10],
        stepUp: [1,3,5,10,20,20,30,40,60],
        showItem: [true,false,false,false,false,false,false,false,false,false,],
        the_select_plan: ""
    },
    reviewNum_Change(e){
        var hh = this
        console.log(e.detail)
        this.setData({
            reviewNum: e.detail
        })
        var showarr = hh.data.showItem
        for(var i = 0; i<10;i++){
            if(i<hh.data.reviewNum){
                showarr[i] = true
            }
            else{
                showarr[i] = false
            }
        }
        this.setData({
            showItem: showarr
        })
    },
    onChange(e){
        var hh = this
        var start = e.currentTarget.dataset.index
        var arr = hh.data.review1
        arr[start-1] = e.detail
        hh.setData({
            review1: arr
        })
        for(var i = start;i<10;i++){
            console.log(arr[i])
            arr[i] = arr[i-1]+hh.data.stepUp[i-1]
        }
        hh.setData({
            review1: arr
        })
    },
    Create_New_WordHouse_Button_Click(){
        var hh = this
        for(var i=0;i<10;i++){
            if(hh.data.showItem[i] == false){
                var arr = []
                for(var j=0;j<i;j++){
                    arr.push(hh.data.review1[j])
                }
                console.log(arr.toString())
                hh.setData({
                    the_select_plan: arr.toString()
                })
                break
            }
        }
        hh.Updata_review_plan_click(hh.data.the_select_plan)
    },
    Updata_review_plan_click(the_select_plan) {
        // 调整计划功能已经实现 去掉下面注释就可以了
        if(the_select_plan.length !=0){
            app.Updata_review_plan(the_select_plan)
        }
        wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000
        })
    },



    guide_view_click(){
        wx.navigateTo({
            url: '../Updata_review_plan_page_main/Updata_review_plan_page_main',
        })
    },









    

    // 分享到朋友圈
    onShareTimeline: function () {
        return {
            title: 'E - Noti',
            imageUrl: ''
        }
    },
    // 分享到朋友
    onShareAppMessage: function () {
        return new Promise(resolve => {
            resolve({
                title: ' E - Noti',
                imageUrl: 'cloud://text-miniprogram1-0ew75t8ac9dca2.7465-text-miniprogram1-0ew75t8ac9dca2-1305229226/ima/showimage.png'
            })
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
})