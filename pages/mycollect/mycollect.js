var app = getApp();
var crurl = app.globalData.crurl;
Page({
  data: {
    page: 1,
    slist: [],
    aobj: {},
    aname: '',
    pageSize: '',
    nodata: true
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
      that.onLoad();
    });
  },
  loadMore: function () {
    let that = this;
    let report = that.data.report;
    if (that.data.page + 1 > that.data.pageSize) {
      that.setData({ page: that.data.page })
      wx.showToast({
        title: '已到最大页数',
        icon: 'none'
      })
      return false;
    }
    that.setData({ page: that.data.page + 1 })
    wx.showLoading({})
    let sparas = {
      page: that.data.page,
      accountId: wx.getStorageSync('accountId')
    };
    sparas = JSON.stringify(sparas);
    app.request('post', 'app/favoriteMelody/queryList.do', sparas, function (res) {
      let slist = res.data.data;
      for (let i = 0; i < slist.length; i++) {
        slist[i].melodyCoverImage = crurl + slist[i].melodyCoverImage;
        oldslist.push(slist[i]);
      }
      that.setData({
        slist: oldslist
      })
      wx.hideLoading();
    })
  },
  onLoad: function (options) {
    let that = this;
    let sparas = {
      page: that.data.page,
      accountId: wx.getStorageSync('accountId')
    };
    sparas = JSON.stringify(sparas);
    app.request('post', 'app/favoriteMelody/queryList.do', sparas, function (res) {
      let slist = res.data.data;
      if (slist.length == 0) {
        that.setData({
          nodata: true
        })
      } else {
        for (let i = 0; i < slist.length; i++) {
          slist[i].melodyCoverImage = crurl + slist[i].melodyCoverImage;
        }
        that.setData({
          nodata: false,
          slist: slist,
          pageSize: res.data.pageSize
        })
      }
    })
  },

})