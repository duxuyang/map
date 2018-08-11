// pages/map/map.js
var bmap = require('../libs/bmap-wx.min.js');
const app = getApp();
var wxMarkerData = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude:'',
    longitude:'',
    winHeight:'',
    sugData:[],
    ismap:true
  },
  controltap:function(e){//移动到中心
    var that=this;
    if (e.controlId==1){
      this.movetoPosition();
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function (options) {
    var that=this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.setData({
          latitude :res.latitude,
          longitude :res.longitude
        })
        app.globalData.lat = res.latitude;
        app.globalData.lng = res.longitude;
        that.showress();
      }
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winHeight: res.windowHeight,
          controls: [{
            id: 1,
            iconPath: '../img/location.png',
            position: {
              left: res.windowWidth- 60,
              top: res.windowHeight - 150,
              width: 50,
              height: 50
            },
            clickable: true
          }
          ]
        });
      }
    })
  },
  movetoPosition: function () {
    this.mapCtx.moveToLocation();//地图中心
  },
  bindKeyInput: function (e) {//键盘输入
    var that = this;
    if (e.detail.value!= '') {
      that.setData({
        ismap: false
      });
      var BMap = new bmap.BMapWX({
        ak: 'bk2GxHHoQiqUKgwLj1wW1GQIbCpcnKri'
      });
      var fail = function (data) {
        console.log(data)
      };
      var success = function (data) {
        var sugData = [];
        for (var i = 0; i < data.result.length; i++) {
          sugData.push(data.result[i].name)
          //sugData = sugData + data.result[i].name + '\n';
        }
        that.setData({
          sugData: sugData
        });
      }
      BMap.suggestion({
        query: e.detail.value,
        region: '北京',
        city_limit: true,
        fail: fail,
        success: success
      });
    }
  },
  ok: function (e) {//键盘输入确认e.detail.value
     var that=this;
    this.setData({
      ismap: true
    });
    wx.request({
      url: 'https://api.map.baidu.com/geocoder/v2/?address=' + e.detail.value + '&output=json&ak=bk2GxHHoQiqUKgwLj1wW1GQIbCpcnKri&ret_coordtype=gcj02ll',
      data: {
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.openLocation({
          latitude: res.data.result.location.lat,
          longitude: res.data.result.location.lng,
          scale: 15,
          name: e.detail.value
         // address: "当前位置：" + app.globalData.maddress
        })
      }
    })

  },
  danji(e) {//点击列表e.currentTarget.dataset.m
    var that = this;
    this.setData({
      ismap: true
    });
    wx.request({
      url: 'https://api.map.baidu.com/geocoder/v2/?address=' + e.currentTarget.dataset.m + '&output=json&ak=bk2GxHHoQiqUKgwLj1wW1GQIbCpcnKri&ret_coordtype=gcj02ll',
      data: {
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.openLocation({
          latitude: res.data.result.location.lat,
          longitude: res.data.result.location.lng,
          scale: 15,
          name: e.currentTarget.dataset.m,
         // address: "当前位置：" + app.globalData.maddress
        })
      }
    })

  },
  bfocus(e){//触发焦点
    var that=this;
    if (e.detail.value!=''){
      this.setData({
        ismap: false
      })
    }
  },
  lost(){//失去焦点
    var that = this;
    this.setData({
      ismap: true
    })
  },
  //根据经纬度解析地址
  showress:function(){
    var that = this; 
    var BMap = new bmap.BMapWX({
      ak: 'bk2GxHHoQiqUKgwLj1wW1GQIbCpcnKri'
    }); 
    var fail = function (data) {
      console.log(data)
    }; 
    var success=function(data){
      wxMarkerData = data.wxMarkerData;
      app.globalData.maddress = wxMarkerData[0].address;
       that.setData({
         maddress: wxMarkerData[0].address
       });
    } 
    BMap.regeocoding({
      fail: fail,
      success: success
    }); 
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.mapCtx = wx.createMapContext("map");
    this.movetoPosition();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
    wx.showShareMenu({
      withShareTicket: true,
      success(res) {
        console.log(res)
      },
      fail(res){
        console.log(res)
      }
    })
  }
})