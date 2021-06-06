// pages/main/main.js
const app = getApp()


Page({



    data: {
        // 主窗口的配置
        // animationData: {},


        // 侧边栏的配置
        canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
        show: false,

        // 打卡配置
        is_clock_in: false,
        the_random_word: "NOTI",
        the_random_word_id: "null"
    },





    // 主窗口的配置
    // 注册按钮的点击事件
    Register_Button_Click() {
        var hh = this
        var date_for_mi = app.Get_Now_Date_for_mi()
        if (app.globalData.Register_AllregTime_for_mi[0] == "" || app.globalData.Register_AllregTime_for_mi.length == 0) {
            wx.showToast({
                title: '签到成功',
                icon: 'success',
                duration: 2000
            })
            app.Updata_Register_forn(date_for_mi)
            hh.init_clock_in()
        } else {
            console.log(date_for_mi, parseInt(app.globalData.Register_AllregTime_for_mi[0]))
            if (date_for_mi == parseInt(app.globalData.Register_AllregTime_for_mi[0])) {
                wx.showToast({
                    title: '今天已经签到了',
                    icon: 'none',
                    duration: 2000
                })
            } else {
                wx.showToast({
                    title: '签到成功',
                    icon: 'success',
                    duration: 2000
                })
                app.Updata_Register_forn(date_for_mi)
                hh.init_clock_in()
            }
        }
    },
    // 当签到哪里显示记录信息时候的点击事件
    word_click() {
        var hh = this
        wx.navigateTo({
            url: '../word_info/word_info?_id=' + hh.data.the_random_word_id,
        });
    },
    // 添加按钮的点击事件
    addButtonClick() {
        wx.navigateTo({
            url: '../translate_page/translate_page',
        })
    },
    // 复习按钮的点击事件
    review_button_click() {
        wx.navigateTo({
            url: '../review_word_page/review_word_page',
        })
    },
    // 词库按钮点击事件
    wordHouse_button_click() {
        wx.navigateTo({
            url: '../wordHouse/wordHouse',
        })
    },
    // 查询按钮点击事件
    search_button_click() {
        wx.navigateTo({
            url: '../seach/seach',
        })
    },
    // 调整复习计划按钮的点击事件
    Updata_review_plan_buttonClick() {
        wx.navigateTo({
            url: '../Updata_review_plan_page/Updata_review_plan_page',
        })
    },
    about_button_click() {
        wx.navigateTo({
            url: '../about/about',
        })
    },







    // 侧边栏内容
    // 打开侧边栏按钮点击事件
    Show_popupWin() {
        this.setData({
            show: true
        })
    },
    // 关闭侧边栏函数
    Close_popupWin() {
        this.setData({
            show: false
        });
    },
    // 跳转到日历页面
    To_reg_calendar() {
        wx.navigateTo({
            url: '../reg_calendar/reg_calendar',
        })
    },
    userIntordu_button_click(){
        wx.navigateTo({
            url: '../official_account/official_account',
        })
    },










    init_clock_in() {
        var hh = this
        app.check_clock_in().then(index => {
            console.log("打卡状态",index)
            var review_word_today = app.globalData.all_added_word
            if (review_word_today.length != 0) {
                var random_num = parseInt(review_word_today.length * Math.random())
                if (index == true) {
                    hh.setData({
                        is_clock_in: true,
                        the_random_word: review_word_today[random_num].key,
                        the_random_word_id: review_word_today[random_num]._id
                    })
                } else {
                    hh.setData({
                        is_clock_in: false,
                        the_random_word: "NOTI",
                        the_random_word_id: "null"
                    })
                }
            } else {
                hh.setData({
                    is_clock_in: false,
                    the_random_word: "NOTI",
                    the_random_word_id: "null"
                })
            }

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































    onShow: function () {
        this.init_clock_in()
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

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

})