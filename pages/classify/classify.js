var app = getApp();
var crurl = app.globalData.crurl;
Page({
  data: {
    page: 1,
    alist: [],
    cname: '',
    paeSize: ''
  },
  toplay: function (e) {
    wx.navigateTo({
      url: '../player/player?sid=' + app.globalData.sid + "&aname=" + app.globalData.aname
    })
  },
  toalbum: function (e) {
    wx.navigateTo({
      url: '../albumInfo/albumInfo?aid=' + e.currentTarget.dataset.aid + "&aname=" + e.currentTarget.dataset.aname
    })
  },
  toloadMore: function () {
    let that = this;
    app.loadMore(that, function () {
      let paras = {
        page: that.data.page,
        albumTag: that.data.cname,
        isPrecious: 'false'
      };
      paras = JSON.stringify(paras);
      let oldalist = that.data.alist;
      app.request('post', 'album/queryList.do', paras, function (res) {
        let alist = res.data.data
        for (let i = 0; i < alist.length; i++) {
          alist[i].albumCoverImage = crurl + alist[i].albumCoverImage;
          oldalist.push(alist[i]);
        }
        that.setData({
          alist: oldalist
        })
      })
    })
  },
  onLoad: function (options) {
    if (options.cname == '') {
      wx.setNavigationBarTitle({
        title: '更多专辑'
      })
    } else {
      wx.setNavigationBarTitle({
        title: options.cname
      })
    }
    let that = this;
    that.setData({
      cname: options.cname
    })
    let paras = {
      page: that.data.page,
      albumTag: options.cname,
      isPrecious: 'false'
    };
    paras = JSON.stringify(paras);
    app.request('post', 'album/queryList.do', paras, function (res) {
      let alist = res.data.data
      for (let i = 0; i < alist.length; i++) {
        alist[i].albumCoverImage = crurl + alist[i].albumCoverImage;
      }
      that.setData({
        alist: alist,
        pageSize: res.data.pageSize
      })
    })
  }
})