// pages/myShop/myShop.js
const app = getApp();
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        basePath: app.globalData._base_path, //基础路径
        userInfo: {},
        list: [],
        start: 1, // 页码
        totalPage: 0, // 共有页
        limit: 5,//每页条数
        hideHeader: true, //隐藏顶部提示
        hideBottom: true, //隐藏底部提示
        srollViewHeight: 0, //滚动分页区域高度
        refreshTime: '', // 刷新的时间
        loadMoreData: '加载更多',
        classify: 0,//分类
        classifyList: [
            {
                index: 0,
                name: '订单'
            },
            {
                index: 1,
                name: '汇总'
            }
        ],
        selectData:['2018-1','2018-2','2018-3','2018-4','2018-9','2018-12'],//下拉列表的数据
        index:0//选择的下拉列表下标
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let userInfo = wx.getStorageSync('userInfo');
        this.setData({
            userInfo: userInfo,
        });
        this.$wuxLoading = app.Wux().$wuxLoading //加载
        this.$wuxToast = app.Wux().$wuxToast

        this.getOrderList();
    },
    // 点击下拉显示框
    selectTap(){
        this.setData({
            show: !this.data.show
        });
    },
    // 点击下拉列表
    optionTap(e){
        let Index=e.currentTarget.dataset.index;//获取点击的下拉列表的下标
        this.setData({
            index:Index,
            show:!this.data.show
        });
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
        // 页面显示
        var that = this;
        let userInfo = wx.getStorageSync('userInfo');
        let token = wx.getStorageSync('token');

        if (null == userInfo || userInfo == "" || undefined == userInfo) {
            wx.navigateTo({
                url: '/pages/firstLogin/firstLogin'
            });
        } else {
            this.setData({
                userInfo: userInfo,
            });
        }
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.refresh();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.loadMore();
    },

    // 上拉加载更多
    loadMore: function () {
        console.log('上拉加载更多');
        let _this = this;
        // 当前页是最后一页
        if (_this.data.start == _this.data.totalPage) {
            _this.setData({loadMoreData: '我是有底线的'})
            return;
        }
        setTimeout(function () {
            //console.log('上拉加载更多');
            _this.setData({
                start: _this.data.start + 1,
                hideBottom: false
            })
            _this.getOrderList();
        }, 300);
    },

    // 下拉刷新
    refresh: function (e) {
        let _this = this;
        setTimeout(function () {
            //console.log('下拉刷新');
            _this.setData({
                start: 1,
                refreshTime: new Date().toLocaleTimeString(),
                hideHeader: false
            })
            _this.getOrderList();
            wx.stopPullDownRefresh();
        }, 300);
    },

    //获取店铺订单
    getOrderList: function () {
        let _this = this;
        console.log("getOrderList ---- " + _this.data.userInfo.merchantId);
        util.request(api.QueryOrderList, {
            start: _this.data.start,
            limit: _this.data.limit,
            merchantId: _this.data.userInfo.merchantId,
        }, "POST").then(function (res) {
            if (res.rs === 1) {
                var list = res.data.list;
                console.log("getOrderList ---- " + JSON.stringify(list));
                if (_this.data.start == 1) { // 下拉刷新
                    _this.setData({
                        list: list,
                        hideHeader: true,
                        totalPage: res.data.totalPage,
                    })
                } else { // 加载更多
                    //console.log('加载更多');
                    var tempArray = _this.data.list;
                    tempArray = tempArray.concat(list);
                    _this.setData({
                        totalPage: res.data.totalPage,
                        list: tempArray,
                        //hideBottom: true
                    })
                }

            }
        });
    },
    //切换tab
    switchClassifyList(e) {
        let _this = this;
        let type = e.currentTarget.dataset.type;
        _this.setData({
            start: 1,
            classify: type,
            list: [],
            start: 1, // 页码
            totalPage: 0, // 共有页
            limit: 10,//每页条数
            orderInfo:{},
        })
        //this.queryInfo(_this.data.classify);
    },
    //跳转到详情页
    goDetail(e) {
        let orderId = e.currentTarget.dataset.orderid;

        wx.navigateTo({
            url: '/pages/goods/lendTheGoods?leadType=2&id=' + orderId,
        });
    },

})
