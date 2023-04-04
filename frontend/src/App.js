import React from 'react';

import FrontendApp from './components/Navbar/Navbar.jsx'
//import MapChart from  './components/Navbar/village_pred.js'
// import MapComponent from  './components/Navbar/TanzanianMap.jsx'
// import MapComponent from  './components/Navbar/map_TZ.jsx'
import MapComponent from  './components/Navbar/selectboxes.js'
// import MapComponent from  './components/Navbar/map.js'
import Highcharts from 'highcharts';

window.Highcharts = Highcharts;

function App() {

  return (
    <div className='App'>
    
  <MapComponent/>

  {/* <VillageForm /> */}

  

    </div>
  );
}

export default App;
