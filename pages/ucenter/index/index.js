var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../services/user.js');
var app = getApp();

Page({
    data: {
        basePath: app.globalData._base_path, //基础路径
        userInfo: {},
        isShowContactBox: true,
        brokerage: 0.00,
        list: [],// 优惠券列表
        latitude: 0.00,
        longitude: 0.00,
        appVersion:"0.0.1",
    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
      let userInfo = wx.getStorageSync('userInfo');

      this.setData({
        userInfo: userInfo,
        appVersion: app.globalData._version
      });
        this.queryGifts();
        this.queryMyCenter();
    },
    onReady: function () {

    },
    onShow: function () {

        let userInfo = wx.getStorageSync('userInfo');
        let token = wx.getStorageSync('token');

        // 页面显示
        if (userInfo && token) {
            app.globalData.userInfo = userInfo;
            app.globalData.token = token;
        }

        this.setData({
            userInfo: app.globalData.userInfo,
        });
        this.queryMyCenter();
    },
    //体现
    withdrawDeposit: function () {
        let that = this;
        if (that.data.brokerage < 5) {
            wx.showToast({
                icon: "none",
                title: '5元以上才能申请提现!',
            })
            return;
        }
        that.setData({
            showModal2: true
        })
    },
    //点击确认按钮，确认提现
    confirmWithDraw() {
        let that = this;
        util.request(api.WithdrawDeposit,
            {
                "userId": that.data.userInfo.id,                    //用户主键id
                "merchantId": that.data.userInfo.merchantId,            //商户主键id
                "brokerage": that.data.brokerage,
            },
            "POST").then(function (res) {
            if (res.rs === 1) { //提现成功
              wx.showToast({
                title: "提现成功",
              })
                that.setData({
                    brokerage: 0.00,
                    showModal2: false
                });

            } else {
                wx.showToast({
                    icon: "none",
                    title: res.info,
                })
            }
        });
    },
    //查询个人中心
    queryMyCenter: function () {
        let that = this;
        util.request(api.QueryMyCenter,
            {
                "userId": that.data.userInfo.id,                    //用户主键id
                "merchantId": that.data.userInfo.merchantId             //商户主键id
            },
            "POST").then(function (res) {
            if (res.rs === 1) {
                that.setData({
                    brokerage: res.data.brokerage.toFixed(2)
                });
            }
        });
    },

    //获取流量超市优惠券
    queryGifts: function () {
        let that = this;
        util.request(api.QueryGifts,
            {
              "token": "",
              "nickName": that.data.userInfo.nickName,  //用户昵称      
              "type": "mc-merchant",  //类型 mc-customer/ mc-merchant      
              "phone": that.data.userInfo.phone //用户绑定的手机号
            },
            "POST").then(function (res) {
            if (res.rs === 1) {
                that.setData({
                    list: res.data.list
                });
            }
        });
    },
    //导航跳转
    navTo: function (e) {
        var url = e.currentTarget.dataset.url;
        if (url == "null" || url == null) {
            return;
        }
        //跳转TabBar路径
        if (e.currentTarget.dataset.way == 1) {
            wx.switchTab({
                url: e.currentTarget.dataset.url
            });
        } else {
            wx.navigateTo({
                url: "/pages/thirdPage/thirdPage?url=" + url,
            })
        }
    },
    //跳转到我的团
    navToGroup: function () {
        wx.switchTab({
            url: '/pages/goods/my_group',
        })
    },
    //拨打客服电话
    callCFPhone: function (event) {
        //console.log("debug: 客服电话-----" + event.currentTarget.dataset.phone);
        wx.makePhoneCall({
            phoneNumber: event.currentTarget.dataset.phone, //客服电话
            success: function () {
                console.log("拨打电话成功！")
            },
            fail: function () {
            }
        })
        // wx.showModal({
        //   title: '提示',
        //   content: '即将为您拨通客服电话（' + event.currentTarget.dataset.phone + '）？',
        //   success: function (sm) {
        //     if (sm.confirm) {

        //     } else if (sm.cancel) {
        //       console.log('用户点击取消')
        //     }
        //   }
        // })

    },
    toShowContactBox() {
        wx.hideTabBar({})
        this.setData({
            isShowContactBox: false
        });
    },
    toHideContactBox() {
        wx.showTabBar({})
        this.setData({
            isShowContactBox: true
        });
    },
    showModal() {
        this.setData({
            showModal: true
        })
        var that = this;
        wx.getLocation({
            type: 'gcj02', //返回可以用于wx.openLocation的经纬度
            success: function (res) {
                ///设置当前地理位置
                that.setData({
                    latitude: res.latitude,
                    longitude: res.longitude,
                });
                //复制到剪切板
                wx.setClipboardData({
                    data:'X:'+that.data.latitude+ '\n\rY:'+that.data.longitude,
                    success (res) {
                        wx.hideToast(); //隐藏复制成功的弹窗提示,根据需求可选
                    }
                })
            }
        });


    },
    closeModal() {
        this.setData({
            showModal: false,
            showModal2: false
        })
    },
    goLogin() {
        wx.navigateTo({
          url: '/pages/auth/login/login',
        })
    },
    exitLogin: function () {
        wx.showModal({
            title: '',
            confirmColor: '#b4282d',
            content: '退出登录？',
            success: function (res) {
                if (res.confirm) {
                    wx.removeStorageSync('token');
                    wx.removeStorageSync('userInfo');
                    wx.switchTab({
                        url: '/pages/index/index'
                    });
                }
            }
        })

    }
})