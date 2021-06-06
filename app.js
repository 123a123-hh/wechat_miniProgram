// app.js
App({
  onLaunch() {
    this.InitCloud();
    this.GetUserOpenID();
    this.GetUserWordHouse();
    this.GetUser_review_plan();
    this.GetReg_for_mi();
    this.Get_all_added_word();
    this.init_shareMenu();
    this.get_all_wordHouse_info()
  },


  // 初始化云开发函数
  InitCloud() {
    //初始化云开发
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      try {
        wx.cloud.init({
          // env 参数说明：
          //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
          //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
          //   如不填则使用默认环境（第一个创建的环境）
          // env: 'my-env-id',
          traceUser: true,
        })
      } catch (e) {

      }
    }
  },
  // 获取用户openid函数
  GetUserOpenID() {
    // 获取用户openid
    var hh = this
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        hh.globalData.openid = res.result.openid

      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  init_shareMenu() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },



  // 词库表的函数
  // 为用户创建基础的词库 默认创建一个publicWord词库
  CreateWordHouse() {
    var hh = this
    if (hh.globalData.WordHouseQuery.length == 0) {
      const db = wx.cloud.database()
      db.collection('counters').add({
        data: {
          WordHouseQuery: "默认词库",
        },
        success: res => {
          console.log('[数据库] [新增词库记录] 成功，记录: ', res)
          hh.globalData.wordHouse_Id = res._id
          hh.globalData.WordHouseQuery = ["默认词库"]
        },
        fail: err => {
          console.error('[数据库] [新增词库记录] 失败：', err)
        }
      })
    } else {
      console.log("已经创建了")
    }
  },
  // 获取用户的词库 如果没有词库就创建一个
  GetUserWordHouse() {
    var hh = this
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('counters').where({
      _openid: hh.globalData.openid
    }).get({
      success: res => {
        console.log('[数据库] [查询词库记录] 成功: ', res)
        if (res.data.length != 0) {
          hh.globalData.WordHouseQuery = res.data[0].WordHouseQuery.split(",")
          hh.globalData.wordHouse_Id = res.data[0]._id
        } else {
          hh.CreateWordHouse();
        }
        // console.log('[数据库] [查询词库记录] 成功: ', res.data[0]._id)
      },
      fail: err => {
        console.error('[数据库] [查询词库记录] 失败：', err)
      },
      complete: res => {
        // 如果没有词库就创建一个
      }

    })



  },
  // 添加一个词库
  Add_New_WordHouse(the_New_WordHouse_Name) {
    var hh = this
    return new Promise(function (resolve, reject) {

      var the_New_WordHouse = hh.globalData.WordHouseQuery.toString() + "," + the_New_WordHouse_Name
      const db = wx.cloud.database()
      db.collection('counters').doc(hh.globalData.wordHouse_Id).update({
        data: {
          WordHouseQuery: the_New_WordHouse,
        },
        success: res => {
          console.log('[数据库] [更新记录] 成功: ', res)
          hh.globalData.WordHouseQuery = the_New_WordHouse.split(",")
          resolve("添加词库成功")
        },
        fail: err => {
          console.error('[数据库] [更新记录] 失败：', err)
          reject("添加词库失败")
        }
      })
    });
  },
  // 此处删除一个词库 其实是 更新词库 将不要的去掉而已
  delete_a_wordHouse(the_wordHouse_name) {
    var hh = this
    return new Promise(function (resolve, reject) {
      var arr = hh.globalData.WordHouseQuery
      var delete_wordHouse = arr.splice(arr.indexOf(the_wordHouse_name), 1).toString()
      var new_arr = arr.toString()
      const db = wx.cloud.database()
      db.collection('counters').doc(hh.globalData.wordHouse_Id).update({
        data: {
          WordHouseQuery: new_arr,
        },
        success: res => {
          console.log('[数据库] [删除词库] 成功: ', res)
          // 获取删除后的新词库列表
          hh.globalData.WordHouseQuery = new_arr.split(",")
          resolve("删除词库成功")
        },
        fail: err => {
          console.error('[数据库] [删除词库] 失败：', err)
          reject("删除词库失败")
        }
      })
    });
  },


  //词库信息表
  add_New_WordHouse_introdu_info(wordName, wordInfo) {
    var hh = this
    return new Promise(function (resolve, reject) {
      const db = wx.cloud.database()
      db.collection('wordHouse_info').add({
        data: {
          WordHouseName: wordName,
          WordHouseInfo: wordInfo
        },
        success: res => {
          console.log('[数据库] [新增词库信息] 成功，记录: ', res)
          resolve(res)
        },
        fail: err => {
          console.error('[数据库] [新增词库信息] 失败：', err)
          reject("更新词库信息失败")
        }
      })
    });
  },
  get_a_wordHouse_info(wordName) {
    var hh = this
    return new Promise(function (resolve, reject) {
      const db = wx.cloud.database()
      db.collection('wordHouse_info').where({
          _openid: hh.globalData.openid,
          WordHouseName: wordName
        })
        .get({
          success: res => {
            console.log('[数据库] [查询词库信息] 成功', res)
            resolve(res)
          },
          fail: err => {
            console.error('[数据库] [查询词库信息] 失败：', err)
            reject("查询词库信息失败")
          }
        })
    })
  },
  get_all_wordHouse_info() {
    var hh = this
    return new Promise(function (resolve, reject) {
      const db = wx.cloud.database()
      db.collection('wordHouse_info').where({
          _openid: hh.globalData.openid,
        })
        .get({
          success: res => {
            console.log('[数据库] [查询所有词库信息] 成功', res)
            resolve(res)
            //res.data[n].WordHouseInfo/.WordHouseName/._id
            if (res.data.length == 0) {
              hh.add_New_WordHouse_introdu_info("默认词库", "该词库的介绍信息").then(res => {
                hh.globalData.wordHouse_infos = [{
                  WordHouseName: "默认词库",
                  WordHouseInfo: "该词库的介绍信息",
                  _id: res._id
                }]
              })
            } else {
              hh.globalData.wordHouse_infos = res.data
            }
          },
          fail: err => {
            console.error('[数据库] [查询所有词库信息] 失败：', err)
            reject("查询词库信息失败")
          }
        })
    })
  },
  // 删除一个词库信息
  delete_a_wordHouse_info(the_wordHouse_name) {
    var hh = this
    return new Promise(function (resolve, reject) {

      const db4 = wx.cloud.database()
      db4.collection('wordHouse_info').where({
        WordHouseName: the_wordHouse_name
      }).remove({
        success: res => {
          console.log('[数据库] [删除记录] 成功：', res)
          // 删除以后再次更新本地单词数据
          resolve("删除词库信息成功")
        },
        fail: err => {
          console.log('[数据库] [删除记录] 失败：', err)
          reject("删除词库信息失败")
        }
      })
    })
  },
  // 更新一个词库信息
  updata_a_wordHouse_info(wordHouseName, the_new_wordHouseName, wordInfo) {
    var hh = this
    console.log("进入了更新词库信息函数", wordHouseName, the_new_wordHouseName, wordInfo)
    return new Promise(function (resolve, reject) {
      const db = wx.cloud.database()
      db.collection('wordHouse_info').where({
        WordHouseName: wordHouseName
      }).update({
        data: {
          WordHouseName: the_new_wordHouseName,
          WordHouseInfo: wordInfo
        },
        success: res => {
          console.log('[数据库] [更换词库] 成功: ', res)
          // 删除以后再次更新本地单词数据
          resolve("更新词库信息成功")
        },
        fail: err => {
          console.error('[数据库] [更换词库] 失败：', err)
          reject("更新词库信息失败")
        }
      })
    });
  },




  // 复习表的函数
  // 新建一个复习计划
  Create_a_revire_plan() {
    var hh = this
    if (hh.globalData.review_plan.length == 0) {
      const db = wx.cloud.database()
      db.collection('count_review_form').add({
        data: {
          review_plan: "1,2,5,10,20,40,60",
        },
        success: res => {
          console.log('[数据库] [新增词库记录] 成功，记录 _id: ', res)
          hh.globalData.review_form_Id = res._id
          hh.globalData.review_plan = ["1", "2", "5", "10", "20", "40", "60"]
        },
        fail: err => {
          console.error('[数据库] [新增词库记录] 失败：', err)
        }
      })
    } else {
      console.log("已经创建了")
    }
  },
  // 获取用户的复习计划
  GetUser_review_plan() {
    var hh = this
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('count_review_form').where({
      _openid: hh.globalData.openid
    }).get({
      success: res => {
        console.log('[数据库] [查询复习计划记录] 成功: ', res)
        if (res.data.length != 0) {
          hh.globalData.review_plan = res.data[0].review_plan.split(",")
          hh.globalData.review_form_Id = res.data[0]._id
        } else {
          hh.Create_a_revire_plan();
        }
        // console.log('[数据库] [查询词库记录] 成功: ', res.data[0]._id)
      },
      fail: err => {
        console.error('[数据库] [查询复习计划记录] 失败：', err)
      },
      complete: res => {
        // 如果没有词库就创建一个
      }
    })
  },
  // 更新复习计划
  Updata_review_plan(the_new_review_plan) {
    var hh = this
    const db = wx.cloud.database()
    db.collection('count_review_form').doc(hh.globalData.review_form_Id).update({
      data: {
        review_plan: the_new_review_plan,
      },
      success: res => {
        console.log('[数据库] [更新记录] 成功: ', res)
        hh.globalData.review_plan = the_new_review_plan.split(",")
      },
      fail: err => {
        console.error('[数据库] [更新记录] 失败：', err)
      }
    })
  },




  // 签到表的函数
  // 获取用户的签到数据 没有数据表就创建一个
  GetReg_for_mi() {
    var hh = this
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('Register_forn').where({
      _openid: hh.globalData.openid
    }).get({
      success: res => {
        console.log('[数据库] [查询签到表记录] 成功: ', res)
        if (res.data.length != 0) {
          hh.globalData.Register_AllregTime_for_mi = res.data[0].Allreg.split(",")
          hh.globalData.Register_id = res.data[0]._id
          hh.globalData.Register_max_reg_num = res.data[0].max_continue_reg_num
          hh.globalData.continue_reg_num = res.data[0].continue_reg_num
          hh.globalData.allReg_num = res.data[0].allReg_num
        } else {
          hh.Create_a_Register_form();
        }
        // console.log('[数据库] [查询词库记录] 成功: ', res.data[0]._id)

      },
      fail: err => {
        console.error('[数据库] [查询签到表记录] 失败：', err)
      },
      complete: res => {
        // 如果没有词库就创建一个
      }
    })
  },
  // 创建一个签到表
  Create_a_Register_form() {
    var hh = this
    if (hh.globalData.Register_AllregTime_for_mi.length == 0) {
      const db = wx.cloud.database()
      db.collection('Register_forn').add({
        data: {
          Allreg: "",
          continue_reg_num: "0",
          max_continue_reg_num: "0",
          allReg_num: "0"
        },
        success: res => {
          console.log('[数据库] [新增词库记录] 成功，记录 _id: ', res)
          // hh.globalData.Register_Allreg = res.data[0].Allreg.split(",")
          hh.globalData.Register_id = res._id
          hh.globalData.Register_max_reg_num = "0"
          hh.globalData.continue_reg_num = "0"
          hh.globalData.allReg_num = "0"
        },
        fail: err => {
          console.error('[数据库] [新增词库记录] 失败：', err)
        }
      })
    } else {
      console.log("已经创建了")
    }
  },
  // 更新签到表
  Updata_Register_forn(the_new_date) {
    var hh = this
    var time_data = hh.get_reg_updata_data(the_new_date)
    const db = wx.cloud.database()
    db.collection('Register_forn').doc(hh.globalData.Register_id).update({
      data: {
        Allreg: time_data[0],
        continue_reg_num: time_data[1],
        max_continue_reg_num: time_data[2],
        allReg_num: time_data[3],
      },
      success: res => {
        console.log('[数据库] [更新记录] 成功: ', res)
        var reg_arr = time_data[0].split(",")
        hh.globalData.Register_AllregTime_for_mi = reg_arr
        hh.globalData.continue_reg_num = time_data[1]
        hh.globalData.Register_max_reg_num = time_data[2]
        hh.globalData.allReg_num = time_data[3]
      },
      fail: err => {
        console.error('[数据库] [更新记录] 失败：', err)
      }
    })
  },
  // 签到表存储的数据和显示的不一样 需要转换 所以需要获取先在正式更新
  get_reg_updata_data(the_new_date) {
    var hh = this
    var all_data = []
    if (hh.globalData.Register_AllregTime_for_mi.length == 0 || hh.globalData.Register_AllregTime_for_mi[0] == "") {
      var time = the_new_date
      all_data = [the_new_date.toString(), "1", "1", "1"]
    } else {
      var time = the_new_date + "," + hh.globalData.Register_AllregTime_for_mi.toString()
      var continue_reg_num = "0"
      var Register_max_reg_num = hh.globalData.Register_max_reg_num
      var allReg_num = (parseInt(hh.globalData.allReg_num) + 1).toString()
      var time_arr = time.split(",")
      if (parseInt(time_arr[0]) - parseInt(time_arr[1]) == 86400000) {
        continue_reg_num = (parseInt(hh.globalData.continue_reg_num) + 1).toString()
        if (parseInt(continue_reg_num) > parseInt(hh.globalData.Register_max_reg_num)) {
          Register_max_reg_num = continue_reg_num
        }
      }
      all_data = [time, continue_reg_num, Register_max_reg_num, allReg_num]

    }
    // console.log(all_data)
    return all_data



  },
  // 监测是否今天已经签到了
  check_clock_in() {
    var hh = this
    return new Promise(function (resolve, reject) {
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res1 => {
          var openid = res1.result.openid
          const db = wx.cloud.database()
          // 查询当前用户所有的 counters
          db.collection('Register_forn').where({
            _openid: openid
          }).get({
            success: res => {
              if (res.data.length != 0) {
                var Register_AllregTime_for_mi = res.data[0].Allreg.split(",")
                var date_for_mi = hh.Get_Now_Date_for_mi()
                if (date_for_mi == parseInt(Register_AllregTime_for_mi[0])) {
                  resolve(true)
                } else {
                  resolve(false)
                }
              } else {
                resolve(false)
              }
            },
            fail: err2 => {
              reject(false)
            }
          })
        },
        fail: err => {
          reject(false)
        }
      })
    })
  },






  // 单词表的函数
  // 当用户复习单词的时候点击了认识
  updata_word_Know(word_id, the_review_plan) {
    // 该函数弹出首个元素 返回值是弹出的元素 所以不需要复制获取
    var the_plan = the_review_plan.toString()
    var arr = the_plan.split(",")
    arr.shift()
    var hh = this
    return new Promise(function (resolve, reject) {
      var NowDate = hh.Get_Now_Date()
      const db = wx.cloud.database()
      db.collection('word').doc(word_id).update({
        data: {
          study_time: NowDate,
          review_plan: arr.toString()
        },
        success: res => {
          console.log('[数据库] [更新记录] 成功: ', res)
          resolve("更新成功")
        },
        fail: err => {
          console.error('[数据库] [更新记录] 失败：', err)
          reject("更新失败")
        }
      })
    })
  },
  // 当用户复习单词的时候点击了不认识
  updata_word_No_know(word_id) {
    console.log(this.globalData.review_plan)
    var hh = this
    return new Promise(function (resolve, reject) {
      var NowDate = hh.Get_Now_Date()
      const db = wx.cloud.database()
      db.collection('word').doc(word_id).update({
        data: {
          study_time: NowDate,
          review_plan: hh.globalData.review_plan.toString()
        },
        success: res => {
          console.log('[数据库] [更新记录] 成功: ', res)
          resolve("更新成功")
        },
        fail: err => {
          console.error('[数据库] [更新记录] 失败：', err)
          reject("更新失败")
        }
      })
    })
  },
  // 获取今天需要复习的单词 对象数组
  Get_review_word_today() {
    var hh = this
    var all_word_review_today = []
    for (var i = 0; i < hh.globalData.all_added_word.length; i++) {
      var review_time = hh.Get_add_date(hh.globalData.all_added_word[i].study_time, hh.globalData.all_added_word[i].review_plan.split(",")[0])
      var now_time = hh.Get_Now_Date()
      if (hh.is_review_word(now_time, review_time)) {
        all_word_review_today.push(hh.globalData.all_added_word[i])
      }
    }
    return all_word_review_today
  },
  // 获取所有添加的单词
  async Get_all_added_word() {
    var hh = this
    const db = wx.cloud.database()
    var arr = []
    var len = await (await db.collection('word').where({
      _openid: hh.globalData.openid
    }).count()).total
    console.log(len)
    if (len <= 20) {
      db.collection('word').where({
          _openid: hh.globalData.openid
        })
        .get({
          success: res => {
            console.log('[数据库] [查询所有单词记录] 成功', res)
            hh.globalData.all_added_word = res.data
          },
          fail: err => {
            console.error('[数据库] [查询所有单词记录] 失败：', err)
          }
        })
    } else {
      var xunhuan_len = len / 20
      const tasks = []
      for (var i = 0; i < xunhuan_len; i++) {
        const promise = db.collection('word').where({
            _openid: hh.globalData.openid
          })
          .skip(i * 20)
          .limit(20)
          .get()
        tasks.push(promise)
      }
      await (await Promise.all(tasks)).reduce((acc, cur) => {
        arr = arr.concat(acc.data, cur.data)
      })
      console.log('[数据库] [查询所有单词记录] 成功', arr)
      hh.globalData.all_added_word = arr
    }
  },
  // 使用正则表达式模糊查询数据库
  vague_search(value) {
    //连接数据库
    var hh = this
    var search_items
    wx.cloud.database().collection('word').where({
      //使用正则查询，实现对搜索的模糊查询
      key: db.RegExp({
        regexp: value,
        //从搜索栏中获取的value作为规则进行匹配。
        options: 'i',
        //大小写不区分
      })
    }).get({
      success: res => {
        console.log(res.data)
      }
    })
  },
  // 更新单词表的词库 多个单词
  updata_more_word_wordHouse(wordHouse, the_new_wordHouse_name) {
    var hh = this
    const db = wx.cloud.database()
    console.log("进入了更新词库", wordHouse, the_new_wordHouse_name)
    db.collection('word').where({
      the_WordHouse_word_belongTo: wordHouse
    }).update({
      data: {
        the_WordHouse_word_belongTo: the_new_wordHouse_name
      },
      success: res => {
        console.log('[数据库] [更换词库] 成功: ', res)
        // 删除以后再次更新本地单词数据
        hh.Get_all_added_word();
      },
      fail: err => {
        console.error('[数据库] [更换词库] 失败：', err)
      }
    })
  },
  // 更新单词表的词库 单个单词
  updata_a_word_wordHouse(word_id, the_new_wordHouse_name) {
    var hh = this
    const db = wx.cloud.database()
    db.collection('word').doc(word_id).update({
      data: {
        the_WordHouse_word_belongTo: the_new_wordHouse_name
      },
      success: res => {
        console.log('[数据库] [更换词库] 成功: ', res)
        // 删除以后再次更新本地单词数据
        hh.Get_all_added_word();
      },
      fail: err => {
        console.error('[数据库] [更换词库] 失败：', err)
      }
    })
  },
  // 更新单词的所有数据
  updata_a_word_all(word_id, Add_time, explainText, key, the_WordHouse_word_belongTo, value, review_plan, study_time, imageID) {
    console.log("进入了更新单词的所有数据函数", word_id, Add_time, explainText, key, the_WordHouse_word_belongTo, value, review_plan, study_time, imageID)
    var hh = this
    return new Promise(function (resolve, reject) {
      const db = wx.cloud.database()
      db.collection('word').doc(word_id).update({
        data: {
          Add_time: Add_time,
          explainText: explainText,
          key: key,
          review_plan: review_plan,
          study_time: study_time,
          the_WordHouse_word_belongTo: the_WordHouse_word_belongTo,
          value: value,
          imageID: imageID
        },
        success: res => {
          console.log('修改信息成功', res)
          resolve("修改信息成功")
        },
        fail: err => {
          console.error('修改信息失败', err)
          reject("修改信息失败")
        }
      })
    })
  },
  // 删除单词表中 对应词库的单词
  delete_wordHouse_word(wordHouse) {
    var hh = this
    const db4 = wx.cloud.database()
    console.log(wordHouse)
    db4.collection('word').where({
      the_WordHouse_word_belongTo: wordHouse
    }).remove({
      success: res => {
        console.log('[数据库] [删除记录] 成功：', res)
        // 删除以后再次更新本地单词数据
        hh.Get_all_added_word();
      },
      fail: err => {
        console.log('[数据库] [删除记录] 失败：', err)
      }
    })
  },
  // 添加一个单词数据到云开发数据库
  insert_a_wordData_to_cloudDb(key, value, explainText, wordHouse_Name) {
    var hh = this
    return new Promise(function (resolve, reject) {
      var NowDate = hh.Get_Now_Date()
      const db = wx.cloud.database()
      db.collection('word').add({
        data: {
          key: key,
          value: value,
          explainText: explainText,
          the_WordHouse_word_belongTo: wordHouse_Name,
          Add_time: NowDate,
          review_plan: hh.globalData.review_plan.toString(),
          study_time: NowDate,
          imageID: "无"
        },
        success: res => {
          console.log('[数据库] [新增记录] 成功，记录 _id: ', res)
          resolve(res)
        },
        fail: err => {
          console.error('[数据库] [新增记录] 失败：', err)
          reject("插入数据失败")
        }
      })
    });
  },
  // 获取一个词库对应的所有单词
  Get_Allword_on_a_wordHouse(wordHouse_name) {
    var hh = this
    return new Promise(function (resolve, reject) {
      const db = wx.cloud.database()
      // 查询当前用户所有的 counters
      db.collection('word').where({
        the_WordHouse_word_belongTo: wordHouse_name
      }).get({
        success: res => {
          console.log('[数据库] [查询词库记录] 成功: ', res.data)
          if (res.data.length != 0) {
            resolve(res.data)
          } else {
            var review_words = []
            resolve(review_words)
          }
        },
        fail: err => {
          console.error('[数据库] [查询词库记录] 失败：', err)
          var review_words = []
          reject(review_words)
        }
      })
    });
  },
  // 用本地的所有单词数据获取某词库的记录数量
  Get_a_wordHouse_length(wordHouse_name) {
    var hh = this
    var all_word = hh.globalData.all_added_word
    console.log(all_word)
    var the_wordHouse_len = 0
    for (var i = 0; i < all_word.length; i++) {
      if (all_word[i].the_WordHouse_word_belongTo == wordHouse_name) {
        the_wordHouse_len++
      }
    }
    return the_wordHouse_len
  },
  Get_a_word_info_for_localData(wordName) {
    var hh = this
    var all_word = hh.globalData.all_added_word
    for (var i = 0; i < all_word.length; i++) {
      if (all_word[i].key == wordName) {
        return all_word[i]
      }
    }
  },
  // 云开发函数 获取某个单词的全部信息
  Get_a_word_info_for_cloud(word_id) {
    console.log('进入了云开发函数获取某个单词全部信息', word_id)
    var hh = this
    return new Promise(function (resolve, reject) {
      const db = wx.cloud.database()
      db.collection('word').where({
        _id: word_id
      }).get({
        success: res => {
          console.log('[数据库] [查询单词全部信息] 成功: ', res.data)
          if (res.data.length != 0) {
            resolve(res.data[0])
          } else {
            resolve("未发现信息")
          }
        },
        fail: err => {
          console.error('[数据库] [查询单词全部信息] 失败：', err)
          reject("未发现信息")
        }
      })
    })
  },
  // 从云开发中删除一个单词
  delete_a_word(word_id) {
    console.log('进入了删除单个记录函数', word_id)
    var hh = this
    return new Promise(function (resolve, reject) {
      const db4 = wx.cloud.database()
      db4.collection('word').doc(word_id).remove({
        success: res => {
          console.log('[数据库] [删除记录] 成功：', res)
          // 删除以后再次更新本地单词数据
          resolve("删除记录成功")
        },
        fail: err => {
          console.log('[数据库] [删除记录] 失败：', err)
          reject("删除记录失败")
        }
      })
    })

  },
  // 监测单个记录是否存在于云开发数据库中
  check_is_exist_a_word(word_name) {
    return new Promise(function (resolve, reject) {
      console.log('进入了监测单个记录是否存在函数', word_name)
      const db = wx.cloud.database()
      // 查询当前用户所有的 counters
      db.collection('word').where({
        key: word_name
      }).get({
        success: res => {
          console.log('[数据库] [查询词库记录] 成功: ', res.data)
          if (res.data.length != 0) {
            resolve(true)
          } else {
            resolve(false)
          }
        },
        fail: err => {
          console.error('[数据库] [查询词库记录] 失败：', err)
          reject(false)
        }
      })
    })
  },








  //杂项函数
  // 获取当前的日期
  Get_Now_Date() {
    var date = new Date()
    // console.log('现在的日期是： ', date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate())
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
  },
  // 获取当前的日期的时间戳
  Get_Now_Date_for_mi() {
    var date = new Date()
    var mi = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
    return mi
  },
  // 相似函数 大于0表示存在相同的字符
  similar: function (s, t, f) {
    if (!s || !t) {
      return 0
    }
    var l = s.length > t.length ? s.length : t.length
    var n = s.length
    var m = t.length
    var d = []
    f = f || 3
    var min = function (a, b, c) {
      return a < b ? (a < c ? a : c) : (b < c ? b : c)
    }
    var i, j, si, tj, cost
    if (n === 0) return m
    if (m === 0) return n
    for (i = 0; i <= n; i++) {
      d[i] = []
      d[i][0] = i
    }
    for (j = 0; j <= m; j++) {
      d[0][j] = j
    }
    for (i = 1; i <= n; i++) {
      si = s.charAt(i - 1)
      for (j = 1; j <= m; j++) {
        tj = t.charAt(j - 1)
        if (si === tj) {
          cost = 0
        } else {
          cost = 1
        }
        d[i][j] = min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost)
      }
    }
    let res = (1 - d[n][m] / l)
    return res.toFixed(f)
  },
  // 获取指定日期 添加 指定天数 以后的 日期
  Get_add_date(startDate, add_day_num) {
    var date_arr = startDate.split("-")
    var the_reviewDate = new Date(parseInt(date_arr[0]), parseInt(date_arr[1]) - 1, parseInt(date_arr[2]) + parseInt(add_day_num))
    return the_reviewDate.getFullYear() + "-" + (the_reviewDate.getMonth() + 1) + "-" + the_reviewDate.getDate()
  },
  // 判断一个日期是否大于或等于另外一个日期
  is_review_word(new_time, word_study_time) {
    var newTime = new_time.split("-")
    var wordStudyTime = word_study_time.split("-")
    if (newTime[0] == wordStudyTime[0]) {
      if (newTime[1] == wordStudyTime[1]) {
        if (newTime[2] == wordStudyTime[2]) {
          return true
        } else if (newTime[2] > wordStudyTime[2]) {
          return true
        } else if (newTime[2] < wordStudyTime[2]) {
          return false
        }
      } else if (newTime[1] > wordStudyTime[1]) {
        return true
      } else if (newTime[1] < wordStudyTime[1]) {
        return false
      }
    } else if (newTime[0] > wordStudyTime[0]) {
      return true
    } else if (newTime[0] < wordStudyTime[0]) {
      return false
    }

  },
  // 监测字符串是否存在空格
  check_space(text) {
    if (text.match(/[ ]/g) == null) {
      return false
    } else {
      return true
    }
  },
  // 监测字符串是否不存在 除数字字母汉字以外的 字符
  check_sta_name(text) {
    if (text.match(/[^a-zA-Z0-9\u4e00-\u9fa5]/g) == null) {
      return true
    } else {
      return false
    }
  },
  // 从字符串中英文和中文之间加换行符号
  Get_string_Line_feed(str) {
    // 如果输入的参数 为空 那么不执行任何操作直接返回
    if (str.length != 0) {
      var split_arr = str.match(/[a-zA-Z][\u4e00-\u9fa5]/g)
      // 如果词性只有一个 不存在先是英文紧接中的的字符 那么不需要进行任何操作直接返回
      if (split_arr != null) {
        var split_arr_len = split_arr.length
        for (var i = 0; i < split_arr_len; i++) {
          var str_arr = str.split(split_arr[i])
          var str_arr_len = str_arr.length
          if (str_arr_len == 2) {
            str = str_arr[0] + split_arr[i][0] + "\n" + split_arr[i][1] + str_arr[1]
          } else {
            str = str_arr[0] + split_arr[i][0] + "\n" + split_arr[i][1]
            var index_for_i_after = i + 1
            for (var j = 1; j < str_arr_len; j++) {
              if (index_for_i_after < split_arr_len) {
                str = str + str_arr[j] + split_arr[index_for_i_after]
              } else {
                str = str + str_arr[j]
              }
              index_for_i_after++
            }
          }
        }
      }
    }
    return str
  },
  // 从本地词库信息数组中获取 某个词库 的词库信息id openid 等等全部信息
  get_a_wordHouse_the_allinfo(wordHouseName) {
    var hh = this
    for (var i = 0; i < hh.globalData.wordHouse_infos.length; i++) {
      if (wordHouseName == hh.globalData.wordHouse_infos[i].WordHouseName) {
        return hh.globalData.wordHouse_infos[i]
      }
    }
  },






  // 图片等文件函数
  delete_a_image_on_cloudDb(fileID) {
    console.log("进入了删除云开发数据库图片函数", fileID)
    return new Promise(function (resolve, reject) {
      wx.cloud.deleteFile({
        fileList: [fileID],
        success: res => {
          console.log('删除图片文件成功', res)
          resolve("删除图片文件成功")
        },
        fail: err => {
          console.log('删除图片文件失败', err)
          reject("删除图片文件失败")
        }
      })
    })
  },
  Upload_a_image_to_cloudDb(filePath, imageName) {
    console.log("进入了上传云开发数据库图片函数", filePath, imageName)
    return new Promise(function (resolve, reject) {
      // 上传图片
      const cloudPath = "wordImage/publicWord/" + imageName + `-image${filePath.match(/\.[^.]+?$/)[0]}`
      wx.cloud.uploadFile({
        cloudPath,
        filePath,
        success: res => {
          console.log('上传文件成功', res)
          resolve(res)
        },
        fail: e => {
          console.error('[上传文件] 失败：', e)
          reject("上传文件失败")
        }
      })
    })
  },
  updata_imageID(word_id, imageID1) {
    var hh = this
    console.log("进入了更新图片id的函数", word_id, imageID1)
    return new Promise(function (resolve, reject) {
      const db = wx.cloud.database()
      db.collection('word').doc(word_id).update({
        data: {
          imageID: imageID1
        },
        success: res => {
          console.log('[数据库] [更换图片id] 成功: ', res)
          // 删除以后再次更新本地单词数据
          resolve("更新成功")
        },
        fail: err => {
          console.error('[数据库] [更换图片id] 失败：', err)
          reject("更新失败")
        }
      })
    })
  },







  // 连接到我的数据库函数
  // 自学习插入一条记录
  insert_a_item_To_MyWordDB(the_word, the_Chinese_Translation, the_word_belongTo, the_phrase) {
    return new Promise(function (resolve, reject) {
      wx.request({
        url: 'https://www.hkgt12d.xyz/WordData.php?action=insert_a_Item',
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        data: {
          word: the_word,
          Chinese_Translation: the_Chinese_Translation,
          word_belongTo: the_word_belongTo,
          phrase: the_phrase
        },
        success: result => {
          console.log("成功", result)
          resolve("插入数据成功")
        },
        fail: res => {
          console.log("失败", res)
          reject("插入数据失败")
        }
      })
    });
  },
  // 获取数据库的单词数据
  get_a_item_on_MyWordDb(the_word) {
    return new Promise(function (resolve, reject) {
      wx.request({
        url: 'https://www.hkgt12d.xyz/WordData.php?action=get_a_Item',
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        data: {
          word: the_word,
        },
        success: result => {
          console.log(result)
          // resolve(result.data.word_data_items[0])
          resolve(result.data)
        },
        fail: res => {
          console.log("失败", res)
          reject("失败了")
        }
      })
    });
  },





  globalData: {
    // 用户词库表的id
    wordHouse_Id: "12",
    // 用户的openid
    openid: "12",
    // 用户的词库
    WordHouseQuery: [],
    // 用户的词库信息(第一个元素包含词库名和信息还有_id 其他每个元素除了这三还有用户的openid)
    wordHouse_infos: [],


    // 用户的复习计划
    review_plan: [],
    // 用户复习计划表的id
    review_form_Id: "12",


    // 用户的所有的签到打卡的日期
    Register_AllregTime_for_mi: [],
    // 用户打卡签到表的id
    Register_id: "12",
    // 用户的最大打卡天数
    Register_max_reg_num: "-1",
    // 用户的连续打卡天数
    continue_reg_num: "-1",
    // 用户的所有打卡天数
    allReg_num: "-1",


    // 用户的所有添加的单词
    all_added_word: [],

  }


  // 每个单词的框架格式
  // var all_word = []
  // for (var i = 0; i < res.data.length; i++) {
  //   var element = {}
  //   element._id = res.data[i]._id
  //   element.key = res.data[i].key
  //   element.value = res.data[i].value
  //   element.explainText = res.data[i].explainText
  //   element.the_WordHouse_word_belongTo = res.data[i].the_WordHouse_word_belongTo
  //   element.Add_time = res.data[i].Add_time
  //   element.review_plan = res.data[i].review_plan
  //   element.study_time = res.data[i].study_time
  //   all_word.push(element)
  // }
  // hh.globalData.all_added_word = all_word

  // 导航栏备份
  // "tabBar": {
  //   "color": "#000000",
  //   "selectedColor": "#3974c7",
  //   "list": 
  //   [
  //     {
  //     "pagePath": "pages/main/main",
  //     "text": "首页",

  //     "iconPath": "/ima/会场2.png",
  //     "selectedIconPath": "/ima/会场1.png"
  //     },

  //     {
  //     "pagePath": "pages/wordHouse/wordHouse",
  //     "text": "词库",
  //     "iconPath": "/ima/单位4.png",
  //     "selectedIconPath": "/ima/单位3.png"
  //     },

  //     {
  //       "pagePath": "pages/center/center",
  //       "text": "个人",
  //       "iconPath": "/ima/我的预约6.png",
  //       "selectedIconPath": "/ima/我的预约4.png"
  //     }
  //   ]
  // },

})