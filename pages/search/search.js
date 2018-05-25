var app = getApp();
Page({
  data: {
    clist: [],
    alist: [],
    aselected: '',
    cselected: ''
  },
  toclassify: function (e) {
    let that = this;
    that.setData({
      cselected: e.currentTarget.dataset.cname,
      aselected: ''
    })
    wx.navigateTo({
      url: '../classify/classify?cname=' + e.currentTarget.dataset.cname
    })
  },
  toalbum: function (e) {
    let that = this;
    that.setData({
      aselected: e.currentTarget.dataset.aid,
      cselected: ''
    })
    wx.navigateTo({
      url: '../albumInfo/albumInfo?aid=' + e.currentTarget.dataset.aid + "&aname=" + e.currentTarget.dataset.aname
    })
  },
  onShow: function () {
    let that = this;
    that.setData({
      aselected: '',
      cselected: ''
    })
    let cparas = {
    }
    cparas = JSON.stringify(cparas);
    app.request('post', 'category/queryList.do', cparas, function (res) {
      let clist = res.data.data;
      that.setData({
        clist: clist
      })
    }, function () { })
    let aparas = {
      isPrecious: 'false'
    };
    aparas = JSON.stringify(aparas);
    app.request('post', 'album/queryList.do', aparas, function (res) {
      let alist = app.random(res.data.data, 8);
      that.setData({
        alist: alist
      })
    }, function () { })
  }
})