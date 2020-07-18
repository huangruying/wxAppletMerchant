// pages/index/index.js
import Dialog from '@vant/weapp/dialog/dialog';
import { cardTitle, letter } from '../../utils/plateNumber'
import { businessLogOut , codeWriteOff } from '../../api/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeImages: "",
    dotAbbreviation: "",
    merchantName: "",
    redeemCode: "",
    plateNumber: "",
    phone: "",
    userName: "",
    showPopup: false,
    plate: "粤",
    columns: [
      // 第一列
      {
          values: cardTitle,
          defaultIndex: 0, // 默认选中
        },
        // 第二列
        // {
        //   values: letter,
        //   defaultIndex: 0,
        // }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let merchantName = wx.getStorageSync('dotName')
      let dotAbbreviation = wx.getStorageSync('dotAbbreviation')
      let storeImages = wx.getStorageSync('storeImages')
      this.setData({
        merchantName: merchantName,
        dotAbbreviation: dotAbbreviation,
        storeImages: storeImages
      })
  },
  platePopup(){
    this.setData({
      showPopup: true
    })
  },
  onCancel(){
    this.setData({
      showPopup: false
    })
  },
  // 选择车牌
  onConfirm(event){
    const { value, index } = event.detail;
    // console.log(value)
    this.setData({
      showPopup: false,
      // plate: value[0]  + value[1]
      plate: value[0]
    })
  },
  // 扫一扫
  scanCode(){
    const thx = this
    wx.scanCode({
      success (res) {
        thx.setData({
          redeemCode: res.result
        })
      }
    })
  },
  // 退出登录
  outLogin(){
    Dialog.confirm({
      title: '确定退出登录？',
      message: '退出后将返回登录页。'
    })
      .then(() => {
        businessLogOut().then(res=>{
          if(res.code == 200){
            wx.showToast({
              title: '退出成功！',
              duration: 2000
            })
            wx.removeStorageSync('token')
            wx.removeStorageSync('dotName')
            wx.removeStorageSync('merchantId')
            wx.removeStorageSync('dotAbbreviation')
            wx.removeStorageSync('storeImages')
            wx.reLaunch({
                url: "/pages/login/index"
            })
          }else{
            wx.showToast({
              title: res.msg,
              icon:"none",
              duration: 2000
            })
          }
        })
      })
      .catch(() => {
        // on cancel
      });
  },
  // 核销
  async submit(){
    const data = this.data
    const obj = {}
    if(data.redeemCode){
      obj.couponCode = data.redeemCode
    }else{
      wx.showToast({
        title: "请扫码识别券码号或手动输入券码！",
        icon:"none",
        duration: 2000
      })
      return
    }
    if(data.phone){
      obj.phone = data.phone
    }
    if(data.plateNumber){
      obj.licensePlate = data.plate + data.plateNumber
    }
    if(data.userName){
      obj.name = data.userName
    }
    let merchantId = wx.getStorageSync('merchantId')
    obj.businessId = merchantId
    const res = await codeWriteOff(obj)
    if(res.code == 200){
      this.setData({
        redeemCode: "",
        plateNumber: "",
        phone: "",
        userName: "",
      })
      wx.showToast({
        title: "核销成功！",
        duration: 3000
      })
    }else{
      wx.showToast({
        title: res.msg,
        icon:"none",
        duration: 2000
      })
    }
  },
  order(){
    wx.navigateTo({
      url: "/pages/order/index"
    })
  },
  checking(){
    wx.navigateTo({
      url: "/pages/reconciliation/index"
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  inputCode(e){
    this.setData({
      redeemCode: e.detail
    })
  },
  inputNumber(e){
    this.setData({
      plateNumber: e.detail
    })
  },
  inputPhone(e){
    this.setData({
      phone: e.detail
    })
  },
  inputUserName(e){
    this.setData({
      userName: e.detail
    })
  }
})