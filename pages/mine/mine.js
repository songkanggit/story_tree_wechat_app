var app = getApp();
Page({
  data: {
    userInfo: {
      nickName: '绑定果果账号',
      avatarUrl: '../../images/nologinheadimg.png',
    },
    vip: '../../images/vip1.png',
    getuserstate: null
  },
  getuserinfo:function(e){
    let that = this;
    if (e.detail.errMsg == "getUserInfo:ok"){
      wx.setStorageSync('getuserstate', "1");
      that.onShow();
    }
  },
  toLogin:function(){
    app.toLogin(function(){

    })
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
    console.log(getuserstate)
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