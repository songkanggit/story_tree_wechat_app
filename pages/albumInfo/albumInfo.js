var app = getApp();
var crurl = app.globalData.crurl;
Page({
  data: {
    page: 1,
    slist: [],
    aobj: {},
    aname: '',
    pageSize: '',
    mask: true
  },
  showmask: function () {
    let that = this;
    that.setData({
      mask: false
    })
  },
  hidemask: function () {
    let that = this;
    that.setData({
      mask: true
    })
  },
  toplay: function (e) {
    let that = this;
    app.globalData.slist = that.data.slist;
    wx.navigateTo({
      url: '../player/player?sid=' + e.currentTarget.dataset.sid
    })
  },
  alltoplay: function (e) {
    let that = this;
    app.globalData.slist = that.data.slist;
    wx.navigateTo({
      url: '../player/player?sid=' + that.data.slist[0].id
    })
  },
  tocollect: function (e) {
    let that = this;
    app.collect(e, function () {
      let slist = that.data.slist;
      for (let i = 0; i < slist.length; i++) {
        if (e.currentTarget.dataset.sid == slist[i].id) {
          slist[i].favorated = !slist[i].favorated;
        }
      }
      that.setData({
        slist: slist
      })
      app.globalData.slist = slist;
    });
  },
  toloadMore: function () {
    let that = this;
    app.loadMore(that, function () {
      let sparas = {
        page: that.data.page,
        melodyAlbum: that.data.aname,
        accountId: wx.getStorageSync('accountId')
      };
      sparas = JSON.stringify(sparas);
      let oldslist = that.data.slist;
      app.request('post', 'melody/queryList.do', sparas, function (res) {
        let slist = res.data.data.melodyList;
        for (let i = 0; i < slist.length; i++) {
          slist[i].melodyCoverImage = crurl + slist[i].melodyCoverImage;
          slist[i].melodyFilePath = crurl + slist[i].melodyFilePath;
          oldslist.push(slist[i]);
        }
        that.setData({
          slist: oldslist
        })
      }, function () {
        wx.showToast({
          title: '曲目列表加载失败',
          icon: 'none'
        })
      })
    })
  },
  onShow: function () {
    let that = this;
    let options = that.options;
    wx.setNavigationBarTitle({
      title: options.aname
    })
    that.setData({
      aname: options.aname
    })
    let sparas = {
      page: that.data.page,
      melodyAlbum: options.aname,
      accountId: wx.getStorageSync('accountId')
    };
    sparas = JSON.stringify(sparas);
    app.request('post', 'melody/queryList.do', sparas, function (res) {
      let slist = res.data.data.melodyList;
      for (let i = 0; i < slist.length; i++) {
        slist[i].melodyCoverImage = crurl + slist[i].melodyCoverImage;
        slist[i].melodyFilePath = crurl + slist[i].melodyFilePath;
      }
      that.setData({
        slist: slist,
        pageSize: res.data.pageSize
      })
    }, function () {
      wx.showToast({
        title: '曲目列表加载失败',
        icon: 'none'
      })
    })
    let aparas = {
      id: options.aid
    };
    aparas = JSON.stringify(aparas);
    app.request('post', 'album/query.do', aparas, function (res) {
      let aobj = res.data.data;
      aobj.albumCoverImage = crurl + aobj.albumCoverImage;
      that.setData({
        aobj: aobj
      })
    }, function () {
      wx.showToast({
        title: '专辑信息加载失败',
        icon: 'none'
      })
    })
  }
})