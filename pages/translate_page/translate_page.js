// pages/translate_page/translate_page.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        message: "",
        resTextEn: "",
        word_belongTo: "",
        word_phrase: "",

        // 添加按钮的配置
        button_text: "翻译",
        dialogShow: false,
        buttons: [{
            text: '否'
        }, {
            text: '是'
        }],

        // sheet框的配置  选择词库控件配置开始
        TheSelectWordHouse: "默认词库",
        // show_WordHouse_Actionsheet: false,
        WordHouse: [],

        // sheet框的配置  选择复制形式配置开始
        TheSelect_copyItem: "",
        show_copy_Actionsheet: false,
        copyItem: [{
            text: "复制记录",
            value: "复制记录"
        }, {
            text: "复制结果",
            value: "复制结果"
        }, {
            text: "全部复制",
            value: "全部复制"
        }],

        // 输入框的配置
        no_sentence: true,
        addbutton_disable: true,
        show_warn_tip: false,
        warn_tip_text: "",
        is_in_MyWordDB: null,


        // picker的配置
        show_selet_sheet: false,

    },
    onLoad: function (options) {
        console.log(options.acc)
        if (options.acc != undefined && options.acc.length != 0) {
            this.setData({
                message: options.acc
            })
            this.complete_input_click()
        }
    },
    onShow: function () {
        this.Get_WordHouse_form_app_WordHouseQuery()
    },
    // 在用户添加不会的单词后清除部分填写记录
    clearData() {
        this.setData({
            resTextEn: "",
            message: "",
            word_belongTo: "",
            word_phrase: "",
        })
    },






    // 下面三个按钮的配置
    // 添加按钮的点击事件
    addButtonClick() {
        var hh = this
        if (hh.data.button_text == "翻译") {
            hh.chage_button_text()
            hh.complete_input_click()
        } else if (hh.data.button_text == "添加") {

            if (hh.data.resTextEn.length == 0) {
                wx.showToast({
                    icon: 'error',
                    title: '未找到译文'
                })
            } else {
                app.check_is_exist_a_word(hh.data.message).then(res => {
                    if (res) {
                        wx.showToast({
                            icon: 'error',
                            title: '该记录已存在'
                        })
                    } else {
                        hh.showDialog()

                    }

                })

            }
        }

    },
    // 转变按钮的文本 转换模式
    chage_button_text() {
        var hh = this
        if (hh.data.button_text == "翻译") {
            hh.setData({
                button_text: "添加"
            })
        } else if (hh.data.button_text == "添加") {
            hh.setData({
                button_text: "翻译"
            })
        }
    },

    // 生命周期函数
    onShareAppMessage: function () {
        var hh = this
        return new Promise(resolve => {
            resolve({
                title: hh.data.message,
                path: '/pages/translate_page/translate_page?acc=' + hh.data.message.replace(/[?&'"/]/g, ""),
                imageUrl: 'cloud://text-miniprogram1-0ew75t8ac9dca2.7465-text-miniprogram1-0ew75t8ac9dca2-1305229226/ima/shareimage3.png'
            })
        })
    },

    // 复制按钮的点击事件
    copy_ButtonClick() {
        this.show_copy_Actionsheet()
    },








    // 复制形式Actionsheet的配置
    // 打开Actionsheet
    show_copy_Actionsheet() {
        this.setData({
            show_copy_Actionsheet: true
        })
    },
    // 关闭Actionsheet
    close_Copy_Sheet: function () {
        this.setData({
            show_copy_Actionsheet: false
        })
    },
    // Actionsheet的点击事件
    copyItem_SheetClick(e) {
        console.log(e.detail.value)
        var hh = this
        this.setData({
            TheSelect_copyItem: e.detail.value
        })
        if (e.detail.value == "复制记录") {
            wx.setClipboardData({
                data: hh.data.message
            })
        } else if (e.detail.value == "复制结果") {
            wx.setClipboardData({
                data: hh.data.resTextEn
            })
        } else if (e.detail.value == "全部复制") {
            wx.setClipboardData({
                data: '记录：' + hh.data.message + '\n译文：' + hh.data.resTextEn
            })
        }
        this.close_Copy_Sheet()
    },







    // 选择词库Actionsheet的配置
    // show_WordHouse_Actionsheet() {
    //     this.setData({
    //         show_WordHouse_Actionsheet: true
    //     })
    // },
    // close_WordHouse_Sheet: function () {
    //     this.setData({
    //         show_WordHouse_Actionsheet: false
    //     })
    // },
    // wordHouse_SheetClick(e) {
    //     console.log(e.detail.value)
    //     var hh = this
    //     // 点击词库以后立刻转换按钮的文本
    //     hh.chage_button_text()
    //     this.setData({
    //         TheSelectWordHouse: e.detail.value
    //     })
    //     this.close_WordHouse_Sheet()

    //     // 上传数据
    //     app.insert_a_wordData_to_cloudDb(hh.data.message, hh.data.resTextEn, "", e.detail.value).then(function (index) {
    //         if (index == "插入数据失败") {
    //             wx.showToast({
    //                 icon: 'error',
    //                 title: '新增记录失败'
    //             })
    //         } else {
    //             if (hh.data.no_sentence == true && hh.data.is_in_MyWordDB == false) {
    //                 app.insert_a_item_To_MyWordDB(hh.data.message, hh.data.resTextEn, hh.data.word_belongTo, hh.data.word_phrase)
    //             }
    //             // 插入成功后重新获取所有单词
    //             app.Get_all_added_word()
    //             wx.showToast({
    //                 icon: 'success',
    //                 title: '新增记录成功'
    //             })
    //             hh.clearData()
    //             // 添加完成以后不单单要清除 内容还要提示记录为空 按钮不可点击等
    //             hh.setData({
    //                 show_warn_tip: true,
    //                 warn_tip_text: "记录为空",
    //                 addbutton_disable: true
    //             })
    //         }
    //     })
    // },
    // Get_WordHouse_form_app_WordHouseQuery() {
    //     var WordHouseQuery = app.globalData.WordHouseQuery;
    //     var thisWordHouse = [];
    //     if (WordHouseQuery.length != 0) {
    //         for (var i = 0; i < WordHouseQuery.length; i++) {
    //             var thisJson = {
    //                 text: WordHouseQuery[i],
    //                 value: WordHouseQuery[i]
    //             }
    //             thisWordHouse.push(thisJson)
    //         }
    //         this.setData({
    //             WordHouse: thisWordHouse
    //         })
    //     } else {
    //         console.log("未加载用户的词库")
    //     }
    // },
    
    Get_WordHouse_form_app_WordHouseQuery() {
        var WordHouseQuery = [].concat(app.globalData.WordHouseQuery);
        console.log(WordHouseQuery)
        if (WordHouseQuery.length != 0) {
            this.setData({
                WordHouse: WordHouseQuery
            })
        } else {
            console.log("未加载用户的词库")
        }
    },
    // picker的配置
    onChange(event) {
        // this.setData({
        //     the_select_item: event.detail.value
        // })
        this.setData({
            TheSelectWordHouse: event.detail.value
        })
    },
    show() {
        this.setData({
            show_selet_sheet: true
        })
    },

    close_selet_sheet_cancel() {
        this.setData({
            show_selet_sheet: false
        })

    },
    close_selet_sheet_confirm() {
        this.setData({
            show_selet_sheet: false
        })
        console.log(this.data.TheSelectWordHouse)
        var hh = this
        // 点击词库以后立刻转换按钮的文本
        hh.chage_button_text()
        // 上传数据
        app.insert_a_wordData_to_cloudDb(hh.data.message, hh.data.resTextEn, "", hh.data.TheSelectWordHouse).then(function (index) {
            if (index == "插入数据失败") {
                wx.showToast({
                    icon: 'error',
                    title: '新增记录失败'
                })
            } else {
                if (hh.data.no_sentence == true && hh.data.is_in_MyWordDB == false) {
                    app.insert_a_item_To_MyWordDB(hh.data.message, hh.data.resTextEn, hh.data.word_belongTo, hh.data.word_phrase)
                }
                // 插入成功后重新获取所有单词
                app.Get_all_added_word()
                wx.showToast({
                    icon: 'success',
                    title: '新增记录成功'
                })
                hh.clearData()
                // 添加完成以后不单单要清除 内容还要提示记录为空 按钮不可点击等
                hh.setData({
                    show_warn_tip: true,
                    warn_tip_text: "记录为空",
                    addbutton_disable: true
                })
            }
        })
    },






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
        if (e.detail.item.text == "是") {
            var hh = this
            wx.navigateTo({
                url: '../index/index?resTextEn=' + hh.data.resTextEn.replace(/[?&'"/]/g, "") +
                    '&inputText=' + hh.data.message.replace(/[?&'"/]/g, "") +
                    '&word_belongTo=' + hh.data.word_belongTo.replace(/[?&'"/]/g, "") +
                    '&word_phrase=' + hh.data.word_phrase.replace(/[?&'"/]/g, "") +
                    '&no_sentence=' + hh.data.no_sentence.toString(),
            })
        } else if (e.detail.item.text == "否") {
            // hh.show_WordHouse_Actionsheet()
            hh.show()
        }
    },








    // 上方的输入框 点击完成的事件
    complete_input_click() {
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        // 翻译
        var hh = this
        if (hh.data.no_sentence == true) {
            // 先看看数据库有没有
            app.get_a_item_on_MyWordDb(hh.data.message).then(function (index1) {
                if (index1 == "不存在的数据") {
                    hh.setData({
                        is_in_MyWordDB: false
                    })
                    // 使用爬虫翻译
                    console.log(index1)
                    hh.search_for_Crawler(hh.data.message).then(function (index) {
                        if (index == "爬取数据失败") {
                            // wx.hideLoading()
                        } else {
                            hh.setData({
                                resTextEn: index.resTextEn,
                                word_belongTo: index.word_belongTo,
                                word_phrase: index.word_phrase
                            })
                        }
                        wx.hideLoading()
                    })
                } else {
                    hh.setData({
                        resTextEn: index1.word_data_items[0].Chinese_Translation,
                        word_belongTo: index1.word_data_items[0].word_belongTo,
                        word_phrase: index1.word_data_items[0].phrase,
                        is_in_MyWordDB: true
                    })
                    wx.hideLoading()
                }
            })
        } else {
            // 句子翻译使用 api接口
            hh.search_fun(hh.data.message)
            wx.hideLoading()
        }
    },

    // 上方的输入框输入事件 监测是否为空是否存在非英文非中文
    message_inputing(e) {
        var hh = this
        if (hh.data.button_text == "添加") {
            hh.chage_button_text()
        }

        console.log(e.detail.value)
        hh.setData({
            message: e.detail.value
        })
        if (e.detail.value.trim().length != 0) {
            if (e.detail.value.match(/[^a-zA-Z ]/g) == null) {
                if (e.detail.value.match(/[ ]/g) == null) {
                    hh.setData({
                        no_sentence: true
                    })
                } else {
                    hh.setData({
                        no_sentence: false
                    })
                }
                hh.setData({
                    show_warn_tip: false,
                    warn_tip_text: "",
                    addbutton_disable: false
                })
            } else {
                hh.setData({
                    show_warn_tip: true,
                    warn_tip_text: "只能输入英文",
                    addbutton_disable: true
                })
            }
        } else {
            hh.setData({
                show_warn_tip: true,
                warn_tip_text: "记录为空",
                addbutton_disable: true
            })
        }
    },








    // 翻译的配置
    search_fun(message) {
        var hh = this;
        if (message != "") {
            var appid = '20210413000776380';
            var key = 'v76KO8VZgvlRIP6dW3hT';
            var salt = (new Date).getTime();
            var query = message;
            // 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
            var from = 'auto';
            var to = 'zh';
            var str1 = appid + query + salt + key;
            var sign = this.MD5(str1);

            wx.request({
                url: 'https://fanyi-api.baidu.com/api/trans/vip/translate',
                data: {
                    q: query,
                    appid: appid,
                    salt: salt,
                    from: from,
                    to: to,
                    sign: sign
                },
                success: result2 => {
                    console.log(result2)
                    console.log(result2.data.trans_result[0].dst)
                    hh.setData({
                        resTextEn: result2.data.trans_result[0].dst
                    })

                },
                fail(re2) {
                    console.log("失败")
                    console.log(hh.data.inputText)
                    console.log(re2)

                }

            })
        }
    },
    // 百度翻译api的加密签名函数
    MD5(string) {

        function RotateLeft(lValue, iShiftBits) {
            return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
        }

        function AddUnsigned(lX, lY) {
            var lX4, lY4, lX8, lY8, lResult;
            lX8 = (lX & 0x80000000);
            lY8 = (lY & 0x80000000);
            lX4 = (lX & 0x40000000);
            lY4 = (lY & 0x40000000);
            lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
            if (lX4 & lY4) {
                return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
            }
            if (lX4 | lY4) {
                if (lResult & 0x40000000) {
                    return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                } else {
                    return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                }
            } else {
                return (lResult ^ lX8 ^ lY8);
            }
        }

        function F(x, y, z) {
            return (x & y) | ((~x) & z);
        }

        function G(x, y, z) {
            return (x & z) | (y & (~z));
        }

        function H(x, y, z) {
            return (x ^ y ^ z);
        }

        function I(x, y, z) {
            return (y ^ (x | (~z)));
        }

        function FF(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function GG(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function HH(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function II(a, b, c, d, x, s, ac) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function ConvertToWordArray(string) {
            var lWordCount;
            var lMessageLength = string.length;
            var lNumberOfWords_temp1 = lMessageLength + 8;
            var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
            var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
            var lWordArray = Array(lNumberOfWords - 1);
            var lBytePosition = 0;
            var lByteCount = 0;
            while (lByteCount < lMessageLength) {
                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
                lByteCount++;
            }
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
            lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
            lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
            return lWordArray;
        };

        function WordToHex(lValue) {
            var WordToHexValue = "",
                WordToHexValue_temp = "",
                lByte, lCount;
            for (lCount = 0; lCount <= 3; lCount++) {
                lByte = (lValue >>> (lCount * 8)) & 255;
                WordToHexValue_temp = "0" + lByte.toString(16);
                WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
            }
            return WordToHexValue;
        };

        function Utf8Encode(string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        };

        var x = Array();
        var k, AA, BB, CC, DD, a, b, c, d;
        var S11 = 7,
            S12 = 12,
            S13 = 17,
            S14 = 22;
        var S21 = 5,
            S22 = 9,
            S23 = 14,
            S24 = 20;
        var S31 = 4,
            S32 = 11,
            S33 = 16,
            S34 = 23;
        var S41 = 6,
            S42 = 10,
            S43 = 15,
            S44 = 21;

        string = Utf8Encode(string);

        x = ConvertToWordArray(string);

        a = 0x67452301;
        b = 0xEFCDAB89;
        c = 0x98BADCFE;
        d = 0x10325476;

        for (k = 0; k < x.length; k += 16) {
            AA = a;
            BB = b;
            CC = c;
            DD = d;
            a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
            d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
            c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
            b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
            a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
            d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
            c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
            b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
            a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
            d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
            c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
            b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
            a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
            d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
            c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
            b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
            a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
            d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
            c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
            b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
            a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
            d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
            c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
            b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
            a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
            d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
            c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
            b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
            a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
            d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
            c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
            b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
            a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
            d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
            c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
            b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
            a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
            d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
            c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
            b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
            a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
            d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
            c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
            b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
            a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
            d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
            c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
            b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
            a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
            d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
            c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
            b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
            a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
            d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
            c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
            b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
            a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
            d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
            c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
            b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
            a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
            d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
            c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
            b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
            a = AddUnsigned(a, AA);
            b = AddUnsigned(b, BB);
            c = AddUnsigned(c, CC);
            d = AddUnsigned(d, DD);
        }

        var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);

        return temp.toLowerCase();
    },
    search_for_Crawler(word) {
        var hh = this
        return new Promise(function (resolve, reject) {
            wx.request({
                url: 'https://dict.youdao.com/search?q=' + word,
                success: res => {

                    var ans = ""
                    var wordbelongto = ""
                    var phrase = ""

                    // 获取解析
                    var str = res.data.match(/class="pronounce">英\n +.*?>(.*?)[\s\S]*?class="pronounce">美\n\ +.*?>(.*?)<\/span>[\s\S]*?\n([\s\S]*?)\n +<\/ul>\n( +\[([\s\S]*?)\])?/g)
                    console.log(str)
                    if (str != null) {
                        var hhj = str.toString()
                        var kk = hhj.match(/<li>(.*?)<\/li>/g)
                        for (var i = 0; i < kk.length; i++) {
                            var res1 = kk[i].match(/<li>(.*?)<\/li>/)
                            //   console.log(res1[1])
                            ans = ans + res1[1] + "\n"
                        }
                    }


                    // 获取词性等信息
                    var word_other = res.data.match(/<p class="additional">\[([\s\S]*?)\]<\/p>/g)
                    if (word_other != null) {
                        var other = word_other[0].match(/\[([\s\S]*?)\]/)[1]
                        var ot = other.replace(/\s+/g, "")
                        // console.log(ot)
                        wordbelongto = ot
                    }


                    // 获取短语
                    var str2 = res.data.match(/<a class="search-js" href="\/w\/eng\/.*\/#keyfrom=dict.phrase.wordgroup">([\s\w-]*)<\/a>/g)
                    if (str2 != null) {
                        var str2_arr = []
                        for (var i = 0; i < str2.length; i++) {
                            var res2 = str2[i].match(/>(.*?)</)
                            // console.log(res2[1])
                            str2_arr.push(res2[1])
                        }

                        // 获取短语解析（由于短语解析获取的不完善性获取了其他信息 需要将前面的提取出来）
                        var len = str2.length //根据实际的短语的数量提取出 有用的前面的数据 后面是无关的数据
                        var str3 = res.data.match(/<\/a><\/span>([\s\S]*?)<\/p>/g)
                        if (str3 != null) {
                            for (var i = 0; i < len; i++) {
                                var res3 = str3[i].match(/n>([\s\S]*?)<\/p>/)
                                // 如果存在匹配出来的每一个结果中哪一个里面没有中文 就跳过
                                if (res3[1].replace(/\s/g, "").trim().length == 0) {
                                    len++
                                } else {
                                    // console.log(res3[1].replace(/\s+/g,""))
                                    var reu1 = res3[1].replace(/\s+/g, "")
                                    var phra_ans = reu1.replace(/<spanclass=gray>.*?<\/span>/g, "")
                                    // console.log(reu1.replace(/<spanclass=gray>.*?<\/span>/g, ""))
                                    phrase = phrase + str2_arr[i] + ":" + phra_ans + "\n"
                                }
                            }
                        }
                    }


                    var data = {
                        resTextEn: ans,
                        word_belongTo: wordbelongto,
                        word_phrase: phrase,
                    }
                    resolve(data)
                },
                fail: res => {
                    console.log("爬取数据失败", res)
                    reject("爬取数据失败")
                }
            })
        });
    },










    // 上传数据的配置
    // 用户填写好需要添加的单词后上传到云开发数据库的函数
    // onAdd: function (key, value, explainText, wordHouse_Name) {
    //     var NowDate = app.Get_Now_Date()
    //     var hh = this
    //     const db = wx.cloud.database()
    //     db.collection('word').add({
    //         data: {
    //             key: key,
    //             value: value,
    //             explainText: explainText,
    //             the_WordHouse_word_belongTo: wordHouse_Name,
    //             Add_time: NowDate,
    //             review_plan: app.globalData.review_plan.toString(),
    //             study_time: NowDate
    //         },
    //         success: res => {
    //             console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
    //             wx.showToast({
    //                 icon: 'success',
    //                 title: '新增记录成功'
    //             })
    //         },
    //         fail: err => {
    //             wx.showToast({
    //                 icon: 'none',
    //                 title: '新增记录失败'
    //             })
    //             console.error('[数据库] [新增记录] 失败：', err)
    //         }
    //     })
    // },
})