const app = getApp();
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: 0,
        getFriendslist: [],
        start: 1, // 页码
        totalPage: 0, // 共有页
        joinNum: 0,//参团人数，
        classify:0,//分类
        classifyList: [
            {
                index: 0,
                name: '团员'
            },
            {
                index: 1,
                name: '团品'
            },
            {
                index: 2,
                name: '订单'
            },
        ],
        memList:[],//团员
        goodsList:[],//团品
        orderList:[],//订单
    },
    onLoad: function (options) {
        var that = this;
        // 页面初始化 options为页面跳转所带来的参数
        that.setData({
            id: options.id
        });

        //that.getFriendslist();
        that.queryInfo(0);
    },
    onReady: function () {

    },

    onShow: function () {

    },
    onHide: function () {

    },
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    getFriendslist: function (e) {
        // 获取我的团列表信息
        let that = this;
        //console.log("id ------" + that.data.id);
        util.request(api.Friends, {id: that.data.id}, "POST").then(function (res) {
            if (res.rs === 1) {
                var getFriendslist = res.data.list;
                that.setData({
                    joinNum: res.data.joinNum,
                    getFriendslist: getFriendslist
                })
                //console.log(getFriendslist);
            }
        });

    },
    //切换分类
    switchClassifyList(e){
        let _this = this;
        let type = e.currentTarget.dataset.type;
        _this.setData({
            start: 1,
            classify: type
        })
       this.queryInfo(_this.data.classify);
    },
    queryInfo(type){
        let _this = this;
        switch(type){
            case 0:
                util.request(api.groupPurchase+"orderDetailsByPerson", {productId: _this.data.id,start:1,limit:5}, "POST").then(function (res) {
                    if (res.rs === 1) {
                        console.log('======',res);
                        _this.setData({
                            memList:res.data.list
                        })
                    }
                });
                break;
            case 1:
                util.request(api.groupPurchase+"orderDetailsByDetails", {productId: _this.data.id,start:1,limit:5}, "POST").then(function (res) {
                    if (res.rs === 1) {
                        console.log('======',res);
                        _this.setData({
                            goodsList:res.data.list
                        })
                    }
                });
                break;
            case 2:
                util.request(api.groupPurchase+"orderDetailsByOrder", {productId: _this.data.id,start:1,limit:5}, "POST").then(function (res) {
                    if (res.rs === 1) {
                        console.log('======',res);
                        _this.setData({
                            orderList:res.data.list
                        })
                    }
                });
                break;
        }


    }
})