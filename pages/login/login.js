var app = getApp();
Page({
  data: {
    phone: '',
    token: '',
    tokentxt: '获取验证码',
    getTokenTimeid: 0
  },
  // set手机号
  checkTel: function (e) {
    var that = this;
    that.setData({
      phone: e.detail.value
    })
  },
  // set验证码
  checkToken: function (e) {
    var that = this;
    that.setData({
      token: e.detail.value
    })
  },
  // 获取验证码
  getToken: function (e) {
    let that = this;
    let getTokenTime = 60;
    if (e.currentTarget.dataset.id == 0) {
      if (that.data.phone.length == 0) {
        wx.showToast({
          title: '请输入手机号',
          icon: 'none'
        })
        return false;
      }
      if (that.data.phone.length != 11) {
        wx.showToast({
          title: '手机号码长度为11位',
          icon: 'none'
        })
        return false;
      }
      let myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
      if (!myreg.test(that.data.phone)) {
        wx.showToast({
          title: '手机号码有误',
          icon: 'none'
        })
        return false;
      }
      that.setData({
        getTokenTimeid: 1
      })
      let tokentime = setInterval(function () {
        getTokenTime--;
        if (getTokenTime == 0) {
          getTokenTime = 60;
          that.setData({
            tokentxt: '重新获取验证码',
            getTokenTimeid: 0
          })
          clearInterval(tokentime);
        } else {
          that.setData({
            tokentxt: getTokenTime + 'S 后重新获取'
          })
        }
      }, 1000)
      let paras = {
        telephone: that.data.phone
      };
      paras = JSON.stringify(paras);
      app.request('post', 'sms/requestToken.do', paras, function (res) {
        wx.showToast({
          title: '验证码已发送',
          icon: 'none'
        })
      }, function () {
        wx.showToast({
          title: '验证码发送失败',
          icon: 'none'
        })
      });
    }
  },
  // 提交
  submitToken: function () {
    var that = this;
    if (that.data.phone.length == 0) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return false;
    }
    if (that.data.token.length == 0) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
      return false;
    }
    if (that.data.phone.length != 11) {
      wx.showToast({
        title: '手机号码长度为11位',
        icon: 'none'
      })
      return false;
    }
    if (that.data.token.length != 6) {
      wx.showToast({
        title: '验证码长度为6位',
        icon: 'none'
      })
      return false;
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(that.data.phone)) {
      wx.showToast({
        title: '手机号码有误',
        icon: 'none'
      })
      return false;
    }
    let paras = {
      telephone: that.data.phone,
      token: that.data.token
    };
    paras = JSON.stringify(paras);
    app.request('post', 'sms/verifyToken.do', paras, function (res) {
      wx.setStorageSync('login', true);
      wx.setStorageSync('getuserstate', "2");
      wx.setStorageSync('accountId', res.data.data.id);
      wx.getUserInfo({
        success: function (res) {
          app.globalData.userInfo = res.userInfo;
          wx.navigateBack(1);
        }
      })
    }, function () {
      wx.showToast({
        title: '登录失败，请重新登录',
        icon: 'none'
      })
    });
  }
})