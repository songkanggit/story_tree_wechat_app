var app = getApp();
var crurl = app.globalData.crurl;
Page({
  data: {
    page: 1,
    slist: [],
    aobj: {},
    aname: '',
    pageSize: ''
  },
  toplay: function (e) {
    let that = this;
    wx.navigateTo({
      url: '../player/player?sid=' + e.currentTarget.dataset.sid + "&aname=" + e.currentTarget.dataset.aname
    })
  },
  alltoplay: function (e) {
    let that = this;
    wx.navigateTo({
      url: '../player/player?sid=' + that.data.slist[0].id + "&aname=" + that.data.slist[0].melodyAlbum
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
          oldslist.push(slist[i]);
        }
        that.setData({
          slist: oldslist
        })
      })
    })
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.aname
    })
    let that = this;
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
      }
      that.setData({
        slist: slist,
        pageSize: res.data.pageSize
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
    })
  },

})