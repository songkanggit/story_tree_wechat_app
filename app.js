//app.js
App({
  onLaunch: function () {
    let that = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    let paras = {
      accountId: wx.getStorageSync('accountId'),
      isPrecious: 'false'
    };
    that.request('post', 'melody/queryList.do', paras, function (res) {
      let slist = res.data.data.melodyList;
      for (let i = 0; i < slist.length; i++) {
        slist[i].melodyCoverImage = that.globalData.crurl + slist[i].melodyCoverImage;
        slist[i].melodyFilePath = that.globalData.crurl + slist[i].melodyFilePath;
      }
      that.globalData.sid = slist[0].id;
      that.globalData.slist = slist;
    }, function () {
      wx.showToast({
        title: '初始化播放列表加载失败',
        icon: 'none'
      })
    })
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
  bindTel: function (callback) {
    let that = this;
    wx.getUserInfo({
      withCredentials: true,
      success: function (res) {
        let encryptedData = res.encryptedData;
        let iv = res.iv;
        wx.login({
          success: function (res) {
            let paras = {
              encryptedData: encryptedData,
              iv: iv,
              registerPlatform: 'wx_xcx',
              accessCode: res.code
            }
            paras = JSON.stringify(paras);
            that.request('post', 'sms/thirdPartyLogin.do', paras, function (res) {
              wx.setStorageSync('login', true);
              wx.setStorageSync('getuserstate', "1");
              wx.setStorageSync('accountId', res.data.data.id);
              wx.getUserInfo({
                success: function (res) {
                  that.globalData.userInfo = res.userInfo;
                  that.toLogin(callback);
                }
              })
            }, function () {
              that.bindTel(callback);
            })
          }
        })
      }
    })
  },
  toLogin: function (callback) {
    let that = this;
    let login = wx.getStorageSync('login');
    if (login == '') {
      wx.getSetting({
        success: function (res) {
          if (res.authSetting["scope.userInfo"]) {
            that.bindTel(callback);
          } else {
            wx.setStorageSync('getuserstate', "0");
            wx.showModal({
              title: '故事树',
              content: '故事树申请获得你的公开信息（昵称，头像等）,请先授权',
              cancelText: '取消',
              cancelColor: '#666',
              confirmText: '确定',
              confirmColor: '#ff1f43',
              success: function (res) {
                if (res.confirm) {
                  wx.switchTab({
                    url: '../mine/mine',
                  })
                }
              }
            })
          }
        }
      })
    } else {
      callback();
    }
  },
  request: function (method, rurl, paras, okcallback, nocallback) {
    wx.showLoading({
      title: 'loading···'
    })
    let that = this;
    let timestamp = new Date().getTime();
    wx.request({
      url: that.globalData.crurl + rurl + "?timestamp=" + timestamp,
      data: paras,
      method: method,
      dataType: 'json',
      success: function (res) {
        wx.hideLoading();
        if (res.data.state == true || res.data.code == '0000') {
          okcallback(res);
        } else if (res.data.state == false || res.data.code != '0000') {
          nocallback();
        }
      },
      fail: function (res) {
        wx.showModal({
          title: '故事树',
          content: 'sorry 服务器已经离开了地球',
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
            title: '取消收藏',
            icon: 'none'
          })
          okcallback();
        }, function () {
          wx.showToast({
            title: '取消收藏失败',
            icon: 'none'
          })
        })
      } else if (favorated == false) {
        that.request('post', 'app/favoriteMelody/add.do', paras, function () {
          wx.showToast({
            title: '已收藏',
            icon: 'none'
          })
          okcallback();
        }, function () {
          wx.showToast({
            title: '收藏失败',
            icon: 'none'
          })
        })
      }
    });
  },
  loadMore: function (that, okcallback) {
    if (that.data.page + 1 > that.data.pageSize) {
      that.setData({ page: that.data.page })
      wx.showToast({
        title: '没有更多了',
        icon: 'none'
      })
      return false;
    }
    that.setData({ page: that.data.page + 1 });
    okcallback();
  },
  globalData: {
    userInfo: {
      nickName: '故事树',
      avatarUrl: '../../images/nologinheadimg.png'
    },
    crurl: 'https://admin.guostory.com/',
    // crurl: 'http://192.168.0.105:8080/storytree/',
    sid: '',
    slist: []
  }
})