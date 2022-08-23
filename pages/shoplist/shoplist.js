// pages/shoplist/shoplist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     query:{},
     // 所有的商铺信息
     shopList:[],
     // 默认获取第1页数据
     page:1,
     // 每页获取10条数据
     pageSize:10,
     // 总数据大小
     total:0,
     isLoading:false
  },

  // 联系卖家
  // https://www.cnblogs.com/obge/p/13890258.html
  contactShop(e) {
     console.log(e.currentTarget.dataset)
     const phoneNum = e.currentTarget.dataset.phone
     wx.makePhoneCall({
       phoneNumber: phoneNum,
     })
  },

  getShopList(cb) {
     this.setData({
       isLoading:true
     })
     // 显示加载效果
     wx.showLoading({
       title: '数据加载中...',
     })
     wx.request({
      url: `https://www.escook.cn/categories/${this.data.query.id}/shops`,
      method: 'GET',
      data: {
        _page: this.data.page,
        _limit: this.data.pageSize
      },
       success: (res)=> {
         // console.log(res)
         this.setData({
           // 拼接老数据与新数据
          shopList: [...this.data.shopList, ...res.data],
           total:res.header['X-Total-Count'] - 0
         })
       },
       complete:()=> {
         // 隐藏加载效果
         wx.hideLoading()
         this.setData({
          isLoading:false
        })
        // 停止下拉刷新
        // wx.stopPullDownRefresh()
        cb && cb()
       }
     })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      query:options
    })
    this.getShopList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    wx.setNavigationBarTitle({
      title: this.data.query.title,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
      // 重置关键数据
      // 发起数据请求
      this.setData({
        page:1,
        shopList:[],
        total:0
      })
      this.getShopList(() => {
        wx.stopPullDownRefresh()
      })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
     // 判断数据是否加载完成
     if (this.data.page * this.data.pageSize >= this.data.total) {
       return wx.showToast({
         title: '数据加载完毕！',
         icon:'none'
       })
     }
     if (this.data.isLoading) {return}
     // console.log("ok")
     this.setData({
      page: this.data.page + 1
    })
     this.getShopList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})