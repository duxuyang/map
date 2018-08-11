// pages/weather/weather.js
const app = getApp();
var bmap = require('../libs/bmap-wx.min.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weatherData1:{name:'tom'},
    du:'',//温度
    city:'',//城市
    date:'',//日期
    yun:'',//云
    zhou:'',//星期
    list:[],//预报列表
    clist:[]//指数列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.common();
  },
  common:function(){
    var that = this;
    // 新建百度地图对象 
    var BMap = new bmap.BMapWX({
      ak: 'bk2GxHHoQiqUKgwLj1wW1GQIbCpcnKri'
    });
    var fail = function (data) {
      console.log(data)
    }; 
    var success = function (data) {
      var weatherData = data.currentWeather[0];//当前城市信息
      var riqilist = data.originalData.results[0].weather_data;//预报列表
      var riqi=[];
      var m1 = data.originalData.results[0].index;//指数列表
      //console.log(data)
      for(var i=0,len=riqilist.length;i<len;i++){
          if(i==0){
            riqi.push({
              date: '今天', tem: riqilist[i].temperature, weather: riqilist[i].weather, wind: riqilist[i].wind, dayurl: riqilist[i].dayPictureUrl
});
          }else{
            riqi.push({ date: riqilist[i].date, tem: riqilist[i].temperature, weather: riqilist[i].weather, wind: riqilist[i].wind, dayurl: riqilist[i].dayPictureUrl});
          }
      }
     for(var i=0,len=m1.length;i<len;i++){
       m1[i]['imgurl']="../img/"+i+".png";
     }
      that.setData({
        du: weatherData.date.split("(")[1].replace(/[^0-9]/ig, ""),
        city: weatherData.currentCity,
        date: data.originalData.date,
        yun: weatherData.weatherDesc,
        zhou: "星" + weatherData.date.slice(0, 2),
        list: riqi,
        clist: m1
      })
     
    }
    BMap.weather({
      fail: fail,
      success: success
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
    this.common();
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
      success(res){
          
      }
    })
  }
})