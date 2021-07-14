# MMM-NOAATides

This an extension for the [MagicMirror](https://github.com/MichMich/MagicMirror).

![Alt text](Capture.PNG?raw=true "MMM-NOAATides screenshot")

The module graphs low and high tide predictions for a given tide stations, and measured data as it is reported. Data is pulled from [NOAA-tidesandcurrents](https://tidesandcurrents.noaa.gov/map/index.html). Data is a free service - paid by tax dollars. Go USA!

## Dependencies

* An installation of [MagicMirror<sup>2</sup>](https://github.com/MichMich/MagicMirror)
* Packages: `chartjs` & `node-fetch`, both loaded via npm install

## Installation

1. Clone this repo into `~/MagicMirror/modules` directory.
2. cd MMM-NOAATides
3. npm install
4. Configure your `~/MagicMirror/config/config.js`:

    ```
      {
        module: "MMM-NOAATides",
        position: "top_right", //put this below a weather module in config.js, and so it is on screen
        config: {
          stationID: 8518750, // this happens to be the station at 'the Battery' in NYC, USA
          datum: "MSL", // "mean sea level"
          time: "lst_ldt", // local standard time/ daylight time
          units: "english", // or "metric"
          chartJS:{
            aspectRatio: 1.618
          }
        }
      }
    ```

## Configuration options

The following properties can be configured:

| **Option** | **Values** | **Description** |
| --- | --- | --- |
| `stationID` | **REQUIRED** | The ID number of the NOAA tide station you want to graph. You can find your local tide station, and the code you want [here](https://tidesandcurrents.noaa.gov/map/index.html). https://tidesandcurrents.noaa.gov/map/
| `datum` | OPTIONAL | The selected is "[mean sea level](https://tidesandcurrents.noaa.gov/datum_options.html)." You probably want to stick to that option.
| `time` | OPTIONAL | Local standard time/ daylight time -- other options available, but you don't want them...
| `units` | OPTIONAL | This defaults to whatever your Magic Mirror units are set to be. The only reason to use is to switch to `metric` tide-heights.
| `language` | OPTIONAL | Sorry, I didn't do anything with this yet...
| --- | --- | --- |
| `chartJS.animationDuration` | OPTIONAL | milliseconds to expand datapoints away from zero on the X axis, every rendering
| `chartJS.aspectRatio` | OPTIONAL | 1=square graph, >1=wider, <1=taller 
| `chartJS.fillBetween` | OPTIONAL | boolean colors-in area between predicted and measured data
| `chartJS.measured.backgroundColor` | OPTIONAL | Graph color options [read more](https://www.chartjs.org/docs/latest/general/colors.html)
| `chartJS.measured.borderColor` | OPTIONAL | Graph color options [read more](https://www.chartjs.org/docs/latest/general/colors.html)
| `chartJS.measured.pointBorderColor` | OPTIONAL | Graph color options [read more](https://www.chartjs.org/docs/latest/general/colors.html)
| `chartJS.measured.pointBackgroundColor` | OPTIONAL | Graph color options [read more](https://www.chartjs.org/docs/latest/general/colors.html)
| `chartJS.predicted.borderColor` | OPTIONAL | Graph color options [read more](https://www.chartjs.org/docs/latest/general/colors.html)
| `chartJS.predicted.pointBorderColor` | OPTIONAL | Graph color options [read more](https://www.chartjs.org/docs/latest/general/colors.html)
| `chartJS.predicted.pointBackgroundColor` | OPTIONAL | Graph color options [read more](https://www.chartjs.org/docs/latest/general/colors.html)
