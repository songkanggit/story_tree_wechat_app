var app = getApp();
var crurl = app.globalData.crurl;
Page({
  data: {
    clist: [
      {
        icon: '../../images/jgs.png',
        text: '讲故事'
      }, {
        icon: '../../images/teg.png',
        text: '听儿歌'
      }, {
        icon: '../../images/xzs.png',
        text: '学知识'
      }, {
        icon: '../../images/dgx.png',
        text: '读国学'
      }, {
        icon: '../../images/fl.png',
        text: '搜索'
      }
    ],
    alist: []
  },
  toplay: function (e) {
    wx.navigateTo({
      url: '../player/player?sid=' + app.globalData.sid + "&aname=" + app.globalData.aname
    })
  },
  toclassify: function (e) {
    if (e.currentTarget.dataset.cname == '搜索') {
      wx.navigateTo({
        url: '../search/search'
      })
    } else {
      wx.navigateTo({
        url: '../classify/classify?cname=' + e.currentTarget.dataset.cname
      })
    }
  },
  toalbum: function (e) {
    wx.navigateTo({
      url: '../albumInfo/albumInfo?aid=' + e.currentTarget.dataset.aid + "&aname=" + e.currentTarget.dataset.aname
    })
  },
  onLoad: function () {
    let that = this;
    let paras = {
      isPrecious: 'false'
    };
    paras = JSON.stringify(paras);
    app.request('post', 'album/queryList.do', paras, function (res) {
      let alist = app.random(res.data.data, 6);
      for (let i = 0; i < 6; i++) {
        alist[i].albumCoverImage = crurl + alist[i].albumCoverImage;
      }
      that.setData({
        alist: alist
      })
    })
  }
})
