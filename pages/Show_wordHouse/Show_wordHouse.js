// pages/Show_wordHouse/Show_wordHouse.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordHouse_name: "",


    review_words: [],

    // 空状态的配置
    show_emp_win: false,
    backgroundColor: "#EFEFEF",

    // 当在单词信息页面返回时监测是否是删除了单词再返回  注意删除后重置为空
    delete_item_id: ""

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
    for(var i=0;i<hh.data.review_words.length;i++){
      if(hh.data.review_words[i]._id == hh.data.delete_item_id){
        hh.data.review_words.splice(hh.data.review_words.indexOf(hh.data.review_words[i]),1)
        console.log('删除后重新加载的数组', hh.data.review_words)
        hh.setData({
          review_words: hh.data.review_words
        })
      }
    }
  },
  onLoad: function (options) {
    var hh = this
    console.log('当前点击的词库是：', options.id)
    this.setData({
      wordHouse_name: options.id
    })

    app.Get_Allword_on_a_wordHouse(hh.data.wordHouse_name).then(function (value) {
      hh.setData({
        review_words: value
      })
      if (hh.data.review_words.length == 0) {
        hh.setData({
          show_emp_win: true,
          backgroundColor: "white"
        })
      } else {
        hh.setData({
          show_emp_win: false,
          backgroundColor: "#EFEFEF"
        })
      }
    })
  },










  // 单词列表的配置
  To_word_info(e) {
    console.log(e)
    console.log(e.currentTarget.dataset.text)
    var text = e.currentTarget.dataset.text
    wx.navigateTo({
      url: '../word_info/word_info?_id=' + text._id.replace(/[?&'"/]/g, ""),
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