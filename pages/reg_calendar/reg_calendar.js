// pages/reg_calendar/reg_calendar.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        Register_AllregTime_for_mi: [],
        Register_id: "12",
        Register_max_reg_num: "-1",
        continue_reg_num: "-1",
        allReg_num: "-1",

        show: true,
        num: [],
        minDate: new Date(2021, 0, 1).getTime(),
        maxDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime(),
    },
    updata_reg_data() {
        var hh = this
        this.setData({
            Register_AllregTime_for_mi: app.globalData.Register_AllregTime_for_mi,
            Register_id: app.globalData.Register_id,
            Register_max_reg_num: app.globalData.Register_max_reg_num,
            continue_reg_num: app.globalData.continue_reg_num,
            allReg_num: app.globalData.allReg_num,
        })

        hh.get_reg_num()
        hh.get_min_max_Date()
    },
    get_reg_num() {
        var hh = this
        var len = hh.data.Register_AllregTime_for_mi.length
        var Mynum = []
        for (var i = 0; i < len; i++) {
            Mynum.push(parseInt(hh.data.Register_AllregTime_for_mi[i]))
        }
        hh.setData({
            num: Mynum
        })
    },
    get_min_max_Date() {
        var hh = this
        if (hh.data.Register_AllregTime_for_mi.length == 0 || hh.data.Register_AllregTime_for_mi[0] == "") {

        } else {
            var len = hh.data.Register_AllregTime_for_mi.length
            console.log(parseInt(hh.data.Register_AllregTime_for_mi[0]))
            console.log(parseInt(hh.data.Register_AllregTime_for_mi[len - 1]))
            this.setData({
                maxDate: parseInt(hh.data.Register_AllregTime_for_mi[0]),
                minDate: parseInt(hh.data.Register_AllregTime_for_mi[len - 1])
            })
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.updata_reg_data()
        wx.setNavigationBarColor({
            frontColor: '#000000',
            backgroundColor: '#ffffff',
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