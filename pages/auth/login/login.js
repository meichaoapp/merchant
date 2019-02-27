var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const user = require('../../../services/user.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    basePath: app.globalData._base_path, //基础路径
    canIUse: wx.canIUse('button.open-type.getUserInfo'), // 查看用户微信版本是否支持
    authCode:"",
    count: 0, //提交计数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.$wuxToast = app.Wux().$wuxToast
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
    this.setData({
      count: 0, //提交计数
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
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

  bindAuthCode: function (e) {
    var _this = this;
    this.setData({
      authCode: e.detail.value,
    })
  },

  login: function (e) {
    let _this = this;
    if (_this.data.count > 0) {
      return;
    }
    _this.setData({
      count: _this.data.count + 1,
    });

    if (_this.data.authCode == null || _this.data.authCode == "" ){
      _this.setData({
        count: 0,
      });
      _this.$wuxToast.show({ type: 'forbidden', text: "授权码不能为空，请填写后提交！", });
      return;
    }
    var wxUser = e.detail.userInfo;
    console.log("userInfo" + wxUser)
    user.wxLogin(wxUser, _this.data.authCode).then(res => {
      if (res.rs === 1) {
        console.log("userInfo-------" + JSON.stringify(res.data.user))
        var userInfo = res.data.user;
        app.globalData.userInfo = res.data.user;
        app.globalData.token = res.data.token;

        var session_key = userInfo.session_key;
        let bindingPhone = userInfo.phone;
        console.log("bindingPhone --- " + bindingPhone);
        if (null == bindingPhone || "" == bindingPhone) { // 未绑定手机号
          wx.navigateTo({
            url: '/pages/auth/mobileBind/mobileBind?session_key=' + session_key,
          })
        } else { // 已绑定
          wx.switchTab({
            url: '/pages/index/index',
          })
        }
      }else{
        _this.setData({
          count: 0,
        });
      }
    }).catch((err) => {
      _this.setData({
        count: 0,
      });
      _this.$wuxToast.show({ type: 'forbidden', text: err.info });
      console.log(err)
    });
  },
})