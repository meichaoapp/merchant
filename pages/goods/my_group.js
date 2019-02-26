const app = getApp();
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
const statusArr = ["未开始", "团购进行中", "发放中", "已完成"];//0 修改 1 团购进行中 2 备货 3 已完成
Page({

  /**
   * 页面的初始数据
   */
  data: {
    basePath: app.globalData._base_path, //基础路径
    userInfo: {},
    id: 0,
    list: [],
    start: 1, // 页码
    totalPage: 0, // 共有页
    limit: 5,//每页条数
    hideHeader: true, //隐藏顶部提示
    hideBottom: true, //隐藏底部提示
    srollViewHeight: 0, //滚动分页区域高度
    refreshTime: '', // 刷新的时间
    loadMoreData: '上滑加载更多',
  },
  onLoad: function (options) {
    var that = this;
    let userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo: userInfo,
    });
    this.$wuxLoading = app.Wux().$wuxLoading //加载
    this.$wuxToast = app.Wux().$wuxToast
    // 页面初始化 options为页面跳转所带来的参数
    that.setData({
      id: parseInt(options.id),
      userInfo: userInfo,
    });
    
  },
  onReady: function () {

  },

  onShow: function () {
    // 页面显示
    var that = this;
    let userInfo = wx.getStorageSync('userInfo');
    let token = wx.getStorageSync('token');

    if (null == userInfo || userInfo == "" || undefined == userInfo) {
      wx.navigateTo({
        url: '/pages/auth/login/login'
      });
    } else {
      this.setData({
        userInfo: userInfo,
      });
    }
    this.queryTGList();
  },
  onHide: function () {

  },
  onUnload: function () {

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
    let _this = this;
    // 当前页是最后一页
    if (_this.data.start == _this.data.totalPage) {
      _this.setData({ loadMoreData: '我是有底线的' })
      return;
    }
    setTimeout(function () {
      //console.log('上拉加载更多');
      _this.setData({
        start: _this.data.start + 1,
        hideBottom: false
      })
      _this.queryTGList();
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
      _this.queryTGList();
      wx.stopPullDownRefresh();
    }, 300);
  },

    queryTGList: function () {
      let _this = this;
      console.log("QueryTGList-----" + _this.data.userInfo.id);
      var data = {
        start: _this.data.start,
        limit: _this.data.limit,
        merchantId: _this.data.userInfo.id,
      }
      util.request(api.QueryTGList, data, "POST").then(function (res) {
            if (res.rs === 1) {
              var list = res.data.list;
              console.log("QueryTGList-----" + JSON.stringify(list) );
              if (list != null && list.length > 0) {
                // 获取当前时间，同时得到活动结束时间数组
                let newTime = new Date().getTime();
                console.log("newTime---" + newTime);
               
              }
              var totalPage = res.data.totalPage;

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
            }else{
              _this.$wuxToast.show({ type: 'forbidden', text: res.info, });
            }
          });
   },
   //确认收货
  confirmReceipt:function(e) {
    debugger
    let that = this;
    var id = e.currentTarget.dataset.id;
    util.request(api.ConfirmReceipt,
      {
        "productId": id,                    //商品ID
      },
      "POST").then(function (res) {
        if (res.rs === 1) { //成功
          var list = that.data.list;
          list.forEach(o => {
            if (o.id == id) {
              o.brokerage = res.data.brokerage;
              o.status = 6; //确认收货
            } 
          });
          that.setData({
            list:list,
          });

        } else {
          wx.showToast({
            icon: "none",
            title: res.info,
          })
        }
      });
  },
})
