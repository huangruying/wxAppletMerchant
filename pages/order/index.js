// pages/order/index.js
import { findBusinessAppletsByMonth } from '../../api/order'
Page({
  data: {
    minDate: new Date(2020, 0, 1).getTime(),
    defaultDate: [],
    maxDate: 0,
    showCalendar: false,
    start: "",
    end: "",
    merchantId: null,
    pageSize: 15,
    pageNum: 1,
    dataList: [],
    nodeData: false,
    loading: false,
    total: "",
    totalPrice: ""
  },
  // 生命周期函数--监听页面加载
  onLoad: function (options) {
     //今天的时间
     var day = new Date();
     day.setTime(day.getTime());
     var data = this.formatDate(day)
    //  let str = day.getMonth() + 1
    //  if(String(str).length === 1){
    //   str = "0" + str
    //  }
    var defaultDate1 = new Date(data)
    var defaultDate2 = new Date(`${day.getFullYear()}-${day.getMonth() + 1}-01`)
    var time1 = defaultDate1.getTime()
    var time2 = defaultDate2.getTime()
     this.setData({
      end: data,
      start: `${day.getFullYear()}-${day.getMonth() + 1}-01`,
      defaultDate: [time1,time2]
     })
    let merchantId = wx.getStorageSync('merchantId')
    this.setData({
      merchantId: merchantId
    })
    this.apiGetData(1)
  },
  // 获取日期
  getDate(){
    this.setData({
      showCalendar: true
    })
  },
  onClose() {
    this.setData({ showCalendar: false });
  },
  // 选择时间段
  onConfirm(event) {
    const [start, end] = event.detail;
    this.setData({
      showCalendar: false,
      dataList: [],
      start: this.formatDate(start),
      end: this.formatDate(end)
    })
    this.apiGetData(1)
  },
  // 格式化时间
  formatDate(date) {
    date = new Date(date);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  },
  getList(){
    this.setData({
      dataList: []
    })
    this.apiGetData(1)
  },
  // 获取数据
  apiGetData(pageNum){
    this.setData({
      loading: true
    })
    findBusinessAppletsByMonth({
      businessId: this.data.merchantId,
      pageSize: this.data.pageSize,
      pageNum: pageNum,
      startTime: this.data.start,
      endTime: this.data.end
    }).then(res=>{
      if(res.code == 200 && res.data){
        res.data.map(v=>{
          v.createTime = v.createTime.split(" ")[0]
        })
        let data = this.data.dataList
        this.setData({
          dataList: data.concat(res.data),
          nodeData: false,
          loading: false,
          total: res.total,
          totalPrice: res.totalPrice
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
// 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function () {

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})