const app = getApp()
Page({
    data: {
        // 搜索框的数据
        inputShowed: false,
        inputVal: "",

        // 搜索列表的配置 懒加载
        all_list: [],
        key_list: [],
        value_list: [],
        explainText_list: [],
        inputtext: "",
        index_end_list: false,

        // 历史框的配置
        his_list: [],
        is_show_his_view: false,

        // 当在单词信息页面返回时监测是否是删除了单词再返回  注意删除后重置为空
        delete_item_id: ""
    },





    // -----------------------------------------------------------------全局配置
    onLoad: function (options) {
        wx.setNavigationBarColor({
            frontColor: '#000000',
            backgroundColor: '#ffffff',
            animation: {
                duration: 400,
                timingFunc: 'easeIn'
            }
        })
    },
    // 该onshow函数目前只是用于 查看单词详情页面后删除单词 返回的监测更新操作
    onShow: function (e) {
        
        var hh = this
        if(hh.data.delete_item_id != ""){
            hh.local_init()
            hh.setData({
                delete_item_id: ""
            })
        }
    },
    // 该函数目前只是用于 查看单词详情页面后删除单词 返回的更新操作
    local_init(){
        var hh = this
        for(var i=0;i<hh.data.all_list.length;i++){
          if(hh.data.all_list[i]._id == hh.data.delete_item_id){
            hh.data.all_list.splice(hh.data.all_list.indexOf(hh.data.all_list[i]),1)
            console.log('删除后重新加载的数组', hh.data.all_list)
            hh.setData({
                all_list: hh.data.all_list
            })
          }
        }
      },
    // -----------------------------------------------------------------全局配置








    // ---------------------------------------搜索查询数据库的配置

    // 清空列表数据
    clear_list() {
        this.setData({
            key_list: [],
            value_list: [],
            explainText_list: [],
            all_list: [],
            index_end_list: false,
        })
    },
    // 当用户滑动到底部的时候继续加载搜索数据
    shoeMore_button_click() {
        var hh = this
        var value = hh.data.inputtext
        // 下面value可以不给出
        if (value.length != 0) {
            hh.search_for_key(value).then(function (items1) {
                hh.search_for_value(value).then(function (items2) {
                    hh.search_for_explainText(value).then(function (items3) {
                        var search_items = []
                        search_items = search_items.concat(items1, items2, items3)
                        console.log(search_items)
                        if (search_items.length == hh.data.all_list.length) {
                            hh.setData({
                                all_list: search_items,
                                index_end_list: true,
                            })
                        } else {
                            hh.setData({
                                all_list: search_items,
                                index_end_list: false,
                            })
                        }

                    })
                })
            })
        } else {

        }
    },
    // 当用户输入搜索内容的时候自动 查询搜索结果
    search_inputing_fun() {
        var hh = this
        hh.clear_list()
        var value = hh.data.inputtext.trim()
        console.log("搜索框的输入", value)
        // 下面value可以不给出
        if (value.length != 0) {
            hh.search_for_key(value).then(function (items1) {
                hh.search_for_value(value).then(function (items2) {
                    hh.search_for_explainText(value).then(function (items3) {

                        var search_items = []
                        search_items = search_items.concat(items1, items2, items3)
                        console.log(search_items)
                        if (hh.data.inputtext.trim().length != 0) {
                            hh.setData({
                                all_list: search_items
                            })
                        }

                    })
                })
            })
            hh.close_his_view()
        } else {
            hh.show_his_view()
            hh.get_storage("searchHisItem").then(res => {
                hh.setData({
                    his_list: res
                })
            })
        }
    },
    // 根据key来搜索
    search_for_key(value) {
        var hh = this
        return new Promise((resolve, reject) => {
            // 先进行相似查询然后将相似的数据 放到羡慕的数组当中输出
            const db = wx.cloud.database()
            db.collection('word').where({
                    //使用正则查询，实现对搜索的模糊查询
                    key: db.RegExp({
                        regexp: value,
                        //从搜索栏中获取的value作为规则进行匹配。
                        options: 'i',
                        //大小写不区分
                    })
                })
                .orderBy('Add_time', 'desc')
                .skip(hh.data.key_list.length)
                .limit(10)
                .get({
                    success: res => {
                        var search_items = [].concat(hh.data.key_list)
                        for (var i = 0; i < res.data.length; i++) {
                            var item = {
                                text: res.data[i].key,
                                attribute: "key",
                                // Add_time: res.data[i].Add_time,
                                // explainText: res.data[i].explainText,
                                // the_WordHouse_word_belongTo: res.data[i].the_WordHouse_word_belongTo,
                                // wordvalue: res.data[i].value,
                                _id: res.data[i]._id,
                                // _openid: res.data[i]._openid,
                                // imageID: res.data[i].imageID
                            }
                            search_items.push(item)
                        }
                        if (hh.data.inputtext.trim().length == value.length) {
                            resolve(search_items)
                        }

                    }
                })
        })
    },
    // 根据value来搜索
    search_for_value(value) {
        var hh = this
        return new Promise((resolve, reject) => {
            // 先进行相似查询然后将相似的数据 放到羡慕的数组当中输出
            const db = wx.cloud.database()
            db.collection('word').where({
                    //使用正则查询，实现对搜索的模糊查询
                    value: db.RegExp({
                        regexp: value,
                        //从搜索栏中获取的value作为规则进行匹配。
                        options: 'i',
                        //大小写不区分
                    })
                })
                .orderBy('Add_time', 'desc')
                .skip(hh.data.value_list.length)
                .limit(10)
                .get({
                    success: res => {
                        var search_items = [].concat(hh.data.value_list)
                        for (var i = 0; i < res.data.length; i++) {
                            var item = {
                                // key: res.data[i].key,
                                attribute: "value",
                                // Add_time: res.data[i].Add_time,
                                // explainText: res.data[i].explainText,
                                // the_WordHouse_word_belongTo: res.data[i].the_WordHouse_word_belongTo,
                                text: res.data[i].value,
                                _id: res.data[i]._id,
                                // _openid: res.data[i]._openid,
                                // imageID: res.data[i].imageID
                            }
                            search_items.push(item)
                        }
                        if (hh.data.inputtext.trim().length == value.length) {
                            resolve(search_items)
                        }

                    }
                })
        })
    },
    // 根据描述来搜索
    search_for_explainText(value) {
        var hh = this
        return new Promise((resolve, reject) => {
            // 先进行相似查询然后将相似的数据 放到羡慕的数组当中输出
            const db = wx.cloud.database()
            db.collection('word').where({
                    //使用正则查询，实现对搜索的模糊查询
                    explainText: db.RegExp({
                        regexp: value,
                        //从搜索栏中获取的value作为规则进行匹配。
                        options: 'i',
                        //大小写不区分
                    })
                })
                .orderBy('Add_time', 'desc')
                .skip(hh.data.explainText_list.length)
                .limit(10)
                .get({
                    success: res => {
                        var search_items = [].concat(hh.data.explainText_list)
                        for (var i = 0; i < res.data.length; i++) {
                            var item = {
                                // key: res.data[i].key,
                                attribute: "explainText",
                                // Add_time: res.data[i].Add_time,
                                text: res.data[i].explainText,
                                // the_WordHouse_word_belongTo: res.data[i].the_WordHouse_word_belongTo,
                                // wordvalue: res.data[i].value,
                                _id: res.data[i]._id,
                                // _openid: res.data[i]._openid,
                                // imageID: res.data[i].imageID
                            }
                            search_items.push(item)
                        }
                        if (hh.data.inputtext.trim().length == value.length) {
                            resolve(search_items)
                        }

                    }
                })
        })
    },
    // ---------------------------------------搜索查询数据库的配置








    //-------------------------用户点击搜索结果项的配置

    // 用户点击搜索提示框弹出的相似数据的事件函数
    selectResult: function (e) {
        var hh = this
        app.Get_a_word_info_for_cloud(e.currentTarget.dataset.text._id)
            .then(function (value) {
                if (value != "未发现信息") {
                    console.log('select result', e.currentTarget.dataset.text._id)
                    wx.navigateTo({
                        url: '../word_info/word_info?_id=' + e.currentTarget.dataset.text._id.replace(/[?&'"/]/g, ""),
                    });
                    // 将搜索的内容添加到历史搜索缓存中
                    var value = hh.data.inputtext.trim().replace(/[,]/g, "")
                    // 监测 如果存在相同的就不添加
                    for (var i = 0; i < hh.data.his_list.length; i++) {
                        if (value == hh.data.his_list[i]) {
                            value = ""
                        }
                    }
                    // 如果value不为空 也就是没有重复出现的历史记录
                    if (value != "") {
                        var list = [value].concat(hh.data.his_list)
                        if (list.length >= 8) {
                            list.pop()
                        }
                        hh.setData({
                            his_list: list
                        })
                        hh.set_to_storage("searchHisItem", hh.data.his_list.toString())
                    }
                } else {
                    wx.showToast({
                        title: '该记录不存在',
                        icon: 'error',
                        duration: 2000
                    })

                }
            })
    },
    //-------------------------用户点击搜索结果项的配置









    // ------------------历史记录配置
    set_to_storage(stor_id, stor_value) {
        try {
            wx.setStorageSync(stor_id, stor_value)
            console.log("添加缓存成功")
        } catch (e) {
            console.log("添加缓存失败", e)
        }
    },
    clear_storage(stor_id) {
        wx.removeStorage({
            key: stor_id,
            success(res) {
                console.log("输出删除缓存成功信息", res)
            }
        })
    },
    get_storage(stor_id) {
        return new Promise(function (resolve, reject) {
            try {
                var value = wx.getStorageSync(stor_id)
                if (value) {
                    console.log("获取缓存数据成功", value)
                    var stroageSeleitem
                    if (value.split(",").length == 1) {
                        stroageSeleitem = [value]
                    } else {
                        stroageSeleitem = value.split(",")
                    }

                    resolve(stroageSeleitem)
                } else {
                    resolve([])
                }
            } catch (e) {
                console.log("获取缓存数据失败", e)
                reject([])
            }
        })
    },
    show_his_view() {
        this.setData({
            is_show_his_view: true
        })
    },
    close_his_view() {
        this.setData({
            is_show_his_view: false
        })
    },
    input_focus() {
        var hh = this
        var int_str = hh.data.inputtext.trim()
        if (int_str.length == 0) {
            hh.show_his_view()
            hh.get_storage("searchHisItem").then(res => {
                hh.setData({
                    his_list: res
                })
            })
        } else {
            hh.close_his_view()
        }
    },
    input_blur() {
        this.close_his_view()
    },
    his_item_click(e) {
        console.log(e)
        console.log(e.currentTarget.dataset.text)
        this.setData({
            inputtext: e.currentTarget.dataset.text
        })
        this.close_his_view()
        this.search_inputing_fun()
    },
    // -------------------历史记录配置

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