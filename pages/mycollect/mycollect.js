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
    let slist = that.data.slist;
    app.collect(e, function () {
      for (let i = 0; i < slist.length; i++) {
        if (e.currentTarget.dataset.sid == slist[i].id) {
          slist[i].favorated = !slist[i].favorated;
        }
      }
      that.setData({
        slist: slist
      })
      app.globalData.slist = slist;
    })
  },
  loadMore: function () {
    let that = this;
    app.loadMore(that, function () {
      let sparas = {
        page: that.data.page,
        accountId: wx.getStorageSync('accountId'),
        isPrecious: 'false'
      };
      sparas = JSON.stringify(sparas);
      let oldslist = that.data.slist;
      app.request('post', 'app/favoriteMelody/queryList.do', sparas, function (res) {
        let slist = res.data.data;
        for (let i = 0; i < slist.length; i++) {
          slist[i].melodyCoverImage = crurl + slist[i].melodyCoverImage;
          slist[i].melodyFilePath = crurl + slist[i].melodyFilePath;
          oldslist.push(slist[i]);
        }
        that.setData({
          slist: oldslist
        })
        app.globalData.slist = oldslist;
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
    let sparas = {
      page: that.data.page,
      accountId: wx.getStorageSync('accountId'),
      isPrecious: 'false'
    };
    sparas = JSON.stringify(sparas);
    let slist = [];
    app.request('post', 'app/favoriteMelody/queryList.do', sparas, function (res) {
      let cdata = res.data.data;
      if (cdata.length == 0) {
        that.setData({
          nodata: true
        })
      } else {
        for (let i = 0; i < cdata.length; i++) {
          cdata[i].melodyCoverImage = crurl + cdata[i].melodyCoverImage;
          cdata[i].melodyFilePath = crurl + cdata[i].melodyFilePath;
          slist.push(cdata[i]);
        }
        that.setData({
          nodata: false,
          slist: slist,
          pageSize: res.data.pageSize
        })
      }
    }, function () {
      wx.showToast({
        title: '曲目列表加载失败',
        icon: 'none'
      })
    })
  }
})