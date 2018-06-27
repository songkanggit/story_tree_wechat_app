var app = getApp();
var crurl = app.globalData.crurl;
var imgrurl = app.globalData.imgrurl;
Page({
  data: {
    page: 1,
    alist: [],
    cname: '',
    paeSize: ''
  },
  toplay: function(e) {
    wx.navigateTo({
      url: '../player/player?sid=' + app.globalData.sid
    })
  },
  toalbum: function(e) {
    wx.navigateTo({
      url: '../albumInfo/albumInfo?aid=' + e.currentTarget.dataset.aid + "&aname=" + e.currentTarget.dataset.aname
    })
  },
  toloadMore: function() {
    let that = this;
    app.loadMore(that, function() {
      let paras = {
        page: that.data.page,
        albumTag: that.data.cname,
        isPrecious: 'false'
      };
      paras = JSON.stringify(paras);
      let oldalist = that.data.alist;
      app.request('post', 'album/queryList.do', paras, function(res) {
        let alist = res.data.data
        for (let i = 0; i < alist.length; i++) {
          alist[i].albumCoverImage = imgrurl + alist[i].albumCoverImage + "?imageView2/2/w/366/h/366|imageslim";
          oldalist.push(alist[i]);
        }
        that.setData({
          alist: oldalist
        })
      }, function() {
        wx.showToast({
          title: '专辑列表加载失败',
          icon: 'none'
        })
      })
    })
  },
  onLoad: function(options) {
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
    app.request('post', 'album/queryList.do', paras, function(res) {
      let alist = res.data.data
      for (let i = 0; i < alist.length; i++) {
        alist[i].albumCoverImage = imgrurl + alist[i].albumCoverImage + "?imageView2/2/w/366/h/366|imageslim";
      }
      that.setData({
        alist: alist,
        pageSize: res.data.pageSize
      })
    }, function() {
      wx.showToast({
        title: '专辑列表加载失败',
        icon: 'none'
      })
    })
  }
})