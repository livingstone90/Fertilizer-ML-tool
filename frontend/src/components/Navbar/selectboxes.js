import React, { Component } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from './images/marker-icon.png';
import markerIcon2x from './images/marker-icon-2x.png';
import markerShadow from './images/marker-shadow.png';
import Select from 'react-select';
import './TanzanianaMap.css'; // import CSS file with flexbox layout styles
import './css/style.css';
import { Row, Col, InputGroup, Button , Nav, Navbar, Container} from 'react-bootstrap';

class MapComponent extends Component {
  
  state = {
    villages: [],
    selectedVillage: {
      name: '',
      latitude: '',
      longitude: '',
      predicted_practice: null
    },

    predictedPractice: null // add predictedPractice to the state
    
  };

  

  async componentDidMount() {
    try {
      const response = await fetch('http://localhost:8000/village_pred/');
      const data = await response.json();

      const uniqueVillages = Array.from(new Set(data.data));
      this.setState({ villages: uniqueVillages });



      navigator.geolocation.getCurrentPosition(function (position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        let latInput = document.getElementById('lat');
        latInput.value = `${lat}`;
        let lngInput = document.getElementById('lng');
        lngInput.value = `${lng}`;
      });
    } catch (error) {
      console.log(error);
    }

    // create map
    this.map = L.map('map', {
      center: [-6.369, 34.8888],
      zoom: 10,
    });

    // add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
    }).addTo(this.map);
    // add markers for each village
    this.state.villages.forEach((village) => {
      const { name, latitude, longitude, predicted_practice } = village;

      const markerIconDefault = L.icon({
        iconUrl: markerIcon,
        iconRetinaUrl: markerIcon2x,
        shadowUrl: markerShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41],
      });

      L.marker([latitude, longitude], { icon: markerIconDefault })
        .bindPopup(`Village: ${name}`)
        .addTo(this.map)
      village.predicted_practice = predicted_practice;
      console.log(predicted_practice)
    } );
    
  }

  handleVillageSelect = (event) => {
      // Clear the predictedPractice property
    this.setState({ predictedPractice: "" });

    const selectedVillage = this.state.villages.find(
      (village) => village.name === event.target.value);

 

    if (selectedVillage) {
      this.setState({ selectedVillage });
      const { name, latitude, longitude,predicted_practice} = selectedVillage;
     
   
        // center map on selected village
        this.map.panTo([latitude, longitude]);
      
        const markerIconDefault = L.icon({
          iconUrl: markerIcon,
          iconRetinaUrl: markerIcon2x,
          shadowUrl: markerShadow,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          tooltipAnchor: [16, -28],
          shadowSize: [41, 41],
        });
      
        // create marker for selected village
        // const marker = L.marker([latitude, longitude], { icon: markerIconDefault }).addTo(this.map);
      
        // bind popup to marker
        // marker.bindPopup(`Village: ${name}`).openPopup();
      
        // update input values with selected village coordinates
        const latInput = document.getElementById('lat');
        const lngInput = document.getElementById('lng');
        latInput.value = latitude;
        lngInput.value = longitude;

            // set the predicted_practice property in the state
          // set the predicted_practice property in the state
      this.setState({ selectedVillage: { ...selectedVillage, predicted_practice } });
   
      } else {
        this.setState({ selectedVillage: null });
      }
      };
      
      
      handlePrediction = () => {
        const latInput = document.getElementById('lat');
        const lngInput = document.getElementById('lng');
        const lat = latInput.value;
        const lng = lngInput.value;
        
        
      
        const  selectedVillage = this.state.villages.find((village) => village.latitude === parseFloat(lat) && village.longitude === parseFloat(lng));;
        
            // update the state with the predicted practice

        if (lat && lng) {
          if (selectedVillage ) {
            // show predicted practice for selected village
            const { name, latitude, longitude,predicted_practice} = selectedVillage;
            
            // center map on selected village
            this.map.panTo([latitude, longitude]);
            

            const markerIconDefault = L.icon({
              iconUrl: markerIcon,
              iconRetinaUrl: markerIcon2x,
              shadowUrl: markerShadow,
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              tooltipAnchor: [16, -28],
              shadowSize: [41, 41],
            });

            const marker = L.marker([latitude, longitude], { icon: markerIconDefault }).addTo(this.map);
      
            // bind popup to marker
            marker.bindPopup(`${name} : ${predicted_practice}`).openPopup();

            // alert(`Predicted practice for ${predicted_practice}`);
      

          } else {
          // show predicted practice for nearest village within bounds
            const { villages } = this.state;
            const nearestVillage = villages.reduce((prev, curr) => {
              const prevDistance = L.latLng(lat, lng).distanceTo(L.latLng(prev.latitude, prev.longitude));
              const currDistance = L.latLng(lat, lng).distanceTo(L.latLng(curr.latitude, curr.longitude));
              return currDistance < prevDistance ? curr : prev;
          });
      
           if (nearestVillage) {
              const distance = L.latLng(lat, lng).distanceTo(L.latLng(nearestVillage.latitude, nearestVillage.longitude));
              if (distance < 100000) {
                // show predicted practice for nearest village
                alert(`Predicted practice for ${nearestVillage.name}: ${nearestVillage.predictedPractice}`);
      
                // center map on nearest village
                this.map.panTo([nearestVillage.latitude, nearestVillage.longitude]);
      
                const markerIconDefault = L.icon({
                  iconUrl: markerIcon,
                  iconRetinaUrl: markerIcon2x,
                  shadowUrl: markerShadow,
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  tooltipAnchor: [16, -28],
                  shadowSize: [41, 41],
                });
      
              // create marker for nearest village
                const marker = L.marker([nearestVillage.latitude, nearestVillage.longitude], { icon: markerIconDefault }).addTo(this.map);
      
                // bind popup to marker
                marker.bindPopup(`Village: ${nearestVillage.name}`).openPopup();
                
            } else {
              alert("You are too far from any village in this region");
            }
          } else {
            alert("No village found in this region");
          }
        }
      } else {
        alert("Please enter latitude and longitude values");
      }

      
      };
      
      render() {
        const { villages, selectedVillage } = this.state;
        
        
    
        return (
          <div>
            <br></br>
            <div className='Nav-bar'>
            <Navbar bg="primary" variant="dark">
            <Container>
              <Navbar.Brand href="#home">Welcome to Fertilizer Recommendation Tool</Navbar.Brand>
              
            </Container>
          </Navbar>
            </div>
             <br></br>
        <Row className="align-items-center">
          <Col>
            <select className="widget" value={selectedVillage ? selectedVillage.name : ''} onChange={this.handleVillageSelect}>
              <option value="">Select a village</option>
              {villages.map((village) => (
                <option key={village.name} value={village.name}>
                  {village.name}
                </option>
              ))}
            </select>
          </Col>
          <Col>
            <InputGroup>
            <InputGroup.Text>Latitude:</InputGroup.Text>
              <input id='lat' placeholder='your lat..' className="widget"></input>
            </InputGroup>
          </Col>
          <Col>
            <InputGroup>
            <InputGroup.Text>Longitude:</InputGroup.Text>
              <input id='lng' placeholder='your long..' className="widget"></input>
            </InputGroup>
          </Col>
          <Col>
           
            <Button variant="primary" style={{ backgroundColor: 'black', borderColor: 'black' }}  className="my-button"
            onClick={this.handlePrediction}>Predict</Button>{' '}

          </Col>
        </Row>
        <br></br>
            <div id="map" style={{ height: '500px' }}></div>
             </div>
           );
           }
           }
    export default MapComponent;