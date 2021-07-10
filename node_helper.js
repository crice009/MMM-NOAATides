/* Magic Mirror
 * Node Helper: MMM-NOAATides
 *
 * By Corey Rice - Gracious help from Sam Detweiler & Karsten13 (on MM Discord)
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
var fetch = require("node-fetch");

module.exports = NodeHelper.create({
    _NOAA: {
        station_name: "", //use the station ID number temporarily
        measured_times: [], //an empty array to be filled in below
        measured_tides: [], //an empty array to be filled in below
        predicted_times: [], //an empty array to be filled in below
        predicted_tides: [], //an empty array to be filled in below
    },
    // Subclass start method.
    start: function() {
        console.log("Started node_helper.js for " + this.name);
    },

    socketNotificationReceived: function(notification, payload) {
        // console.log(payload);
        let api_urls_payload = JSON.parse(payload);
        this.NOAATidesRequest(api_urls_payload);
    },

    NOAATidesRequest: function(API_URLs) {
        var self = this;

        fetch(API_URLs.measured) //get the tides from NOAA
            .then(response => {
                if (!response.ok) {
                    throw new Error('Predicted tides NOAA API response was not ok');
                }
                //console.log(response); //only uncomment this if you are checking for data returned by NOAA/ trying to see the format -- still in JSON format
                return response;
            })
            .then(response => response.json())
            .then(data => self.processMeasuredTidesData(data))
            .catch((error) => {
                console.error('Error:', error);
            });

        fetch(API_URLs.predicted) //get the tides from NOAA
            .then(response => {
                if (!response.ok) {
                    throw new Error('Predicted tides NOAA API response was not ok! -- Check API URL or parameters');
                }
                // console.log(response); //only uncomment this if you are checking for data returned by NOAA/ trying to see the format -- still in JSON format
                return response;
            })
            .then(response => response.json())
            .then(data => self.processPredictedTidesData(data));
        .catch((error) => {
            console.error('Error:', error);
        });

        let string_NOAA = JSON.stringify(self._NOAA);
        self.sendSocketNotification('NOAA_TIDES_RESULT', string_NOAA);
    },

    /*   /\    /\    /\    /\    /\    /\    /\    /\    /\    /\    /\    /\    /\    /\    /\    /\    /\    /\    /\
     *  /  \  /  \  /  \  /  \  /  \  /  \  /  \  /  \  /  \  /  \  /  \  /  \  /  \  /  \  /  \  /  \  /  \  /  \  /  \
     * /    \/    \/    \/    \/    \/    \/    \/    \/    \/    \/    \/    \/    \/    \/    \/    \/    \/    \/    \
     */ //==== process the JSON from NOAA ===============================================================================
    processMeasuredTidesData: function(mTides) {
        var self = this;
        self._NOAA.station_name = mTides.metadata.name; //update the (above) NOAA object's station_name to a real name

        self._NOAA.measured_times = []; //reset the data
        self._NOAA.measured_tides = []; //reset the data

        mTides.data.forEach(element => { //for each row of data obtained, parse out the times & heights
            self._NOAA.measured_times.push(new Date(element.t)); //store the times as time objects
            self._NOAA.measured_tides.push(Number(element.v)); //store the heights as numbers
        })
    },

    processPredictedTidesData: function(pTides) {
        var self = this;

        self._NOAA.predicted_times = []; //reset the data
        self._NOAA.predicted_tides = []; //reset the data

        pTides.predictions.forEach(element => { //for each row of data obtained, parse out the times & heights
            self._NOAA.predicted_times.push(new Date(element.t)); //store the times as time objects
            self._NOAA.predicted_tides.push(Number(element.v)); //store the heights as numbers
        })
    },
});