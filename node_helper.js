/* Magic Mirror
 * Node Helper: MMM-NOAATides
 *
 * By Corey Rice
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
var fetch = require("node-fetch");
var request = require('request');

module.exports = NodeHelper.create({
    _NOAA: {
        station_name: "", //use the station ID number temporarily
        measured_times: [], //an empty array to be filled in steps below
        measured_tides: [], //an empty array to be filled in steps below
        predicted_times: [], //an empty array to be filled in steps below
        predicted_tides: [], //an empty array to be filled in steps below
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

        // OUTDATED, but definitely works...
        request({ url: API_URLs.measured, method: 'GET' }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                // console.log(body);
                var response = JSON.parse(body);
                // console.log(response);
                self.processMeasuredTidesData(response);
            } else {
                console.error("Bad request for MMM-NOAATides | Measured-Data: " + API_URLs.measured)
            }
        });

        // I WISH THIS WORKED -- there is probably something silly that I don't konw to make this happen...
        // fetch(API_URLs.measured)
        //     .then(response => {
        //         if (!response.ok) {
        //             throw new Error('Predicted tides NOAA API response was not ok');
        //         }
        //         //console.log(response); //only uncomment this if you are checking for data returned by NOAA/ trying to see the format -- still in JSON format
        //     })
        //     .then(response => response.json())
        //     .then(data => self.processMeasuredTidesData(data))
        //     .catch((error) => {
        //         console.error('Error:', error);
        //     });

        // OUTDATED, but definitely works...
        request({ url: API_URLs.predicted, method: 'GET' }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                // console.log(body);
                var response = JSON.parse(body);
                // console.log(response);
                self.processPredictedTidesData(response);
            } else {
                console.error("Bad request for MMM-NOAATides | Predicted-Data: " + API_URLs.predicted)
            }
        });

        // I WISH THIS WORKED -- there is probably something silly that I don't konw to make this happen...
        // fetch(API_URLs.predicted)
        //     .then(response => {
        //         if (!response.ok) {
        //             throw new Error('Predicted tides NOAA API response was not ok! -- Check API URL or parameters');
        //         }
        //         // console.log(response); //only uncomment this if you are checking for data returned by NOAA/ trying to see the format -- still in JSON format
        //     })
        //     .then(response => response.json())
        //     .then(data => self.processPredictedTidesData(data));
        //     .catch((error) => {
        //         console.error('Error:', error);
        //     });

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