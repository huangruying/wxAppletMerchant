// pages/reconciliation/reconciliation.js
import { findBusinessAppletsMonthly } from '../../api/reconciliation'
Page({
  data: {
    merchantId: null,
    pageSize: 15,
    pageNum: 1,
    dataList: [],
    nodeData: false,
    loading: false,
    total: ""
  },
  // 初始化
  onLoad: function (options) {
    
  },
  // 页面上拉触底事件的处理函数
  onReachBottom: function () {
    // 下拉触底，先判断是否有请求正在进行中
    // 以及检查当前请求页数是不是小于数据总页数，如符合条件，则发送请求
    if (!this.data.loading && this.data.dataList.length < this.data.total) {
      this.apiGetData(this.data.pageNum + 1)
    }else{
      this.setData({
        nodeData: true
      })
    }
  },
  // 获取数据
  apiGetData(pageNum){
    this.setData({
      loading: true
    })
    findBusinessAppletsMonthly({
      businessId: this.data.merchantId,
      pageSize: this.data.pageSize,
      pageNum: pageNum
    }).then(res=>{
      if(res.code == 200 && res.data){
        let data = this.data.dataList
        this.setData({
          dataList: data.concat(res.data),
          nodeData: false,
          loading: false,
          total: res.total
        })
        if(!(this.data.dataList.length < this.data.total)){
          this.setData({
            nodeData: true
          })
        }
      }else{
        this.setData({
          nodeData: true,
          loading: false
        })
      }
    })
  },
  // 去确认
  goDetails(e){
    let { count } = e.currentTarget.dataset
    wx.navigateTo({
      url: "/pages/checkTheDetails/index?month=" + count
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let merchantId = wx.getStorageSync('merchantId')
    this.setData({
      merchantId: merchantId,
      dataList: []
    })
    this.apiGetData(1)
    wx.hideHomeButton()
  },
})