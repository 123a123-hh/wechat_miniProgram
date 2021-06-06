// pages/review_word_page/review_word_page.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        slideButtons: [],
        review_words: [],

        list_status: false,

        // 页面复习形式的配置
        the_show_word: {},

        // 普通复习形式的配置
        exp: "",
        acc: "",
        exp_status: true,
        acc_status: true,

        // 列表模式的配置
        lang_status: true,
        lang_text: "key",



        // 图片预览配置
        is_have_image: false,
        fileList: [],

        // 设置sheet的配置
        show_set_sheet: false,

        // no_sentence模块
        no_sentence: true,
        word_belongTo: "",
        word_phrase: "",

        // 全局配置
        the_review_plan: "",

        // 没有复习内容的配置
        null_review: false,

        // 当在单词信息页面返回时监测是否是删除了单词再返回  注意删除后重置为空
        delete_item_id: ""
    },


    //---------------------------------------------全局
    onLoad: function (options) {
        // this.slide_init()
        this.get_data_for_app()
        this.review_word_today_init()
        this.To_next_word()
    },
    // 该onshow函数目前只是用于 查看单词详情页面后删除单词 返回的监测更新操作
    onShow: function (e) {
        var hh = this
        if (hh.data.delete_item_id != "") {
            hh.local_init()
            hh.setData({
                delete_item_id: ""
            })
        }
    },
    // 该函数目前只是用于 查看单词详情页面后删除单词 返回的更新操作
    local_init() {
        var hh = this
        for (var i = 0; i < hh.data.review_words.length; i++) {
            if (hh.data.review_words[i]._id == hh.data.delete_item_id) {
                hh.data.review_words.splice(hh.data.review_words.indexOf(hh.data.review_words[i]), 1)
                console.log('删除后重新加载的数组', hh.data.review_words)
                hh.setData({
                    review_words: hh.data.review_words
                })
            }
        }
        if(hh.data.the_show_word._id == hh.data.delete_item_id){
            // this.studyed_this_word()
            if (hh.data.review_words.length <= 1){
                hh.show_null_status()
            }else{
                hh.To_next_word()
                hh.close_null_status()
            }
            
        }
    },
    // 先从全局文件中获取需要的数据
    get_data_for_app() {
        this.setData({
            the_review_plan: app.globalData.review_plan
        })
    },
    // 初始化今天需要背的单词
    review_word_today_init() {
        var hh = this
        var review_word_today = app.Get_review_word_today()
        if (review_word_today.length != 0) {
            this.setData({
                review_words: review_word_today
            })
        } else {
            hh.setData({
                null_review: true
            })
        }
        console.log('今天需要复习的单词数组为', this.data.review_words)
    },
    check_status() {
        var hh = this
        if (hh.data.exp_status == true) {
            hh.setData({
                exp: hh.data.the_show_word.value
            })
        } else {
            hh.setData({
                exp: ""
            })
        }

        if (hh.data.lang_status == true) {
            hh.setData({
                lang_text: "key"
            })
        } else {
            hh.setData({
                lang_text: "value"
            })
        }

        if (hh.data.acc_status == true) {
            hh.setData({
                acc: hh.data.the_show_word.key
            })
        } else {

        }
    },

    //---------------------------------------------全局










    // ======================================设置sheet的配置
    // 设置按钮的点击
    set_buttonImage_click() {
        var hh = this
        hh.show_set_sheet()
    },
    show_set_sheet() {
        this.setData({
            show_set_sheet: true
        })
    },
    close_set_sheet() {
        this.setData({
            show_set_sheet: false
        })
    },
    user_click_overlay() {
        this.close_set_sheet()
    },
    list_status_switch_Click(e) {
        console.log(e.detail)
        var hh = this
        if (e.detail == true) {
            hh.change_to_list_status()
        } else {
            hh.close_list_status()
        }
    },
    exp_switch_Click(e) {
        var hh = this
        if (e.detail == true) {
            hh.setData({
                exp: hh.data.the_show_word.value,
                exp_status: true,
            })
        } else {
            hh.setData({
                exp: "",
                exp_status: false
            })
        }
    },
    account_switch_Click(e) {
        var hh = this
        if (e.detail == true) {
            hh.setData({
                acc: hh.data.the_show_word.key,
                acc_status: true
            })
        } else {
            hh.setData({
                acc: "",
                acc_status: false
            })
        }
    },
    lang_switch_Click(e) {
        var hh = this
        if (e.detail == true) {
            hh.setData({
                lang_text: "key",
                lang_status: true
            })
        } else {
            hh.setData({
                lang_text: "value",
                lang_status: false
            })
        }
    },
    // ======================================设置sheet的配置








    // --------------------------------------------------------列表模式的配置
    // 列表模式中点击单词块跳转页面
    To_word_info(e) {
        console.log(e)
        console.log(e.currentTarget.dataset.text)
        var text = e.currentTarget.dataset.text
        wx.navigateTo({
            url: '../word_info/word_info?_id=' + text._id.replace(/[?&'"/]/g, ""),
        })
    },
    // 切换到列表模式
    change_to_list_status() {
        this.setData({
            list_status: true,
        })
    },
    // 关闭列表模式
    close_list_status() {
        this.setData({
            list_status: false,
        })
    },
    // --------------------------------------------------------列表模式的配置







    // -------------------------------页面复习形式的配置
    get_the_one_show_word() {
        var hh = this
        console.log("jjj",hh.data.review_words)
        console.log("jjj",hh.data.review_words[hh.data.review_words.length - 1])
        this.setData({
            the_show_word: hh.data.review_words[hh.data.review_words.length - 1],
        })
        // 获取对应云id图片的https地址
        var imageid = hh.data.review_words[hh.data.review_words.length - 1].imageID
        if (imageid != "无") {
            console.log("oopp")
            wx.cloud.getTempFileURL({
                fileList: [imageid],
                success: res => {
                    console.log(res.fileList[0].tempFileURL)
                    if (res.fileList[0].tempFileURL.length != 0) {
                        var new_image = {
                            url: res.fileList[0].tempFileURL,
                            name: '图片1',
                            deletable: false,
                        }
                        var arr = []
                        arr.push(new_image)
                        hh.setData({
                            fileList: arr,
                            is_have_image: true
                        })
                    } else {
                        hh.setData({
                            is_have_image: false
                        })
                    }

                },
                fail: err => {
                    console.log(err)
                    hh.setData({
                        is_have_image: false
                    })
                }
            })
        } else {
            hh.setData({
                is_have_image: false
            })
        }
    },
    // 切换下一个单词
    To_next_word() {
        this.get_the_one_show_word()
        this.init_no_sentence(this.data.the_show_word.key)
        this.check_status()
    },
    // 已经学习了该单词
    studyed_this_word() {
        var hh = this
        hh.data.review_words.pop()
        var the_words = hh.data.review_words
        hh.setData({
            review_words: the_words
        })
    },
    know_click() {
        if (this.data.review_words.length <= 1) {
            this.show_null_status()
        } else {
            app.updata_word_Know(this.data.the_show_word._id, this.data.the_review_plan).then(index => {
                if (index == "更新成功") {
                    app.Get_all_added_word()
                }
            })
            this.studyed_this_word()
            this.To_next_word()
            this.close_null_status()
        }
    },
    nosure_click() {
        if (this.data.review_words.length <= 1) {
            this.show_null_status()
        } else {
            this.studyed_this_word()
            this.To_next_word()
            this.close_null_status()
        }
    },
    noknow_click() {
        if (this.data.review_words.length <= 1) {
            this.show_null_status()
        } else {
            app.updata_word_No_know(this.data.the_show_word._id).then(index => {
                if (index == "更新成功") {
                    app.Get_all_added_word()
                }
            })
            this.studyed_this_word()
            this.To_next_word()
            this.close_null_status()
        }
    },
    show_null_status() {
        this.setData({
            null_review: true
        })
        wx.setNavigationBarColor({
            frontColor: '#000000',
            backgroundColor: '#ffffff',
            animation: {
                duration: 400,
                timingFunc: 'easeIn'
            }
        })
    },
    close_null_status() {
        this.setData({
            null_review: false
        })
    },
    // no_sentence模块配置
    // 初始化判断是否是句子
    Re_init_the_next_Account_info(text) {
        var hh = this
        app.get_a_item_on_MyWordDb(text).then(function (index1) {
            if (index1 != "不存在的数据") {
                hh.setData({
                    word_belongTo: app.Get_string_Line_feed(index1.word_data_items[0].word_belongTo),
                    word_phrase: index1.word_data_items[0].phrase
                })
            } else {
                hh.setData({
                    word_belongTo: "",
                    word_phrase: ""
                })
            }
        })
    },
    init_no_sentence(text) {
        var hh = this
        if (text.match(/[ ]/g) == null) {
            hh.setData({
                no_sentence: true
            })
            hh.Re_init_the_next_Account_info(text)
        } else {
            hh.setData({
                no_sentence: false,
                word_belongTo: "",
                word_phrase: ""
            })
        }

    },
    // -------------------------------页面复习形式的配置













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
})