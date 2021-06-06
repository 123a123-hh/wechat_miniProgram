// pages/Add_wordHouse/Add_wordHouse.js
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {

        // 输入需要创建词库的名字input的配置
        wordHouse_Input_Text: "",

        //创建词库按钮的配置
        app_wordHouse: [],

        // 编辑词库的配置
        the_selected_wordHouse_name: null,

        // 提示的设置
        // 表示输入的内容是否存在非法字符
        button_disable: true,
        warn_tip: false,
        tip_text: "",
        // 词库介绍信息输入框配置
        wordHouse_introdu_Input_Text: "",
        introdu_warn_tip: false,
        introdu_tip_text: "",


        // 不同用于的配置  例如创建词库和更改词库名称
        button_text: "按钮",
        button_click_funtion_name: "null",

        // 标识该页面是 编辑页面 还是 添加词库页面
        page_status: ""

    },
    onLoad: function (options) {
        console.log('添加词库页面成功打开', options)
        this.setData({
            page_status: options.page
        })
        this.check_the_page(options)
    },
    onShow: function () {
        this.UpdataPage();
    },
    UpdataPage() {
        this.Get_WordHouse_form_app_WordHouseQuery();
    },







    // 输入需要创建词库的名字input的配置开始
    wordHouse_Input_ing(e) {
        var hh = this
        console.log(hh.data.wordHouse_Input_Text)
        if (hh.data.wordHouse_Input_Text.length != 0) {
            if (app.check_sta_name(hh.data.wordHouse_Input_Text) == false) {
                hh.setData({
                    button_disable: true,
                    warn_tip: true,
                    tip_text: "只能由字母汉字数字组成"
                })
            } else {
                if (hh.check_Is_Repeated_NewWordHouse_in_appWordHouse(hh.data.wordHouse_Input_Text) == "不存在重复的词库名") {
                    hh.setData({
                        button_disable: false,
                        warn_tip: false
                    })
                } else {
                    if (hh.data.page_status == "编辑词库") {
                        if (hh.data.the_selected_wordHouse_name == hh.data.wordHouse_Input_Text) {
                            hh.setData({
                                button_disable: false,
                                warn_tip: false
                            })
                        }
                    } else if (hh.data.page_status == "新建词库") {
                        hh.setData({
                            button_disable: true,
                            warn_tip: true,
                            tip_text: "该词库已存在"
                        })
                    }

                }
            }
        } else {
            hh.setData({
                button_disable: true,
                warn_tip: true,
                tip_text: "请输入名称"
            })
        }

    },
    wordHouse_introdu_Input_ing() {
        var hh = this
        console.log(hh.data.wordHouse_introdu_Input_Text)
        if (hh.data.wordHouse_introdu_Input_Text.length != 0) {
            if (app.check_sta_name(hh.data.wordHouse_introdu_Input_Text) == false) {
                hh.setData({
                    button_disable: true,
                    introdu_warn_tip: true,
                    introdu_tip_text: "只能由字母汉字数字组成"
                })
            } else {
                hh.setData({
                    button_disable: false,
                    introdu_warn_tip: false
                })
            }
        }
    },
    // 输入需要创建词库的名字input的配置结束









    // 创建词库按钮的配置开始
    Get_WordHouse_form_app_WordHouseQuery() {
        console.log(this.data.app_wordHouse)
        this.setData({
            app_wordHouse: app.globalData.WordHouseQuery,
        })
    },
    check_Is_Repeated_NewWordHouse_in_appWordHouse(the_New_WordHouse_Name) {
        var hh = this
        console.log(hh.data.app_wordHouse)
        for (var i = 0; i < hh.data.app_wordHouse.length; i++) {
            if (the_New_WordHouse_Name == hh.data.app_wordHouse[i]) {
                return "存在重复的词库名"
            }
        }
        return "不存在重复的词库名"
    },
    Create_New_WordHouse_Button_Click() {
        var hh = this;
        // 该函数会更新全局的数据
        app.Add_New_WordHouse(hh.data.wordHouse_Input_Text).then(res => {
            if (res == "添加词库成功") {
                hh.Get_WordHouse_form_app_WordHouseQuery()
            }
        })
        // 添加完词库以后 添加词库信息
        app.add_New_WordHouse_introdu_info(hh.data.wordHouse_Input_Text, hh.data.wordHouse_introdu_Input_Text).then(res => {
            if (res != "更新词库信息失败") {
                // 更新全局的数据
                app.get_all_wordHouse_info()
            }
        })

        wx.showToast({
            icon: 'success',
            title: '新增词库成功'
        })

        // 添加完函数以后立刻 提示输入名称
        hh.setData({
            button_disable: true,
            warn_tip: true,
            tip_text: "请输入名称",
            wordHouse_Input_Text: "",
            wordHouse_introdu_Input_Text: ""
        })
    },
    // 创建词库按钮的配置结束




    // 杂项函数
    check_the_page(op) {
        var hh = this
        if (op.page == "新建词库") {
            hh.setData({
                button_text: "创建",
                button_click_funtion_name: "Create_New_WordHouse_Button_Click"
            })
        } else if (op.page == "编辑词库") {
            hh.setData({
                button_text: "确认",
                button_click_funtion_name: "updata_wordHouse_name_funtion",
                the_selected_wordHouse_name: op.wordHouseName,
                wordHouse_introdu_Input_Text: op.wordHouse_info,
                wordHouse_Input_Text: op.wordHouseName,
            })
        }
    },





    // 更改词库名称的配置
    updata_wordHouse_name_funtion() {
        var hh = this;
        // 该函数自动更新全局数据
        app.updata_more_word_wordHouse(hh.data.the_selected_wordHouse_name, hh.data.wordHouse_Input_Text)
        app.delete_a_wordHouse(hh.data.the_selected_wordHouse_name).then(function (index) {
            if (index == "删除词库成功") {
                // 该函数自动更新全局数据
                app.Add_New_WordHouse(hh.data.wordHouse_Input_Text).then(function (index2) {
                    if (index2 == "添加词库成功") {
                        // 前面的更新词库和单词表以后需要更新 词库信息表
                        app.updata_a_wordHouse_info(hh.data.the_selected_wordHouse_name, hh.data.wordHouse_Input_Text, hh.data.wordHouse_introdu_Input_Text).then(res => {
                            if (res == "更新词库信息成功") {
                                // 更新词库信息表以后 需要更新全局数据
                                app.get_all_wordHouse_info()

                                hh.Get_WordHouse_form_app_WordHouseQuery()
                                wx.showToast({
                                    icon: 'success',
                                    title: '保存成功'
                                })

                                // 添加完函数以后立刻 提示输入名称 并且重置输入框 重置原词库名词
                                if(hh.data.page_status == "新建词库"){
                                    hh.setData({
                                        the_selected_wordHouse_name: hh.data.wordHouse_Input_Text,
                                        button_disable: true,
                                        warn_tip: true,
                                        tip_text: "请输入名称",
                                        wordHouse_Input_Text: "",
                                        wordHouse_introdu_Input_Text: ""
                                    })
                                }else if(hh.data.page_status == "编辑词库"){
                                    hh.setData({
                                        the_selected_wordHouse_name: hh.data.wordHouse_Input_Text,
                                        button_disable: true,
                                        // warn_tip: true,
                                        // tip_text: "请输入名称",
                                        // wordHouse_Input_Text: "",
                                        // wordHouse_introdu_Input_Text: ""
                                    })
                                }
                            }
                        })

                    }
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