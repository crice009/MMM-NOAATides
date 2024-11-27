/* global Module */

/* Magic Mirror
 * Module: MMM-NOAATides
 *
 * By Corey Rice - Gracious help from Sam Detweiler & Karsten13 (on MM Discord)
 * MIT Licensed.
 */

Module.register('MMM-NOAATides', {
  APIparams: {
    predicted: "",
    measured: ""
  },
  NOAA: {
    station_name: "",
    units: "",
    measured_times: [],
    measured_tides: [],
    predicted_times: [],
    predicted_tides: [],
    chart: {
      context: "",
      content: ""
    }
  },

  config: null,

  defaults: {
    stationID: String(8465705),
    datum: "MSL",
    time: "lst_ldt",
    units: "english",
    updateInterval: 2500,
    animationSpeed: 1000 * 60 * 6,
    initialLoadDelay: 2500,
    retryDelay: 2500,
    apiBase: "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=",

    chartJS: {
      measured: {
        backgroundColor: "rgba(31, 133, 224, 0.25)",
        borderColor: "rgb(31, 133, 224, 0.75)",
        pointBorderColor: "rgba(31, 133, 224, 0)",
        pointBackgroundColor: "rgba(31, 133, 224, 0)"
      },
      predicted: {
        borderColor: "gray",
        pointBorderColor: "rgba(0,0,0,0)",
        pointBackgroundColor: "rgba(0,0,0,0)"
      },
      animationDuration: 0,
      aspectRatio: 1.618,
      fillBetween: true
    }
  },

  start: function () {
    Log.log(this.name + " is starting!");

    this.NOAA.units = this.config.units === "metric" ? "metric" : "english";
    this.getNewTides();
    this.scheduleUpdate(this.config.initialLoadDelay);

    var self = this;
    setInterval(function () {
      self.getNewTides();
    }, this.config.animationSpeed);
  },

  getNewTides: function () {
    const today = new Date();
    const year = String(today.getFullYear());
    let month = String(today.getMonth() + 1).padStart(2, "0");
    let date = String(today.getDate()).padStart(2, "0");
    const NOAA_today = year + month + date;

    this.APIparams.predicted = `${this.config.apiBase}${NOAA_today}&end_date=${NOAA_today}&station=${this.config.stationID}&product=predictions&datum=${this.config.datum}&time_zone=${this.config.time}&units=${this.NOAA.units}&format=json`;
    this.APIparams.measured = `${this.config.apiBase}${NOAA_today}&end_date=${NOAA_today}&station=${this.config.stationID}&product=water_level&datum=${this.config.datum}&time_zone=${this.config.time}&units=${this.NOAA.units}&format=json`;

    var request_params = JSON.stringify(this.APIparams);
    this.sendSocketNotification('START', request_params);
    this.updateDom();
  },

  getScripts: function () {
    return [
      this.file('node_modules/chart.js/dist/Chart.min.js'),
      this.file('node_modules/chartjs-plugin-annotation/chartjs-plugin-annotation.min.js')
    ];
  },

  getStyles: function () {
    return ["MMM-NOAATides.css"];
  },

  getDom: function () {
    var wrapper = document.createElement("div");

    var chartWrapper = document.createElement("div");
    chartWrapper.className = "MMM-NOAATides vertical-screen large";
    wrapper.appendChild(chartWrapper);

    var chart = document.createElement("canvas");
    chart.id = "NOAATideChart";
    this.NOAA.chart.context = chart.getContext('2d');

    if (this.NOAA.predicted_times.length > 0) {
      this.drawChart();
    } else {
      chart.innerHTML = "Loading";
    }

    wrapper.appendChild(chart);
    return wrapper;
  },

  scheduleUpdate: function (delay) {
    var nextLoad = this.config.updateInterval;
    if (typeof delay !== "undefined" && delay >= 0) {
      nextLoad = delay;
    }

    var self = this;
    setTimeout(function () {
      self.getNewTides();
    }, nextLoad);
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "NOAA_TIDES_RESULT") {
      var helper_NOAA = JSON.parse(payload);
      Log.log(this.name + " module received notification from node_helper about: " + helper_NOAA.station_name);
      this.NOAA.station_name = helper_NOAA.station_name;
      this.NOAA.measured_times = helper_NOAA.measured_times;
      this.NOAA.measured_tides = helper_NOAA.measured_tides;
      this.NOAA.predicted_times = helper_NOAA.predicted_times;
      this.NOAA.predicted_tides = helper_NOAA.predicted_tides;

      this.updateDom();
    }
  },

  drawChart: function () {
    // Convert times to Date objects and pair with tide data
    const measuredData = this.NOAA.measured_times.map(function (time, index) {
      return {
        x: new Date(time),
        y: this.NOAA.measured_tides[index]
      };
    }.bind(this));

    const predictedData = this.NOAA.predicted_times.map(function (time, index) {
      return {
        x: new Date(time),
        y: this.NOAA.predicted_tides[index]
      };
    }.bind(this));

    const currentTime = new Date(); // Current time as Date object

    // No need to register the plugin in Chart.js 2.x

    this.NOAA.chart.content = new Chart(this.NOAA.chart.context, {
      type: 'line',
      data: {
        datasets: [{
          label: "Tides:" + this.NOAA.station_name, //just an empty part of the chart
          data: '',
        }, {
          label: 'Measured',
          data: measuredData,
          fill: this.config.chartJS.fillBetween ? '+1' : false,
          backgroundColor: this.config.chartJS.measured.backgroundColor,
          borderColor: this.config.chartJS.measured.borderColor,
          pointBorderColor: this.config.chartJS.measured.pointBorderColor,
          pointBackgroundColor: this.config.chartJS.measured.pointBackgroundColor
        }, {
          label: 'Predicted',
          data: predictedData,
          fill: false,
          backgroundColor: this.config.chartJS.predicted.backgroundColor,
          borderColor: this.config.chartJS.predicted.borderColor,
          pointBorderColor: this.config.chartJS.predicted.pointBorderColor,
          pointBackgroundColor: this.config.chartJS.predicted.pointBackgroundColor
        }]
      },
      options: {
        aspectRatio: this.config.chartJS.aspectRatio,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              callback: function (value) {
                return value + ' ft';
              }
            }
          }],
          xAxes: [{
            type: 'time',
            time: {
              unit: 'hour',
              displayFormats: {
                hour: 'h:mm a'
              }
            },
            ticks: {
              source: 'auto',
              autoSkip: true,
              maxTicksLimit: 10
            }
          }]
        },
        animation: {
          duration: this.config.chartJS.animationDuration
        },
        annotation: {
          annotations: [{
            type: 'line',
            mode: 'vertical',
            scaleID: 'x-axis-0',
            value: currentTime,
            borderColor: 'red',
            borderWidth: 2,
            label: {
              content: 'Current Time',
              enabled: true,
              position: 'top'
            }
          }]
        }
      }
    });
  }

});
