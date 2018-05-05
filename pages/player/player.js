var app = getApp();
var crurl = app.globalData.crurl;
Page({
  data: {
    page: 1,
    slist: [],
    sobj: {},
    currentProcess: '00:00',
    currentProcessNum: 0,
    totalProcess: '00:00',
    totalProcessNum: 0,
    canSlider: false,
    pstate: false,
    plstate: true,
    pageSize: ''
  },
  tocollect: function (e) {
    let that = this;
    app.collect(e, function () {
      let sobj = that.data.sobj;
      sobj.favorated = !sobj.favorated;
      that.setData({
        sobj: sobj
      })
    });
  },
  rtime: function (duration) {
    let str = '';
    let minute = parseInt(duration / 60) < 10 ? ('0' + parseInt(duration / 60)) : (parseInt(duration / 60));
    let second = duration % 60 < 10 ? ('0' + parseInt(duration % 60)) : (parseInt(duration % 60));
    str = minute + ':' + second;
    return str;
  },
  setplay: function () {
    let that = this;
    let sobj = that.data.sobj;
    wx.playBackgroundAudio({
      dataUrl: sobj.melodyFilePath,
      title: sobj.melodyName,
      coverImgUrl: sobj.melodyCoverImage,
      success: function (res) {
        that.showPro();
        wx.hideLoading();
        wx.onBackgroundAudioPlay(function () {
          that.showPro();
          wx.hideLoading();
        });
      }
    });
  },
  play: function () {
    let that = this;
    let sobj = that.data.sobj;
    if (that.data.pstate == true) {
      wx.pauseBackgroundAudio();
    } else if (that.data.pstate == false) {
      that.setplay();
    };
  },
  showPro: function () {
    let that = this;
    let inv = setInterval(function () {
      wx.getBackgroundAudioPlayerState({
        success: function (res) {
          if (res.status == 1) {
            that.setData({
              currentProcessNum: res.currentPosition,
              currentProcess: that.rtime(res.currentPosition),
              totalProcessNum: res.duration,
              totalProcess: that.rtime(res.duration),
              pstate: true
            })
            that.autoplay();
          } else if (res.status == 2) {
            that.showPro();
          } else {
            that.setData({
              pstate: false
            })
            clearInterval(inv);
          }
        },
        fail: function () {
          console.log("播放状态获取失败");
        }
      });
    }, 1000);
  },
  changeplay: function (e) {
    console.log();
    wx.seekBackgroundAudio({
      position: e.detail.value,
      success: function () {
        console.log("控制音乐播放秒数为" + e.detail.value + "s")
      }
    })
  },
  songplay: function () {
    let that = this;
    let sobj = that.data.sobj;
    wx.showLoading();
    wx.getBackgroundAudioPlayerState({
      success: function (res) {
        that.setData({
          currentProcessNum: res.currentPosition,
          currentProcess: that.rtime(res.currentPosition),
          totalProcessNum: res.duration,
          totalProcess: that.rtime(res.duration),
          pstate: true
        })
        if (res.status == 1) {
          wx.pauseBackgroundAudio();
          that.setplay();
          wx.hideLoading();
        } else {
          that.setplay();
        }
      },
      fail: function () {
        wx.stopBackgroundAudio();
        that.setplay();
      }
    })
  },
  prev: function () {
    let that = this;
    let slist = that.data.slist;
    for (let i = 0; i < slist.length; i++) {
      if (app.globalData.sid == slist[i].id) {
        if ((i - 1) < 0) {
          app.globalData.sid = slist[slist.length - 1].id;
          that.setData({
            sobj: slist[slist.length - 1]
          })
        } else {
          app.globalData.sid = slist[i - 1].id;
          that.setData({
            sobj: slist[i - 1]
          })
        }
        that.songplay();
        break;
      }
    }
  },
  next: function () {
    let that = this;
    let slist = that.data.slist;
    for (let i = 0; i < slist.length; i++) {
      if (app.globalData.sid == slist[i].id) {
        if ((i + 1) > (slist.length - 1)) {
          app.globalData.sid = slist[0].id;
          that.setData({
            sobj: slist[0]
          })
        } else {
          app.globalData.sid = slist[i + 1].id;
          that.setData({
            sobj: slist[i + 1]
          })
        }
        that.songplay();
        break;
      }
    }
  },
  cplay: function (e) {
    let that = this;
    let slist = that.data.slist;
    app.globalData.sid = e.currentTarget.dataset.sid;
    for (let i = 0; i < slist.length; i++) {
      if (e.currentTarget.dataset.sid == slist[i].id) {
        that.setData({
          sobj: slist[i]
        })
        that.songplay();
        break;
      }
    }

  },
  autoplay: function () {
    let that = this;
    if (that.data.currentProcessNum == that.data.totalProcessNum) {
      that.next();
    }
  },
  showpl: function () {
    let that = this;
    that.setData({
      plstate: false
    })
  },
  hidepl: function () {
    let that = this;
    that.setData({
      plstate: true
    })
  },
  toloadMore: function () {
    let that = this;
    app.loadMore(that, function () {
      let paras = {
        page: that.data.page,
        melodyAlbum: app.globalData.aname,
        accountId: wx.getStorageSync('accountId')
      };
      paras = JSON.stringify(paras);
      let oldslist = that.data.slist;
      app.request('post', 'melody/queryList.do', paras, function (res) {
        let slist = res.data.data.melodyList;
        for (let i = 0; i < slist.length; i++) {
          slist[i].melodyCoverImage = crurl + slist[i].melodyCoverImage;
          slist[i].melodyFilePath = crurl + slist[i].melodyFilePath;
          oldslist.push(slist[i]);
        }
        that.setData({
          slist: oldslist
        })
      })
    })
  },
  onLoad: function (options) {
    let that = this;
    app.globalData.sid = options.sid;
    app.globalData.aname = options.aname;
    let paras = {
      page: that.data.page,
      melodyAlbum: app.globalData.aname,
      accountId: wx.getStorageSync('accountId')
    };
    paras = JSON.stringify(paras);
    app.request('post', 'melody/queryList.do', paras, function (res) {
      let slist = res.data.data.melodyList;
      for (let i = 0; i < slist.length; i++) {
        slist[i].melodyCoverImage = crurl + slist[i].melodyCoverImage;
        slist[i].melodyFilePath = crurl + slist[i].melodyFilePath;
        if (app.globalData.sid == slist[i].id) {
          that.setData({
            sobj: slist[i]
          })
          that.songplay()
        }
      }
      that.setData({
        slist: slist,
        pageSize: res.data.pageSize
      })
    })
  }
})