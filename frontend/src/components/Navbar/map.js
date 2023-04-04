
import React, { Component } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from './images/marker-icon.png';
import markerIcon2x from './images/marker-icon-2x.png';
import markerShadow from './images/marker-shadow.png';
import Select from 'react-select';
import './TanzanianaMap.css';
import { Row, Col, InputGroup, Button , Nav, Navbar, Container} from 'react-bootstrap';

class MapComponent extends Component {
  state = {
    villages: [],
    selectedVillage: null,
    predictedPractice: null
  };

  async componentDidMount() {
    try {
      const response = await fetch('http://localhost:8000/village_pred/');
      const data = await response.json();

      const uniqueVilages = Array.from(new Set(data.data))
      this.setState({ villages: uniqueVilages});
      
      navigator.geolocation.getCurrentPosition(function(position) {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        let latInput = document.getElementById('lat')
        latInput.value = `Your latitude: ${lat}`
        let lngInput = document.getElementById('lng')
        lngInput.value = `Your longitude: ${lng}`
      });
    } catch (error) {
      console.log(error);
    }

    // create map
    this.map = L.map('map', {
      center: [-6.3690, 34.8888],
      zoom: 10,
    });

    // add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    // add markers for each village
    this.state.villages.forEach((village) => {
      const { name, latitude, longitude } = village;

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
        .addTo(this.map);
    });
  }
handleVillageSelect = (event) => {
  const selectedVillage = this.state.villages.find(
    (village) => village.name === event.target.value
  );

  if (selectedVillage) {
    this.setState({ selectedVillage });
    const { name, latitude, longitude } = selectedVillage;
 
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
      const marker = L.marker([latitude, longitude], { icon: markerIconDefault }).addTo(this.map);
    
      // bind popup to marker
      marker.bindPopup(`Village: ${name}`).openPopup();
    
      // update input values with selected village coordinates
      const latInput = document.getElementById('lat');
      const lngInput = document.getElementById('lng');
      latInput.value = latitude;
      lngInput.value = longitude;
    } else {
      this.setState({ selectedVillage: null });
    }
    };
  handlePredict = () => {
  const lat = document.getElementById('lat').value;
  const lng = document.getElementById('lng').value;
  const selectedVillage = this.state.villages.find((village) => village.latitude === parseFloat(lat) && village.longitude === parseFloat(lng));;
  if(selectedVillage) {
    // center map on selected village
    this.map.panTo([selectedVillage.latitude, selectedVillage.longitude]);
  
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
    const marker = L.marker([selectedVillage.latitude, selectedVillage.longitude], { icon: markerIconDefault }).addTo(this.map);
  
    // bind popup to marker
    marker.bindPopup(`Village: ${selectedVillage.name}`).openPopup();
  
    // get predicted practice for selected village
    const practice = selectedVillage.predicted_practice;
    alert(`Predicted practice for ${selectedVillage.name}: ${practice}`);
  } else {
    alert("You are away from region.");
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
            <Navbar.Brand href="#home">Welcome to Tanzanian Villages Map</Navbar.Brand>
            <Nav className="me-auto">
            </Nav>
            <InputGroup className="mb-3">
              <InputGroup.Text>Choose a village:</InputGroup.Text>
              <select className='form-select' onChange={this.handleVillageSelect}>
                <option defaultValue>Select a village</option>
                {villages.map((village) => (
                  <option key={village.name}>{village.name}</option>
                ))}
              </select>
            </InputGroup>
          </Container>
        </Navbar>
      </div>
  
      <Row>
  
        <Col>
          <InputGroup className="mb-3">
            <InputGroup.Text>Latitude:</InputGroup.Text>
            <input type="text" className='form-control' id='lat' defaultValue='' />
          </InputGroup>
  
          <InputGroup className="mb-3">
            <InputGroup.Text>Longitude:</InputGroup.Text>
            <input type="text" className='form-control' id='lng' defaultValue='' />
          </InputGroup>
  
          <Button variant='primary' onClick={this.handlePredict}>Predict</Button>
        </Col>
      </Row>
      <br></br>
            <div id="map" style={{ height: '500px' }}></div>
    </div>
  );

}
}

export default MapComponent;
  