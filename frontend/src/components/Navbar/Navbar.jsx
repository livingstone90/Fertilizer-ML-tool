import React, { useState, useEffect } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import Select from 'react-select';
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMap from 'highcharts/modules/map';
import mapData from '@highcharts/map-collection/countries/tz/tz-all.geo.json';

import axios from 'axios';

import './css/Navbar.css';




const FrontendApp = () => {
  
    const customStyles = {
        control: (provided) => ({
          ...provided,
          border: '2px solid blue', // Added
          borderRadius: '5px', // Added
          boxShadow: 'none'
         
        }),
      };

      const [villages, setVillages] = useState([]);
      const [selectedVillage, setSelectedVillage] = useState(null);
      const [villageDetail, setvillageDetail] = useState(null);
      const [location, setLocation] = useState(null);


      useEffect(() => {
        axios.get('http://localhost:8000/village_pred/')
          .then(response => setVillages(response.data.data))
          .catch(error => console.error(error));
      }, []);

      const handleVillageChange = (selectedOption) => {
        setSelectedVillage(selectedOption);
        axios
          .get(`http://localhost:8000/villages_detail/${selectedOption.value}/`)
          .then((response) => {
            setvillageDetail(response.data);
          });
      }

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


      const options1 = villages.map(village => ({
        value: village.name,
        label: village.name,
      }));

      const options = {
        chart: {
          map: mapData,
          height: 1000, // set the initial height of the map container
          width: 1000,
    
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
          type: 'mappoint',
          name: 'Your Location',
          states: {
            hover: {
                color: '#BADA55'
            }
        },
          data: villageDetail ? [{ lat: villageDetail.latitude, lon: villageDetail.longitude }] : [],
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
    <div className="App">
      <Navbar bg="primary" variant="dark" expand="lg">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#about-us">About Us</Nav.Link>
            <Nav.Link href="#contact">Contact</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <br></br>
      <h1 >Welcome to Fertilizer Recommendation Tool</h1>, 
      <br></br>
      <div className="body">

      <br></br>

      <Select
        options={options1}
        className="selection-box"
        onChange={handleVillageChange}
        value={selectedVillage}
        styles={customStyles}
        placeholder="Select a village..."
      />
       <br></br>

        <div>
        {villageDetail && <p>Predicted practice: {villageDetail.predicted_practice}</p>}
        </div>

        <br></br>

        <div className="map-container">
          {/* <HighchartsReact
      highcharts={Highcharts}
      options={options}
      constructorType={'mapChart'}
      className={'tanzania-map'}/> */}
    </div>


      </div>

      
    </div>

    
  );
};

export default FrontendApp;
