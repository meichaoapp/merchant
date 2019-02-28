// pages/manageGoods/editGoods.js
const app = getApp();
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
const statusArr = [1, 2];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0, //商品id
    userInfo: {},
    detail:{}, //商品详情
    imgs: [],
    imgLen: 0,
    upload: true,
    uploading: false,
    qiniu: '',
    showError: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    var id = options.id;
    let userInfo = wx.getStorageSync('userInfo');
    this.setData({
      id: id,
      userInfo: userInfo,
    });

    if(0 != id) { //加载商品信息
      _this.loadGoodsDetail();
    }
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
   
  //加载商品详情
  loadGoodsDetail: function() {
    let _this = this;
    var  data = {
      productDetailId: _this.data.id,
    };
    util.request(api.QueryPurchasGoods, data, "POST").then(function (res) {
      if (res.rs == 1) {
        _this.setData({
          detail: res.data.detail,
        });
      } else {
        wx.showToast({
          icon: "none",
          title: res.info,
        })
      }
    });
  },

  //提交编辑
  submit: function(e) {
    let _this = this;
    if (!_this.validate(e)){
       return;
    }

  },

  //参数校验
  validate: function(e) {
    var rules = {
      title: {
        required: true,
        maxlength: 100,
      },
      tagline: {
        required: true,
        maxlength: 300,
      },
      
    }
    var messages = {
      title: {
        required: "标题不能为空",
        maxlength: "标题不能大于100字",
      },
      tagline: {
        required: "简述不能为空",
        maxlength: "简述不能大于300字",
      },
     
    }
    this.WxValidate = app.WxValidate(rules, messages);

    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0];
      wx.showToast({
        icon:"none",
        title: error.msg,
      })
      return false;
    }

    return true;
  },

  //选择图片
  choosePhoto: function () {
    var _this = this;
    //检查网络状态
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：
        var networkType = res.networkType;
        if (networkType == '2g' || networkType == '3g' || networkType == '4g') {
          wx.showModal({
            title: '提示',
            content: '上传图片需要消耗流量，是否继续？',
            confirmText: '继续',
            success: function (res) {
              if (res.confirm) {
                _this.chooseImage();
              }
            }
          });
        } else if (networkType == 'wifi') {
          _this.chooseImage();
        } else {
          wx.showModal({
            title: '系统提示',
            content: '未连接网络或无法识别的网络，请保证网络畅通上传，谢谢！',
            showCancel: false,//是否显示取消按钮
            success: function (res) {
            }
          });
        }
      }
    })

  },
  //选择图片
  chooseImage: function () {
    var _this = this;
    wx.chooseImage({
      count: 4,
      sourceType: ['album'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths, imgLen = tempFilePaths.length;
        _this.setData({
          uploading: true,
          imgLen: _this.data.imgLen + imgLen
        });
        tempFilePaths.forEach(function (e) {
          _this.uploadImg(e);
        });
      }
    });
  },
  //上传图片
  uploadImg: function (path) {
    var _this = this;
    if (app.g_status) {
      wx.showModal({
        title: '系统提示',
        content: '上传失败！',
        showCancel: false,//是否显示取消按钮
        success: function (res) {
        }
      });
      // app.showErrorModal(app.g_status, '上传失败');
      return;
    }
    wx.showNavigationBarLoading();
    // 上传图片
    wx.uploadFile({
      url: api.UplodUrl, // 上传文件路径
      header: {
        'Content-Type': 'multipart/form-data'
      },
      filePath: path,
      name: 'file',
      formData: {
        platformCode: "wx10001",
        dirFolderName: 'feedback',
      },
      success: function (res) {

        var data = JSON.parse(res.data);
        if (data.data.uploadRst) {
          _this.setData({
            imgs: _this.data.imgs.concat(data.data.uploadRst[0].fileServerPath),
          });
        }

        if (_this.data.imgs.length === _this.data.imgLen) {
          _this.setData({
            uploading: false
          });
        }
      },
      fail: function (res) {
        _this.setData({
          imgLen: _this.data.imgLen - 1
        });
      },
      complete: function () {
        wx.hideNavigationBarLoading();
      }
    });
  },
  //预览图片
  previewPhoto: function (e) {
    var _this = this;
    //预览图片
    if (_this.data.uploading) {
      app.showErrorModal('正在上传图片', '预览失败');
      return false;
    }
    wx.previewImage({
      current: _this.data.imgs[e.target.dataset.index],
      urls: _this.data.imgs
    });
  },

 
})