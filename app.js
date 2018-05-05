//app.js
App({
  onLaunch: function () {
    let that = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 获取用户信息
    wx.getUserInfo({
      success: res => {
        that.globalData.userInfo = res.userInfo
        if (that.userInfoReadyCallback) {
          that.userInfoReadyCallback(res)
        }
      }
    })
  },
  bindTel: function () {
    let that = this;
    wx.login({
      success: function (res) {
        let paras = {
          code: res.code
        }
        paras = JSON.stringify(paras);
        that.request('post', 'weixin/xcxAuthLogin.do', paras, function (res) {
          wx.showModal({
            title: '果果故事树',
            content: '为提供更好的服务，请前往绑定手机号',
            cancelText: '稍后绑定',
            cancelColor: '#666',
            confirmText: '去绑定',
            confirmColor: '#ff1f43',
            success: function (res) {
              if (res.confirm == true) {
                wx.navigateTo({
                  url: '../login/login',
                })
              } else if (res.cancel) {
                wx.showModal({
                  title: '果果故事树',
                  content: '您没有绑定手机号，数据无法同步',
                  confirmText: '确定',
                  confirmColor: '#ff1f43',
                  showCancel: false,
                  success: function (res) {
                    if (res.confirm == true) {

                    }
                  }
                })
              }
            }
          })
        })
      }
    })
  },
  toLogin: function (callback) {
    let that = this;
    that.callback = callback;
    let login = wx.getStorageSync('login');
    if (login == '') {
      wx.getSetting({
        success: function (res) {
          if (res.authSetting["scope.userInfo"]) {
            that.bindTel();
          } else {
            wx.showModal({
              title: '果果故事树',
              content: '果果故事树申请获得你的公开信息（昵称，头像等）',
              cancelText: '稍后设置',
              cancelColor: '#666',
              confirmText: '去设置',
              confirmColor: '#ff1f43',
              success: function (res) {
                if (res.confirm) {
                  wx.openSetting({
                    success: function (res) {
                      if (res.authSetting["scope.userInfo"] == true) {
                        console.log("用户已授权");
                      } else {
                        console.log("用户未授权");
                      }
                    }
                  })
                }
              }
            })
          }
        }
      })
    } else {
      that.callback();
    }
  },
  request: function (method, rurl, paras, okcallback) {
    wx.showLoading()
    let that = this;
    let timestamp = new Date().getTime();
    wx.request({
      url: that.globalData.crurl + rurl + "?timestamp=" + timestamp,
      data: paras,
      method: method,
      dataType: 'json',
      success: function (res) {
        if (res.data.state == true) {
          wx.hideLoading();
          okcallback(res);
        } else if (res.data.state == false) {
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: '操作失败',
            confirmColor: '#ff1f43',
            showCancel: false
          })
        }
      },
      fail: function (res) {
        wx.showModal({
          title: '提示',
          content: '服务器连接失败',
          confirmColor: '#ff1f43',
          showCancel: false
        })
      }
    })
  },
  random: function (arr, count) {
    let shuffled = arr.slice(0),
      i = arr.length,
      min = i - count,
      temp, index;
    while (i-- > min) {
      index = Math.floor((i + 1) * Math.random());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
    }
    return shuffled.slice(min);
  },
  collect: function (e, okcallback) {
    let that = this;
    let favorated = e.currentTarget.dataset.favorated;
    let paras = {
      melodyId: e.currentTarget.dataset.sid,
      accountId: wx.getStorageSync('accountId')
    }
    paras = JSON.stringify(paras);
    that.toLogin(function () {
      if (favorated == true) {
        that.request('post', 'app/favoriteMelody/delete.do', paras, function () {
          wx.showToast({
            title: '已取消收藏',
            icon: 'none'
          })
          okcallback();
        })
      } else if (favorated == false) {
        that.request('post', 'app/favoriteMelody/add.do', paras, function () {
          wx.showToast({
            title: '收藏成功',
            icon: 'none'
          })
          okcallback();
        })
      }
    });
  },
  loadMore: function (that, okcallback) {
    if (that.data.page + 1 > that.data.pageSize) {
      that.setData({ page: that.data.page })
      wx.showToast({
        title: '没有更多信息了',
        icon: 'none'
      })
      return false;
    }
    that.setData({ page: that.data.page + 1 });
    okcallback();
  },
  globalData: {
    userInfo: {
      nickName: '未授权',
      avatarUrl: '../../images/nologinheadimg.png'
    },
    crurl: 'https://admin.guostory.com/',
    // crurl: 'http://10.96.155.108:8080/storytree/',
    sid: '344',
    aname: '爬呀爬呀小乌龟',
  }
})