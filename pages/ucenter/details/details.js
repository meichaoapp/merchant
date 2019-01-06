const app = getApp();
Page({

    data: {
        basePath: app.globalData._base_path, //基础路径
        show:false,//控制下拉列表的显示隐藏，false隐藏、true显示
        selectData:['2018-1','2018-2','2018-3','2018-4','2018-9','2018-12'],//下拉列表的数据
        index:0//选择的下拉列表下标
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
    onLoad: function (options) {

    }

})