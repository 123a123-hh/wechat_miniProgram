// pages/center/center.js
// 获取应用实例
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        the_new_plan: "",


    },
    Updata_review_plan_click() {
        // 调整计划功能已经实现 去掉下面注释就可以了
        // var hh = this
        // if(the_new_plan.length !=0){
        //     app.Updata_review_plan(hh.data.the_new_plan)
        // }
    },
    plan_inputing(e) {
        console.log(e.detail.value)

    },

    // 跳转到日历页面
    To_reg_calendar() {
        wx.navigateTo({
            url: '../reg_calendar/reg_calendar',
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