var app = getApp();
var crurl = app.globalData.crurl;
var imgrurl = app.globalData.imgrurl;
var videorurl = app.globalData.videorurl;
Page({
  data: {
    page: 1,
    slist: [],
    aobj: {},
    aname: '',
    pageSize: '',
    nodata: true
  },
  toplay: function(e) {
    let that = this;
    app.globalData.slist = that.data.slist;
    wx.navigateTo({
      url: '../player/player?sid=' + e.currentTarget.dataset.sid
    })
  },
  alltoplay: function(e) {
    let that = this;
    app.globalData.slist = that.data.slist;
    wx.navigateTo({
      url: '../player/player?sid=' + that.data.slist[0].id
    })
  },
  tocollect: function(e) {
    let that = this;
    let slist = that.data.slist;
    app.collect(e, function() {
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
  loadMore: function() {
    let that = this;
    app.loadMore(that, function() {
      let sparas = {
        page: that.data.page,
        accountId: wx.getStorageSync('accountId')
      };
      sparas = JSON.stringify(sparas);
      let oldslist = that.data.slist;
      app.request('post', 'app/favoriteMelody/queryList.do', sparas, function(res) {
        let slist = res.data.data;
        for (let i = 0; i < slist.length; i++) {
          if (slist[i].melodyPrecious == false) {
            slist[i].melodyCoverImage = imgrurl + slist[i].melodyCoverImage + "?imageView2/2/w/118/h/118|imageslim";
            slist[i].melodyFilePath = videorurl + slist[i].melodyFilePath;
            oldslist.push(slist[i]);
          }
        }
        that.setData({
          slist: oldslist
        })
      }, function() {
        wx.showToast({
          title: '曲目列表加载失败',
          icon: 'none'
        })
      })
    })
  },
  onShow: function() {
    let that = this;
    that.setData({
      page: 1
    })
    let sparas = {
      page: that.data.page,
      accountId: wx.getStorageSync('accountId')
    };
    sparas = JSON.stringify(sparas);
    let slist = [];
    app.request('post', 'app/favoriteMelody/queryList.do', sparas, function(res) {
      let cdata = res.data.data;
      if (cdata.length == 0) {
        that.setData({
          nodata: true
        })
      } else {
        for (let i = 0; i < cdata.length; i++) {
          if (cdata[i].melodyPrecious == false) {
            cdata[i].melodyCoverImage = imgrurl + cdata[i].melodyCoverImage + "?imageView2/2/w/118/h/118|imageslim";
            cdata[i].melodyFilePath = videorurl + cdata[i].melodyFilePath;
            slist.push(cdata[i]);
          }
        }
        that.setData({
          nodata: false,
          slist: slist,
          pageSize: res.data.pageSize
        })
      }
    }, function() {
      wx.showToast({
        title: '曲目列表加载失败',
        icon: 'none'
      })
    })
  }
})