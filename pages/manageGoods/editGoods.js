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
    sellList: [],
    classifys: [], 
    imgs: [],
    icons:[],
    imgLen: 0,
    upload: true,
    uploading0: false,
    uploading: false,
    qiniu: '',
    showError: false,
    status:1,
    classifyIndex:0,
    sellIndex: 0,
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

    _this.queryCategories();
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  getClassifysOption:function(e) {
    let _this = this;
    _this.setData({
      classifyIndex: e.detail.value,
    });

  },

  getSellListOption: function (e) {
    let _this = this;
    _this.setData({
      sellIndex: e.detail.value,
    });
  },

  //商品上下架
  changeStatus: function (e) {
    let _this = this;
    var status = e.currentTarget.dataset.status;
    _this.setData({
      status: status,
    });
  },

  //获取下拉数据
  queryCategories:function() {
    let _this = this;
    var data = {
      token:"",
      type:"1003,1004",
    }
    util.request(api.QueryCategories, data, "POST").then(function (res) {
      if (res.rs == 1) {
        var sellList = [];
        var sList = res.data.sellList;
        if(sList) {
          sellList.push({
            id: -1,
            text: "请选择",
          });
          sList.forEach(t => {
             var l = {
               id: t.code,
               text: t.name, 
             };
             sellList.push(l);
          });
        }
        var classifys = [];
        var cList = res.data.classifys;
        if (cList) {
          classifys.push({
            id: -1,
            text: "请选择",
          });
          cList.forEach(t => {
            var l = {
              id: t.code,
              text: t.name,
            };
            classifys.push(l);
          });
        }
        _this.setData({
          sellList: sellList,
          classifys: classifys, 
        });
        if (0 != _this.data.id) { //加载商品信息
          _this.loadGoodsDetail();
        }
      } else {
        wx.showToast({
          icon: "none",
          title: res.info,
        })
      }
    });
  },
   
  //加载商品详情
  loadGoodsDetail: function() {
    let _this = this;
    var  data = {
      productDetailId: _this.data.id,
    };
    util.request(api.QueryPurchasGoods, data, "POST").then(function (res) {
      if (res.rs == 1) {
        if (res.data) {
          var detail = res.data.detail;
          if(detail) {
            var icon = detail.iocn;
            var pics = detail.pics;
            var icons = [];
            var imgs = [];
            if(null != icon && icon != "") {icons.push(icon);}
            if (null != pics && pics.length > 0) { imgs = pics; }
            var classifyIndex = 0;
            var sellIndex = 0;
           //console.log("detail.classify)-------" + detail.classify);
            if (null != detail.classify) {
              var classifys = _this.data.classifys;
              //console.log("classifys-------" + JSON.stringify(classifys));
              for (var i = 0; i < classifys.length; i++) {
                if (classifys[i].id == detail.classify ) {
                  classifyIndex = i;
                  break;
                }
              }
            }
            if (null != detail.sellType) {
              var sellList = _this.data.sellList;
              for (var i = 0; i < sellList.length; i++) {
                if (sellList[i].id == detail.sellType) {
                  sellIndex = i;
                  break;
                }
              }
            }
            _this.setData({
              detail: detail,
              icons: icons,
              imgs: imgs,
              status: detail.status,
              classifyIndex: classifyIndex,
              sellIndex: sellIndex,
            });
          }
        }
       
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
    if (0 != _this.data.id) { //加载商品信息
      e.detail.value.id = _this.data.detail.id; //产品详情id
      e.detail.value.productId = _this.data.detail.productId; // 团id
    }
    var icon = "";
    if(_this.data.icons.length > 0) { icon = _this.data.icons[0]; }
    e.detail.value.icon = icon;

    e.detail.value.status = _this.data.status; //状态

    if (!_this.validate(e)){
       return;
    }
    if (_this.data.imgs.length <= 0) {
      wx.showToast({
        icon: "none",
        title: "详情图片不能为空",
      })
      return;
    }else {
      e.detail.value.pics = _this.data.imgs.join(",");
    }

    var classify = null;
    var sellType = null;

    if (_this.data.sellIndex == 0 &&  _this.data.classifyIndex == 0) {
      wx.showToast({
        icon: "none",
        title: "首页展示位置和分类必须选择一个",
      })
      return;
    }else {
      if (_this.data.sellIndex != 0) {
        sellType = _this.data.classifys[_this.data.classifyIndex].id;
      }
      if (_this.data.classifyIndex != 0) {
        classify = _this.data.classifys[_this.data.classifyIndex].id;
      }
    }

    e.detail.value.classify = classify;
    e.detail.value.sellType = sellType;

    var formData = e.detail.value;
    console.log("formData-------------" + JSON.stringify(formData));

    util.request(api.EditPurchasGoods, formData, "POST").then(function (res) {
      if (res.rs == 1) {
        wx.showToast({
          title: "操作成功!",
        })
      } else {
        wx.showToast({
          icon: "none",
          title: res.info,
        })
      }
    });

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
      currentPrice: {
        required: true,
      },
      originalPrice: {
        required: true,
      },
      unit: {
        required: true,
      },
      unitDesc: {
        required: true,
      },
      stock: {
        required: true,
        min:0,
      },
      icon: {
        required: true,
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
      currentPrice: {
        required: "现价不能为空",
      },
      originalPrice: {
        required: "原价不能为空",
      },
      unit: {
        required: "单位不能为空",
      },
      unitDesc: {
        required: "单位描述不能为空",
      },
      stock: {
        required: "库存不能为空",
        min: "库存数量不能小于0",
      },
      icon: {
        required: "图标不能为空",
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
  //移除图片
  removePhoto:function(e) {
    var _this = this;
    var tag = e.currentTarget.dataset.tag;
    var index = e.currentTarget.dataset.index;
    if(tag == 0) {
       _this.deleteArryByIndex(_this.data.icons, index,tag);
    }else {
      _this.deleteArryByIndex(_this.data.imgs, index,tag);
    }
  },

  deleteArryByIndex: function (arr, index,tag) {
    let that = this;
      wx.showModal({
          title: '提示',
          content: '确定要删除此图片吗？',
          success: function (res) {
              if (res.confirm) {
                  console.log('点击确定了');
                  arr.splice(index, 1);
              } else if (res.cancel) {
                  console.log('点击取消了');
                  return false;
              }
              if(tag==0){
                  that.setData({
                      icons:arr
                  })
              }else{
                  that.setData({
                      imgs:arr
                  })
              }

          }
      })
    // var _arr = [];
    // if(arr) {
    //   for(var i = 0 ; i < arr.length; i++) {
    //     if(i != index) {
    //       _arr.push(arr[i]);
    //     }
    //   }
    // }
    // return _arr;
  },

  //选择图片
  choosePhoto: function (e) {
    var _this = this;
    var tag = e.currentTarget.dataset.tag;
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
                _this.chooseImage(tag);
              }
            }
          });
        } else if (networkType == 'wifi') {
          _this.chooseImage(tag);
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
  chooseImage: function (tag) {
    var _this = this;
   
    wx.chooseImage({
      count: 1,
      sourceType: ['album'],
      success: function (res) {
       
        var tempFilePaths = res.tempFilePaths, imgLen = tempFilePaths.length;
        _this.setData({
          uploading0: (tag == 0),
          uploading: (tag == 1),
          imgLen: _this.data.imgLen + imgLen
        });
        tempFilePaths.forEach(function (e) {
          _this.uploadImg(e,tag);
        });
      }
    });
  },
  //上传图片
  uploadImg: function (path,tag) {
    var _this = this;
    if (app.g_status) {
      wx.showModal({
        title: '系统提示',
        content: '上传失败！',
        showCancel: false,//是否显示取消按钮
        success: function (res) {
        }
      });
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
      name: 'myfile',
      success: function (res) {
        var data = JSON.parse(res.data);
        if (data.data) {
          if(tag == 1) {
            _this.setData({
              imgs: _this.data.imgs.concat(data.data),
            });
          }else {
            _this.setData({
              icons: _this.data.icons.concat(data.data),
            });
          }
        }
        _this.setData({
          uploading0: false,
          uploading: false
        });
      },
      fail: function (res) {
        wx.showToast({
          icon:"none",
          title: res.info,
        })
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