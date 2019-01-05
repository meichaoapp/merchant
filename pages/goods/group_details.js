const app = getApp();
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        basePath: app.globalData._base_path, //基础路径
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
        list: [],
        start: 1, // 页码
        totalPage: 0, // 共有页
        limit: 10,//每页条数
        hideHeader: true, //隐藏顶部提示
        hideBottom: true, //隐藏底部提示
        srollViewHeight: 0, //滚动分页区域高度
        refreshTime: '', // 刷新的时间
        loadMoreData: '上滑加载更多',
        orderInfo:{},//订单
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
  
    //切换分类
    switchClassifyList(e){
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
       this.queryInfo(_this.data.classify);
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
      _this.queryInfo(_this.data.classify);
    }, 300);
  },

  // 下拉刷新
  refresh: function (e) {
    let _this = this;
    setTimeout(function () {
      _this.setData({
        start: 1,
        refreshTime: new Date().toLocaleTimeString(),
        hideHeader: false
      })
      _this.queryInfo(_this.data.classify);
      wx.stopPullDownRefresh();
    }, 300);
  },

  //查询数据
  queryInfo(type){
        let _this = this;
        var data = {
          productId: _this.data.id, 
          start: _this.data.start, 
          limit: _this.data.limit,
        };
        switch(type){
            case 0:
            util.request(api.groupPurchase + "orderDetailsByPerson", data, "POST").then(function (res) {
                    if (res.rs === 1) {
                      var list = res.data.list;
                      if (_this.data.start == 1) { // 下拉刷新
                        _this.setData({
                          list: list,
                          hideHeader: true,
                          totalPage: res.data.totalPage,
                        })
                      } else { // 加载更多
                        var tempArray = _this.data.list;
                        tempArray = tempArray.concat(list);
                        _this.setData({
                          totalPage: res.data.totalPage,
                          list: tempArray,
                          //hideBottom: true
                        })
                      }
                    }else{
                      wx.showToast({
                        icon: "none",
                        title: res.info,
                      })
                    }
                });
                break;
            case 1:
            util.request(api.groupPurchase + "orderDetailsByDetails", data, "POST").then(function (res) {
                    if (res.rs === 1) {
                        var list = res.data.list;
                        if (_this.data.start == 1) { // 下拉刷新
                          _this.setData({
                            list: list,
                            hideHeader: true,
                            totalPage: res.data.totalPage,
                          })
                        } else { // 加载更多
                          var tempArray = _this.data.list;
                          tempArray = tempArray.concat(list);
                          _this.setData({
                            totalPage: res.data.totalPage,
                            list: tempArray,
                            //hideBottom: true
                          })
                        }
                    } else {
                        wx.showToast({
                          icon: "none",
                          title: res.info,
                        })
                    }
                });
                break;
            case 2:
            util.request(api.groupPurchase + "orderDetailsByOrder", data, "POST").then(function (res) {
                if (res.rs === 1) {
                  var list = res.data.list;
                  if (_this.data.start == 1) { // 下拉刷新
                    _this.setData({
                      orderInfo: res.data,
                      list: list,
                      hideHeader: true,
                      totalPage: res.data.totalPage,
                    })
                  } else { // 加载更多
                    var tempArray = _this.data.list;
                    tempArray = tempArray.concat(list);
                    _this.setData({
                      totalPage: res.data.totalPage,
                      list: tempArray,
                      //hideBottom: true
                    })
                  }
                } else {
                  wx.showToast({
                    icon: "none",
                    title: res.info,
                  })
                }
            });
                break;
        }


    }
})