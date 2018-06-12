var app = getApp();
Page({
  data: {
    userInfo: {
      nickName: '授权',
      avatarUrl: '../../images/nologinheadimg.png',
    },
    getuserstate: null
  },
  getuserinfo: function (e) {
    let that = this;
    if (e.detail.errMsg == "getUserInfo:ok") {
      that.onShow();
    }
  },
  tomycollect: function () {
    app.toLogin(function () {
      wx.navigateTo({
        url: '../mycollect/mycollect'
      })
    })
  },
  onShow: function () {
    let that = this;
    let getuserstate = wx.getStorageSync('getuserstate');
    that.setData({
      getuserstate: getuserstate
    })
    app.toLogin(function () {
      that.setData({
        userInfo: app.globalData.userInfo
      })
    })
  }
})