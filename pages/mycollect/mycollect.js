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
    app.loadMore(that, function () {
      let sparas = {
        page: that.data.page,
        accountId: wx.getStorageSync('accountId')
      };
      sparas = JSON.stringify(sparas);
      let oldslist = that.data.slist;
      app.request('post', 'app/favoriteMelody/queryList.do', sparas, function (res) {
        let slist = res.data.data;
        for (let i = 0; i < slist.length; i++) {
          if (slist[i].melodyPrecious == 0){
            slist[i].melodyCoverImage = crurl + slist[i].melodyCoverImage;
            oldslist.push(slist[i]);
          }
        }
        that.setData({
          slist: oldslist
        })
      })
    })
  },
  onLoad: function () {
    let that = this;
    let sparas = {
      page: that.data.page,
      accountId: wx.getStorageSync('accountId')
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
          if (cdata[i].melodyPrecious == 0){
            cdata[i].melodyCoverImage = crurl + cdata[i].melodyCoverImage;
            slist.push(cdata[i]);
          }
        }
        that.setData({
          nodata: false,
          slist: slist,
          pageSize: res.data.pageSize
        })
      }
    })
  }

})