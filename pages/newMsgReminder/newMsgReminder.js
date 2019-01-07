/*
//index.js
//获取应用实例
const bgMusic = wx.getBackgroundAudioManager()
const app = getApp()

Page({
    data: {
        isOpen: false,//播放开关
        starttime: '00:00', //正在播放时长
        duration: '06:41',   //总时长
      src: "https://wxpic.iliangpin.cn/meichao/message_reminding.mp3"
    },
    // 播放
    listenerButtonPlay: function () {
        var that = this
        //bug ios 播放时必须加title 不然会报错导致音乐不播放
        bgMusic.title = '此时此刻'
        bgMusic.epname = '此时此刻'
        bgMusic.src = that.data.src;
        bgMusic.onTimeUpdate(() => {
            //bgMusic.duration总时长  bgMusic.currentTime当前进度
            //console.log(bgMusic.currentTime)
            var duration = bgMusic.duration;
            var offset = bgMusic.currentTime;
            var currentTime = parseInt(bgMusic.currentTime);
            var min = "0" + parseInt(currentTime / 60);
            var max = parseInt(bgMusic.duration);
            var sec = currentTime % 60;
            if (sec < 10) {
                sec = "0" + sec;
            }
            ;
            var starttime = min + ':' + sec;
            /!*  00:00  *!/
            that.setData({
                offset: currentTime,
                starttime: starttime,
                max: max,
                changePlay: true
            })
        })
        //播放结束
        bgMusic.onEnded(() => {
            that.setData({
                starttime: '00:00',
                isOpen: false,
                offset: 0
            })
            console.log("音乐播放结束");
        })
        bgMusic.play();
        that.setData({
            isOpen: true,
        })
    },
    //暂停播放
    listenerButtonPause() {
        var that = this
        if (bgMusic.paused) {
            bgMusic.play()
        } else {
            bgMusic.pause()
        }
        // bgMusic.pause()
        that.setData({
            isOpen: false,
        })
    },
    listenerButtonStop() {
        var that = this
        bgMusic.stop()
    },
    // 进度条拖拽
    sliderChange(e) {
        var that = this
        var offset = parseInt(e.detail.value);
        bgMusic.play();
        bgMusic.seek(offset);
        that.setData({
            isOpen: true,
        })
    },
    onLoad(){
        var that = this;
        //that.listenerButtonPlay();//播放
        console.log("进入")
    },
    // 页面卸载时停止播放
    onUnload() {
        var that = this
        that.listenerButtonStop()//停止播放
        console.log("离开")
    },
})*/
// pages/audio/audio.js
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
const audioManager = wx.getBackgroundAudioManager()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        value: 0,
        percent: 0,
        max: 5,
        pass_time: '00:00',
        total_time: '00:05',
        pause: '暂停',
        pause_disable: true,
        userInfo:{},
        timer:''
    },

    secondTransferTime: function (time) {
        if (time > 3600) {
            return [
                parseInt(time / 60 / 60),
                parseInt(time / 60 % 60),
                parseInt(time % 60)
            ]
                .join(":")
                .replace(/\b(\d)\b/g, "0$1");
        } else {
            return [
                parseInt(time / 60 % 60),
                parseInt(time % 60)
            ]
                .join(":")
                .replace(/\b(\d)\b/g, "0$1");
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this
        this.wxzxSlider = this.selectComponent("#wxzxSlider");
        audioManager.onTimeUpdate (function () {
            if (!that.wxzxSlider.properties.isMonitoring) {
                return
            }
            var currentTime = audioManager.currentTime.toFixed(0);
            if (currentTime > that.data.max) {
                currentTime = that.data.max;
            }
            var pass_time = that.secondTransferTime(currentTime);

            that.setData({
                value: currentTime,
                pass_time: pass_time,
                percent: audioManager.buffered / audioManager.duration * 100,
                disabled: false
            })
        })

        audioManager.onWaiting (function () {
            that.setData ({ disabled: true })
        })

        audioManager.onEnded (function () {
            that.setData({
                pause: '暂停',
                pause_disable: true,
                value: 0,
                pass_time: '00:00',
                percent: 0,
                disabled: true
            })
        })
    },

    // 点击slider时调用
    sliderTap: function (e) {
        console.log("sliderTap")
        this.seek()
    },

    // 开始滑动时
    sliderStart: function (e) {
        console.log("sliderStart")
    },

    // 正在滑动
    sliderChange: function (e) {
        console.log("sliderChange")
    },

    // 滑动结束
    sliderEnd: function (e) {
        console.log("sliderEnd")
        this.seek()
    },

    // 滑动取消 （左滑时滑到上一页面或电话等情况）
    sliderCancel: function (e) {
        console.log("sliderCancel")
        this.seek()
    },

    seek: function () {
        var value = this.wxzxSlider.properties.value
        console.log(value)
        var seek_time = value.toFixed(0);
        var pass_time = this.secondTransferTime(seek_time);
        this.setData({
            pass_time: pass_time,
        })
        audioManager.seek(Number(seek_time));
    },

    start: function () {
        audioManager.title = '新消息提醒'
        audioManager.epname = '新消息提醒'
        audioManager.singer = '通知'
        audioManager.coverImgUrl = 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000'
        //audioManager.src = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46'
        audioManager.src = 'https://wxpic.iliangpin.cn/meichao/message_reminding.mp3';
        this.setData({ pause: '暂停', pause_disable: false })
    },

    pause: function (e) {
        if (audioManager.paused) {
            audioManager.play()
            this.setData({ pause: '暂停'})
        } else {
            audioManager.pause()
            this.setData({ pause: '播放' })
        }
    },

    stop: function () {
        audioManager.stop()
        this.setData({
            pause: '暂停',
            pause_disable: true,
            value: 0,
            pass_time: '00:00',
            percent: 0,
            disabled: true
        })
    },
    queryNewMsgReminder(){
        let _this = this;
        console.log('======',_this.data.userInfo);
        util.request(api.newMsgReminder, {'merchantId': _this.data.userInfo.merchantId}, "POST").then(function (res) {
            if (res.rs === 1) {
                if(res.data.countNum!=0){
                    _this.start();
                }
            }
        })
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
        debugger
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
        this.setData({
            timer:setInterval(this.queryNewMsgReminder,1000)
        })
    },

    onUnload(){
        clearInterval(this.data.timer);//切换页面时清除定时器
        this.stop();
    }
})
