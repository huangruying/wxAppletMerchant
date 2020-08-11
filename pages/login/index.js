// pages/login/login.js
import { codoYzm , generateCodeImg , sendMsg , businessLogIn } from '../../api/login'
import { baseUrl } from '../../utils/myAxios'  
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: "",
    imgCode: "",
    code: "",
    url: "",
    openId: null,
    textCode: "发送验证码",
    timeId: null,
    tiems: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 从本地储存里拿到token
    const token = wx.getStorageSync('token')
    // const token = false
    // 如果有token
    if(token){
      wx.reLaunch({
        url: "/pages/index/index"
      })
    }else{
      var tis = this
      wx.login({
        success (res) {
          if (res.code) {
            tis.setData({
              openId: res.code
            })
            tis.getImg()
          } else {
            wx.showToast({
              title: '获取openId失败！',
              icon:"none",
              duration: 2000
            })
          }
        }
      })
    }
  },
  getInputPhone(e){
    this.setData({
      phone: e.detail.value
    })
  },
  getInputImgCode(e){
    this.setData({
      imgCode: e.detail.value
    })
  },
  async getCode(e){
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (this.data.tiems) {
      return false;
    }
    if(!this.data.imgCode){
      wx.showToast({
        title: '请输入图形验证码！',
        icon:"none",
        duration: 2000
      })
      return
    }else if(!this.data.phone){
      wx.showToast({
        title: '请输入手机号！',
        icon:"none",
        duration: 2000
      })
      return
    }else if(!myreg.test(this.data.phone)){
      wx.showToast({
        title: '手机号格式不正确！',
        icon:"none",
        duration: 2000
      })
      return
    }else{
     const res = await sendMsg({
      phone: this.data.phone,  
      verCode: this.data.imgCode,
      openid: this.data.openId
     })
     if(res.code == 205){
      wx.showToast({
        title: res.msg,
        icon:"none",
        duration: 2000
      })
      return
     }else{
      var num = 60;
      var timeId = this.data.timeId;
      timeId = setInterval(() => {
        if (num === 0) {
          clearInterval(timeId)
          this.setData({
            textCode: "发送验证码",
            tiems: false
          })
        } else {
          this.setData({
            tiems: true,
            textCode: "请等待" + num--
          })
        }
      }, 1000);
      wx.showToast({
        title: "请留意手机短信!",
        duration: 2000
      })
     }
    }
  },
  // 获取图形码
  async getImg(){
    // const res = await codoYzm({openid: this.data.openId})
    this.setData({
      url: baseUrl  + "/businessApplets/generateCodeImg" + "?date=" +new Date().valueOf() + "&openid=" + this.data.openId
    })
    // if(res.code == 200){
    //   this.setData({
    //     url: "http://192.168.0.160:8189/yuyuetrip/wash/businessApplets/generateCodeImg" + "?date=" +new Date().valueOf()
    //   })
    // }
  },
  // 登录
  async formSubmit(e) {
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if(!e.detail.value.phone){
      wx.showToast({
        title: '请输入手机号！',
        icon:"none",
        duration: 2000
      })
      return
    }else if(!myreg.test(e.detail.value.phone)){
      wx.showToast({
        title: '手机号格式不正确！',
        icon: "none",
        duration: 2000
      })
      return
    }else if(!e.detail.value.imgCode){
      wx.showToast({
        title: '请输入图形验证码！',
        icon: "none",
        duration: 2000
      })
      return
    }else if(!e.detail.value.code){
      wx.showToast({
        title: '请输入短信验证码！',
        icon: "none",
        duration: 2000
      })
      return
    }else{
      const res = await businessLogIn({
        phone: e.detail.value.phone,
        code: e.detail.value.code
      })
      if(res.code == 205){ // 图形验证码错误
        wx.showToast({
          title: res.msg,
          icon:"none",
          duration: 2000
        })
        return
      }else if(res.code == 200){
        console.log(res)
        wx.setStorage({
          key: "token",
          data: res.data.token
        })
        wx.setStorage({
          key: "dotName",
          data: res.data.dotName
        })
        wx.setStorage({
          key: "merchantId",
          data: res.data.id
        })
        wx.setStorage({
          key: "dotAbbreviation",
          data: res.data.dotAbbreviation
        })
        wx.setStorage({
          key: "storeImages",
          data: res.data.storeImages[0]
        })
        wx.reLaunch({
          url: "/pages/index/index"
        })
        wx.showToast({
          title: "登录成功！",
          duration: 2000
        })
      }else{
        wx.showToast({
          title: res.msg,
          icon:"none",
          duration: 2000
        })
      }
    }
  },
    /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideHomeButton()
  },
})