var app = getApp();
Page({
  data: {
    userInfo: {
      nickName: '未授权',
      avatarUrl: '../../images/nologinheadimg.png'
    },
    vip: '../../images/vip1.png'
  },
  tomycollect: function () {
    app.toLogin(function () {
      wx.navigateTo({
        url: '../mycollect/mycollect'
      })
    })
  },
  onShow: function (options) {
    let that = this;
    app.toLogin(function () {
      that.setData({
        userInfo: app.globalData.userInfo
      })
    })
  }
})