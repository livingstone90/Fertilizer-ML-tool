import React from "react";
import { Fetch } from "react-request";
import Highmaps from "highcharts/highmaps";
import {
  HighchartsMapChart,
  withHighmaps,
  Title,
  Subtitle,
  Tooltip,
  MapSeries,
  MapNavigation,
  Credits,
  XAxis,
  Legend
} from "react-jsx-highmaps";

import * as map_data from './tz-geojson.json'
const colorAxis = {
  minColor: "#FFFFFF",
  maxColor: "#006666" //Highcharts.getOptions().colors[0]
};

class Map extends React.Component {
  render() {
    const tooltipFormatter = function() {
      // console.log(this.key);
      return `${this.key}: ${this.point.value}`;
    };

    console.log({map_data})
    return (
      <div className="app">
        
                <HighchartsMapChart map={map_data.features} colorAxis={colorAxis}>
                  <Title>Tanzania</Title>

                  <Subtitle>
                    Demo of drawing all areas in the map, only highlighting
                    partial data
                  </Subtitle>

                  {/* <MapSeries
                    name="Area"
                    states={{
                      hover: {
                        color: "#BADA55"
                      }
                    }}
                    
                    dataLabels={{
                      enabled: true,
                      color: "#FFFFFF",
                      format: "{point.name}"
                    }}
                  /> */}

                  <MapNavigation>
                    <MapNavigation.ZoomIn />
                    <MapNavigation.ZoomOut />
                  </MapNavigation>

                  <Tooltip formatter={tooltipFormatter} />
                  <Credits />
                  <Legend />
                  <XAxis />
                </HighchartsMapChart>
      </div>
    );
  }
}

export default withHighmaps(Map, Highmaps);
