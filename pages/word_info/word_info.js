// pages/word_info/word_info.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        wordInfo: {},

        // 图片预览配置
        is_have_image: false,
        fileList: [],

        // no_sentence模块
        no_sentence: true,
        word_belongTo: "",
        word_phrase: "",

        // 修改内容配置
        editable: false,
        edit_button_text: "编辑",
        files: [],
        showDialog: false,
        buttons: [{
            text: '否'
        }, {
            text: '是'
        }],
        // 可以直接拿单词本身的复习计划 但是考虑到 用户修改了新的计划所以用全局的
        the_review_plan: [],
    },

    onLoad: function (options) {
        console.log(options)
        this.data_init(options)
        this.get_app_data()
    },

    // 数据初始化 利用上一个页面传过来的单词id 再次查询云开发数据库获取数据
    data_init(Opdata) {
        var hh = this
        app.Get_a_word_info_for_cloud(Opdata._id)
            .then(function (value) {
                console.log(value)
                if (value != "未发现信息") {
                    hh.setData({
                        wordInfo: value,
                    })
                    // 初始化图片的显示 将云文件id转换为http地址的图片地址
                    hh.init_image()
                    // 不是句子的初始化
                    hh.init_no_sentence_data()
                } else {
                    wx.showToast({
                        title: '未发现的记录',
                        icon: 'error',
                        duration: 2000
                    })

                }
            })
    },
    // 从全局的复习计划中获取
    get_app_data() {
        this.setData({
            the_review_plan: app.globalData.review_plan
        })
    },





    // 初始化不是句子的时候的显示数据
    init_no_sentence_data() {
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        var hh = this
        if (app.check_space(hh.data.wordInfo.key) == false) {
            hh.setData({
                no_sentence: true
            })
            // 先看看数据库有没有
            app.get_a_item_on_MyWordDb(hh.data.wordInfo.key).then(function (index1) {
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
                wx.hideLoading()
            })
        } else {
            wx.hideLoading()
            hh.setData({
                no_sentence: false
            })
        }
    },
    // 初始化图片显示 将云文件id转换为http地址的图片地址
    init_image() {
        var hh = this
        // 图片初始化
        wx.cloud.getTempFileURL({
            fileList: [hh.data.wordInfo.imageID],
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
    },







    //------------------------------- 修改内容配置 ----------------------------------//
    //右下角编辑按钮的点击事件
    edit_button_click() {
        var hh = this
        if (hh.data.edit_button_text == "编辑") {
            hh.setData({
                editable: true,
                edit_button_text: "保存"
            })
        } else if (hh.data.edit_button_text == "保存") {
            hh.setData({
                editable: false,
                edit_button_text: "编辑"
            })
            hh.showDialog()
        }
    },
    //转换为编辑状态
    go_to_the_edit_Status() {
        hh.setData({
            editable: true,
            edit_button_text: "保存"
        })
    },
    //转换为非编辑状态
    go_to_the_no_edit_Status() {
        var hh = this
        hh.setData({
            editable: false,
            edit_button_text: "编辑"
        })
    },
    // 添加图片的时候 点击选择图片窗口右上角的完成按钮
    add_a_image_compelet_event(e) {
        console.log(e.detail)
        var the_ima = [{
            url: e.detail.file.url,
            name: "图片1",
        }]
        this.setData({
            files: the_ima
        })
    },
    // 点击图片右上角的删除按钮 删除图片
    delete_a_ima_event() {
        this.setData({
            files: []
        })
    },
    // 上传图片到云开发服务器的函数 自带监测
    Upload_image_to_cloudDb(fileID, the_new_filePath, the_new_fileName) {
        var hh = this
        console.log('进入了上传删除图片函数：', fileID, the_new_filePath, the_new_fileName)
        return new Promise(function (resolve, reject) {
            if (hh.data.fileList.length != 0) {
                // 如果存在该文件
                app.delete_a_image_on_cloudDb(fileID).then(function (index) {
                    if (index == "删除图片文件成功") {
                        if (the_new_filePath.length != 0) {
                            app.Upload_a_image_to_cloudDb(the_new_filePath, the_new_fileName).then(function (index2) {
                                if (index2 != "上传文件失败") {
                                    resolve("上传文件成功")
                                    console.log("okok", index2)
                                    hh.data.wordInfo.imageID = index2.fileID
                                } else {
                                    reject("上传文件失败")
                                }
                            })
                        } else {
                            resolve("上传文件成功")
                            hh.data.wordInfo.imageID = "无"
                        }
                    } else {
                        reject("上传文件失败")
                    }
                })
            } else {
                if (the_new_filePath.length != 0) {
                    app.Upload_a_image_to_cloudDb(the_new_filePath, the_new_fileName).then(function (index2) {
                        if (index2 != "上传文件失败") {
                            resolve("上传文件成功")
                            hh.data.wordInfo.imageID = index2.fileID
                            console.log("okok", index2)
                        } else {
                            reject("上传文件失败")
                        }
                    })
                } else {
                    resolve("上传文件成功")
                    hh.data.wordInfo.imageID = "无"
                }
            }
        })

    },


    //------------------------------ 编辑输入是的事件
    describe_inputing_event(e) {
        // console.log(e)
        // console.log(this.data.wordInfo)
        var kk = this.data.wordInfo
        kk.explainText = e.detail.value
        this.setData({
            wordInfo: kk,
        })
        // console.log(this.data.wordInfo)
    },
    phrase_inputing_event(e) {
        // console.log(e)
        this.setData({
            word_phrase: e.detail.value,
        })
        // console.log(this.data.wordInfo)
    },
    belongto_inputing_event(e) {
        this.setData({
            word_belongTo: e.detail.value,
        })
    },
    value_inputing_event(e) {
        // console.log(e)
        var kk = this.data.wordInfo
        kk.value = e.detail.value
        this.setData({
            wordInfo: kk,
        })
    },
    key_inputing_event(e) {
        // console.log(e.detail.value)
        var kk = this.data.wordInfo
        kk.key = e.detail.value
        this.setData({
            wordInfo: kk,
        })
    },
    //------------------------------ 编辑输入是的事件


    showDialog() {
        this.setData({
            showDialog: true
        })
    },
    closeDialog() {
        this.setData({
            showDialog: false
        })
    },
    DialogButton_click(e) {
        var hh = this
        hh.closeDialog()
        if (e.detail.item.text == "是") {
            console.log("用户点击了：是")
            // 该更新函数 自带监测 无需监测是否存在图片再使用
            hh.Upload_image_to_cloudDb(hh.data.wordInfo.imageID, hh.data.files[0].url, hh.data.wordInfo._id)
                .then(function (id) {
                    if (id == "上传文件成功") {
                        var info = hh.data.wordInfo
                        app.updata_a_word_all(info._id, info.Add_time, info.explainText, info.key, info.the_WordHouse_word_belongTo, info.value, info.review_plan, info.study_time, info.imageID)
                            .then(function (index3) {
                                if (index3 == "修改信息成功") {
                                    app.Get_all_added_word()
                                    hh.go_to_the_no_edit_Status()
                                    hh.init_image()
                                }
                            })
                    }
                })
        } else if (e.detail.item.text == "否") {
            console.log("用户点击了：否")
            hh.go_to_the_no_edit_Status()
        }
    },
    // 对话框点击事件
    // DialogButton_click(e) {
    //     var hh = this
    //     hh.closeDialog()
    //     if (e.detail.item.text == "是") {
    //         console.log("用户点击了：是")
    //         // 该更新函数 自带监测 无需监测是否存在图片再使用
    //         hh.Upload_image_to_cloudDb(hh.data.wordInfo.imageID, hh.data.files[0].url, hh.data.wordInfo._id)
    //             .then(function (id) {
    //                 if (id == "上传文件成功") {
    //                     var info = hh.data.wordInfo
    //                     var the_review_plan = hh.data.the_review_plan.toString()
    //                     var study_time = app.Get_Now_Date()
    //                     app.updata_a_word_all(info._id, info.Add_time, info.explainText, info.key, info.the_WordHouse_word_belongTo, info.value, the_review_plan, study_time, hh.info.imageID)
    //                         .then(function (index3) {
    //                             if (index3 == "修改信息成功") {
    //                                 app.Get_all_added_word()
    //                                 hh.go_to_the_no_edit_Status()
    //                                 hh.init_image()
    //                             }
    //                         })
    //                 }
    //             })
    //     } else if (e.detail.item.text == "否") {
    //         console.log("用户点击了：否")
    //         // 该更新函数 自带监测 无需监测是否存在图片再使用
    //         hh.Upload_image_to_cloudDb(hh.data.wordInfo.imageID, hh.data.files[0].url, hh.data.wordInfo._id)
    //             .then(function (id) {
    //                 if (id == "上传文件成功") {
    //                     var info = hh.data.wordInfo
    //                     var word = app.Get_a_word_info_for_localData(info.key)
    //                     var plan = word.review_plan
    //                     var time = word.study_time
    //                     app.updata_a_word_all(info._id, info.Add_time, info.explainText, info.key, info.the_WordHouse_word_belongTo, info.value, plan, time, info.imageID)
    //                         .then(function (index3) {
    //                             if (index3 == "修改信息成功") {
    //                                 app.Get_all_added_word()
    //                                 hh.go_to_the_no_edit_Status()
    //                                 hh.init_image()
    //                             }
    //                         })
    //                 }
    //             })
    //     }
    // },
    //-------------------------------> 修改内容配置 <----------------------------------//














    // ------------------------删除记录配置    
    delete_button_click() {
        var hh = this
        wx.showModal({
            title: '',
            content: '你真的忍心删除我吗？',
            success(res) {
                if (res.confirm) {
                    app.delete_a_word(hh.data.wordInfo._id).then(res => {
                        if (res == "删除记录成功") {
                            app.Get_all_added_word();
                            app.delete_a_image_on_cloudDb(hh.data.wordInfo.imageID)
                            wx.showToast({
                                title: '删除成功',
                                icon: 'success',
                                duration: 2000
                            })
                            let pages = getCurrentPages(); // 当前页，
                            let prevPage = pages[pages.length - 2]; // 上一页
                            prevPage.setData({
                                delete_item_id: hh.data.wordInfo._id,
                            })
                            setTimeout(function () {
                                wx.navigateBack({
                                    delta: 1,
                                })
                            }, 1000)
                        } else {
                            wx.showToast({
                                title: '删除失败',
                                icon: 'error',
                                duration: 2000
                            })
                        }
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
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