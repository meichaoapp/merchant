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
            console.log(bgMusic.currentTime)
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
            /*  00:00  */
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
        bgMusic.pause()
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
    // 页面卸载时停止播放
    onUnload() {
        var that = this
        that.listenerButtonStop()//停止播放
        console.log("离开")
    },

})