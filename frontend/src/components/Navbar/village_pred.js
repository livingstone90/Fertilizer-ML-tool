import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMap from 'highcharts/modules/map';
import mapData from '@highcharts/map-collection/countries/tz/tz-all.geo.json';

import './map.css'

HighchartsMap(Highcharts);

const MapChart = () => {
  const [location, setLocation] = useState(null);
 

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      });
    }
  }, []);


  const options = {
    chart: {
      map: mapData,
      height: '60%' // set the new height of the map container

    },
    title: {
      text: 'Tanzania'
    },
    series: [
      {
        type: "map",
        mapData
      },
    {
      type: 'mapbubble',
      name: 'Your Location',
      data: location ? [{ lat: location.lat, lon: location.lon }] : [],
      color: 'red',
      tooltip: {
        pointFormat: '<b>{point.name}</b><br/>{point.lat}, {point.lon}'
      }
    }],
    mapNavigation: {
      enabled: true,
      enableButtons: false,
      enableTouchZoom: true,
      enableDoubleClickZoom: false,
      zoom: 10 ,// Adjust the default zoom level
      buttonOptions: {
        verticalAlign: 'bottom'
      }
    },
    credits: {
      enabled: false
    }
  };

  return (
    <div className="map-container" style={{ height: '100vh' }}>
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      constructorType={'mapChart'}
      className={'tanzania-map'}
    
    />
    </div>
  );
};

export default MapChart;
