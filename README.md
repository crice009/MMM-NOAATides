# MMM-NOAATides

This an extension for the [MagicMirror](https://github.com/MichMich/MagicMirror).

![Alt text](Capture.PNG?raw=true "MMM-NOAATides screenshot")

It graphs low and high tide predictions for a given tide stations, and measured data as it is reported. Data is pulled from [NOAA-tidesandcurrents](https://tidesandcurrents.noaa.gov/map/index.html). Data is a free service paid for, by tax dollars. Go USA!

A little background on how this works & came to be: [docs](https://crice009.github.io/MMM-NOAATides/)

## Dependencies

* An installation of [MagicMirror<sup>2</sup>](https://github.com/MichMich/MagicMirror)
* Packages: chartjs, loaded via npm install

## Installation

1. Clone this repo into `~/MagicMirror/modules` directory.
2. cd MMM-NOAATides
3. npm install
4. Configure your `~/MagicMirror/config/config.js`:

    ```
      {
        module: "MMM-NOAATides",
        position: "top_right",
        config: {
          stationID: 8465705, //this happens to be the station at New Haven, CT
          datum: "MSL", // the selected is "mean sea level" https://tidesandcurrents.noaa.gov/datum_options.html
          time: "lst_ldt", //local standard time/ daylight time
          units: "english", //or "metric"  It will also handle the MM 'imperial' just fine..
        }
      }
    ```

## Configuration options

The following properties can be configured:

| **Option** | **Values** | **Description** |
| --- | --- | --- |
| `stationID` | **REQUIRED** | The id number of the NOAA tide station you want to graph. you can find your local tide station, and the code you want here: https://tidesandcurrents.noaa.gov/map/index.html
| `datum` | OPTIONAL | the selected is "mean sea level" https://tidesandcurrents.noaa.gov/datum_options.html
| `time` | OPTIONAL | local standard time/ daylight time -- other options available, but you don't want them
| `units` | OPTIONAL | this defaults to whatever your Magic Mirror units are set to be... maybe switch to 'english'
| `language` | OPTIONAL | sorry, I didn't do anything with this yet...