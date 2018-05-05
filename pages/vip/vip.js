var app = getApp();
Page({
  data: {
    vlist: [
      {
        id: '0000',
        icon: '../../images/hy1.png',
        text: '1年超级会员',
        price: '100',
        tj: false
      }, {
        id: '0001',
        icon: '../../images/hy2.png',
        text: '3个月会员',
        price: '28',
        tj: true
      }, {
        id: '0002',
        icon: '../../images/hy3.png',
        text: '1个月会员',
        price: '9.9',
        tj: true
      }
    ],
    selected: '0000'
  },
  pay: function () {
    let paras = {
      accountId: app.globalData.accountId,
      id: that.data.selected
    }
    app.request('post', '', paras, function () {
      wx.requestPayment({
        timeStamp: '',
        nonceStr: '',
        package: '',
        signType: '',
        paySign: '',
        success: function () {
          wx.showToast({
            title: '支付成功',
            icon: 'none'
          })
        }
      })
    })
  },
  tab: function (e) {
    let that = this;
    that.setData({
      selected: e.currentTarget.dataset.pid
    })
  },
  wxpay: function () {
    let that = this;
    wx.requestPayment({
      timeStamp: '',
      nonceStr: '',
      package: '',
      signType: '',
      paySign: '',
      success: function () {
        that.setData({
          selected: 0
        })
      },
      fail: function () {

      }
    })
  },
  onLoad: function (options) {

  }
})