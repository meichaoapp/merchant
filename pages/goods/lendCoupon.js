// pages/goods/lengSHops.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
var WxParse = require('../../lib/wxParse/wxParse.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    detail: {},
    merchant: {},
    showModal: false,
    modalTitle: "",
    count:0,
    leadType: 1,
    type: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    this.setData({
      id: options.id,
      leadType: options.leadType,
      type: options.type,
    });
    let userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo: userInfo,
    });
    this.queryCouponDetail();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  //查询详情
  queryCouponDetail: function () {

    let that = this;
    util.request(api.QueryCouponDetail,
      {
        "orderId": that.data.id,
        status: 2,
        merchantId: that.data.userInfo.merchantId,
        type: that.data.type,
      },
      "POST").then(function (res) {
        if (res.rs === 1) {
          var detail = res.data.discountCoupon;
          if (detail.comments.length > 22) {
            detail.comments = detail.comments.substring(0,22) + "...";
          }
          that.setData({
            detail: detail,
          });
          WxParse.wxParse('goodsDetail', 'html', res.data.discountCoupon.content, that);
        }else {
          wx.showToast({
            icon:"none",
            title: res.info,
          })
          wx.redirectTo({
            url: '/pages/goods/noneOrder',
          })
        }
      });
  },
  
  //确认领取
  leadOrder: function () {
    var _this = this;
    if (_this.data.count > 0) {
      return;
    }
    _this.setData({
      count: _this.data.count + 1,
    });

    if (_this.data.detail.status != 0) { //未使用状态
      _this.setData({
        count: 0,
      });
      return;
    }
  
    util.request(api.LeadOrder, {
      id: _this.data.detail.orderId,
      merchantId: _this.data.userInfo.id,
      goodsIds: _this.data.detail.orderDetailId + "",
      leadType: _this.data.leadType,
    }, "POST").then(function (res) {
      if (res.rs === 1) {
        wx.showToast({
          title: '领取成功!',
        })
        wx.switchTab({
          url: '/pages/index/index',
        })

      } else {
        _this.setData({
          count: 0,
        });
        wx.showToast({
          icon: "none",
          title: res.info,
        })
      }
    });
  },

  //跳转首页(知道了)
  toIndex: function () {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },



})