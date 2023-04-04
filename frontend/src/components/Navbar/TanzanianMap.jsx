import React, { Component } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from './images/marker-icon.png';
import markerIcon2x from './images/marker-icon-2x.png';
import markerShadow from './images/marker-shadow.png';
import Select from 'react-select';
import './TanzanianaMap.css'; // import CSS file with flexbox layout styles
import { Row, Col, InputGroup, Button , Nav, Navbar, Container} from 'react-bootstrap';

class MapComponent extends Component {
  state = {
    villages: [],
    selectedVillage: null
  };

  async componentDidMount() {
    try {
      const response = await fetch('http://localhost:8000/village_pred/');
      const data = await response.json();

      // const uniqueVilages = Array.from(new Set(data.data))
      // this.setState({ villages: uniqueVilages});

      const villages = new Set();
      data.data.forEach(entry => villages.add(entry.name));

      this.setState({ villages: Array.from(villages) });
      
      navigator.geolocation.getCurrentPosition(function(position) {
      const lat = position.coords.latitude
      const lng = position.coords.longitude
        let latInput = document.getElementById('lat')
        latInput.value = `Your latitude: ${lat}`
        let lngInput = document.getElementById('lng')
        lngInput.value = `Your longitude: ${lng}`

  
        
      });

      console.log(villages)
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
    const selectedVillage = this.state.villages.find((village) => village.name === event.target.value);

    if (selectedVillage) {
      this.setState({ selectedVillage });

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
    } else {
      this.setState({ selectedVillage: null });
    }

    const lat = document.getElementById('lat').value;
    const lng = document.getElementById('lng').value;
    if(this.state.villages.some(village => village.latitude === lat) && this.state.villages.some(village => village.longitude === lng)){
      console.log("in bounds")
    }else{
      console.log("out of bounds")
    }
  };

  

  render() {
    const { villages, selectedVillage  } = this.state;

    return (
      <div>
        <br></br>
        <div className='Nav-bar'>
        <Navbar bg="primary" variant="dark">
        <Container>
          <Navbar.Brand href="#home">Welcome to Fertilizer Recommendation Tool</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#features">Features</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
          </Nav>
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
          <input id='lat' placeholder='your lat..' className="widget"></input>
        </InputGroup>
      </Col>
      <Col>
        <InputGroup>
          <input id='lng' placeholder='your long..' className="widget"></input>
        </InputGroup>
      </Col>
      <Col>
        <Button variant="primary" className="widget">Predict</Button>
      </Col>
    </Row>
    <br></br>
        <div id="map" style={{ height: '500px' }}></div>
         </div>
       );
       }
       }
export default MapComponent;
