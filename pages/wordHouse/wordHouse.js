// pages/wordHouse/wordHouse.js
const app = getApp()

Page({
    data: {

        //词库scroll-view数据
        wordHouses: ["123", "234", "555"],

        // 词库的图片
        wordHouse_ima: [
            "https://7465-text-miniprogram1-0ew75t8ac9dca2-1305229226.tcb.qcloud.la/ima/wordHouse0.png?sign=e97f752a1c7ae7c0ad1ddd6e64b2f5dc&t=1620449477",
            "https://7465-text-miniprogram1-0ew75t8ac9dca2-1305229226.tcb.qcloud.la/ima/wordHouse1.png?sign=e97f752a1c7ae7c0ad1ddd6e64b2f5dc&t=1620449477",
            "https://7465-text-miniprogram1-0ew75t8ac9dca2-1305229226.tcb.qcloud.la/ima/wordHouse2.png?sign=e97f752a1c7ae7c0ad1ddd6e64b2f5dc&t=1620449477",
            "https://7465-text-miniprogram1-0ew75t8ac9dca2-1305229226.tcb.qcloud.la/ima/wordHouse3.png?sign=e97f752a1c7ae7c0ad1ddd6e64b2f5dc&t=1620449477",
            "https://7465-text-miniprogram1-0ew75t8ac9dca2-1305229226.tcb.qcloud.la/ima/wordHouse4.png?sign=e97f752a1c7ae7c0ad1ddd6e64b2f5dc&t=1620449477",
            "https://7465-text-miniprogram1-0ew75t8ac9dca2-1305229226.tcb.qcloud.la/ima/wordHouse5.png?sign=e97f752a1c7ae7c0ad1ddd6e64b2f5dc&t=1620449477",
            "https://7465-text-miniprogram1-0ew75t8ac9dca2-1305229226.tcb.qcloud.la/ima/wordHouse6.png?sign=e97f752a1c7ae7c0ad1ddd6e64b2f5dc&t=1620449477",
            "https://7465-text-miniprogram1-0ew75t8ac9dca2-1305229226.tcb.qcloud.la/ima/wordHouse7.png?sign=e97f752a1c7ae7c0ad1ddd6e64b2f5dc&t=1620449477",
        ],

        // dialog提示窗口的配置
        dialogShow: false,
        buttons: [{
            text: '否'
        }, {
            text: '是'
        }],

        // sheet框的配置  选择词库控件配置开始
        TheSelectWordHouse: "",
        showActionsheet: false,
        the_WordHouseQuery: [],
        WordHouselist: [],

        // 选择设置sheet的配置
        set_item: [{
            text: "删除词库",
            value: "删除词库"
        }, {
            text: "编辑",
            value: "编辑"
        }],
        show_set_Actionsheet: false,
        wordHouse_name: ""

    },
    onShow: function () {
        this.UpdataPage();
    },
    UpdataPage() {
        this.Get_WordHouse_form_app_WordHouseQuery();
    },




    // 词库商品card列表的配置开始
    Get_WordHouse_form_app_WordHouseQuery() {
        var hh = this
        var the_app_wordhouse = app.globalData.WordHouseQuery
        var New_wordHouse = []
        for (var i = 0; i < the_app_wordhouse.length; i++) {
            var wordHouse_Item = {}
            wordHouse_Item.wordHouses_name = the_app_wordhouse[i]
            wordHouse_Item.wordHouse_image = hh.data.wordHouse_ima[i % hh.data.wordHouse_ima.length]
            wordHouse_Item.wordHouse_length = app.Get_a_wordHouse_length(the_app_wordhouse[i])
            wordHouse_Item.wordHouse_info = app.get_a_wordHouse_the_allinfo(the_app_wordhouse[i]).WordHouseInfo
            New_wordHouse.push(wordHouse_Item)
        }

        this.setData({
            wordHouses: New_wordHouse
        })
        
        console.log(hh.data.wordHouses)
    },
    wordHouseClick(data) {
        wx.navigateTo({
            url: '../Show_wordHouse/Show_wordHouse?id=' + data.currentTarget.dataset.text,
        })
    },
    Add_wordHouseClick() {
        wx.navigateTo({
            url: '../Add_wordHouse/Add_wordHouse?page=新建词库',
        })
    },
    // 词库商品card列表的配置结束







    //选择词库控件配置开始
    showActionsheet() {
        this.setData({
            showActionsheet: true
        })
    },
    close_WordHouse_Sheet: function () {
        this.setData({
            showActionsheet: false
        })
    },
    wordHouse_SheetClick(e) {
        console.log(e.detail.value)
        var hh = this
        this.setData({
            TheSelectWordHouse: e.detail.value
        })
        this.close_WordHouse_Sheet()
        console.log('选择词库sheet点击', hh.data.wordHouse_name, e.detail.value)

        // 更新原来词库单词的所属词库（该函数会自动更新全局的单词）
        app.updata_more_word_wordHouse(hh.data.wordHouse_name, e.detail.value)
        // 删除词库该词库（该函数删除后自动更行全局的词库数组）
        app.delete_a_wordHouse(hh.data.wordHouse_name)
        // 删除数据库对应的词库信息
        app.delete_a_wordHouse_info(hh.data.wordHouse_name).then(res=>{
            // 删除后更新全局数据
            if(res == "删除词库信息成功"){
                app.get_all_wordHouse_info()
            }
        })
        // 更新页面数据
        hh.UpdataPage();
    },
    //选择词库控件配置结束




    // dialog提示窗口的配置
    showDialog: function () {
        this.setData({
            dialogShow: true
        })
    },
    closeDialog() {
        this.setData({
            dialogShow: false,
        })
    },
    // 对话框点击事件
    DialogButton_click(e) {
        console.log(e.detail.item.text)
        var hh = this
        hh.closeDialog()
        console.log('对话框点击', e.detail.item.text)
        if (e.detail.item.text == "是") {
            hh.showActionsheet()
        } else if (e.detail.item.text == "否") {
            console.log('删除词库对应的单词', hh.data.wordHouse_name)
            // 删除词库对应的单词（该函数删除后自动更行全局的单词信息）
            app.delete_wordHouse_word(hh.data.wordHouse_name)
            // 删除词库（该函数删除后自动更行全局的词库数组）
            app.delete_a_wordHouse(hh.data.wordHouse_name)
            // 删除词库信息
            app.delete_a_wordHouse_info(hh.data.wordHouse_name).then(res=>{
                // 删除后更新全局数据
                if(res == "删除词库信息成功"){
                    app.get_all_wordHouse_info()
                }
            })
            // 更新页面数据
            hh.UpdataPage();
        }
    },





    // 删除按钮的点击事件
    delete_woedHouse_button_click() {
        var hh = this
        if (hh.data.wordHouse_name != "默认词库") {
            hh.showDialog()
        } else {
            wx.showToast({
                title: '无法删除该词库',
                icon: 'error',
                duration: 2000
            })
        }

    },
    // 设置按钮的点击事件
    wordHouse_moreButton_click(e) {
        console.log(e.currentTarget.dataset.text)
        this.setData({
            wordHouse_name: e.currentTarget.dataset.text
        })
        this.Get_WordHouselist_form_app_WordHouseQuery();
        this.show_set_Actionsheet()

    },




    // 显示设置的sheet
    show_set_Actionsheet() {
        this.setData({
            show_set_Actionsheet: true
        })
    },
    // 关闭设置的sheet
    close_set_Actionsheet() {
        this.setData({
            show_set_Actionsheet: false
        })
    },
    // 设置sheet点击事件
    setting_SheetClick(e) {
        console.log(e.detail.value)
        var hh = this
        var theSelect_set = e.detail.value
        hh.close_set_Actionsheet()
        if (theSelect_set == "删除词库") {
            hh.delete_woedHouse_button_click()
        } else if (theSelect_set == "编辑") {
            if (hh.data.wordHouse_name != "默认词库") {
                var page = "编辑词库"
                wx.navigateTo({
                    url: '../Add_wordHouse/Add_wordHouse?page=' + page + '&wordHouseName=' + hh.data.wordHouse_name,
                })
            } else {
                wx.showToast({
                    title: '无法修改该词库',
                    icon: 'error',
                    duration: 2000
                })
            }
        }
    },
    // 获取词库选择sheet的词库列表
    Get_WordHouselist_form_app_WordHouseQuery() {
        var hh = this
        var the_app_wordhouse = hh.data.wordHouses
        var New_wordHouse = []
        console.log(the_app_wordhouse)
        for (var i = 0; i < the_app_wordhouse.length; i++) {
            if (the_app_wordhouse[i].wordHouses_name != hh.data.wordHouse_name) {
                var wordHouse_Item = {
                    text: the_app_wordhouse[i].wordHouses_name,
                    value: the_app_wordhouse[i].wordHouses_name
                }
                New_wordHouse.push(wordHouse_Item)
            }
        }

        this.setData({
            WordHouselist: New_wordHouse
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