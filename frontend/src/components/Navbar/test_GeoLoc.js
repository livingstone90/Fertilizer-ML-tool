import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "600px",
};

function Location() {
  const [center, setCenter] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.permissions && navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((result) => {
          if (result.state === "granted") {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                setCenter({
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                });
              },
              (error) => {
                setError(error.message);
              }
            );
          } else if (result.state === "prompt") {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                setCenter({
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                });
              },
              (error) => {
                setError(error.message);
              }
            );
          } else if (result.state === "denied") {
            setError("Geolocation permission denied.");
          }
        })
        .catch((error) => {
          setError(error.message);
        });
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <LoadScript googleMapsApiKey="AIzaSyBS_mjA-fgnixTddWE4Gm1IHemufz8JqUU">
      {center ? (
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
          <Marker position={center} />
        </GoogleMap>
      ) : (
        <div>Loading map...</div>
      )}
    </LoadScript>
  );
}

export default Location;












/*
const containerStyle = {
  width: "100%",
  height: "400px",
};

function Location() {
  const [center, setCenter] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          setError(error.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <LoadScript googleMapsApiKey="AIzaSyBS_mjA-fgnixTddWE4Gm1IHemufz8JqUU">
      {center ? (
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
          <Marker position={center} />
        </GoogleMap>
      ) : (
        <div>Loading map...</div>
      )}
    </LoadScript>
  );
}

export default Location;
*/

/*

function Location() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    // Check if geolocation is available
    if (navigator.geolocation) {
      // Get the user's location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Save the location in state
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const apiKey = "AIzaSyBS_mjA-fgnixTddWE4Gm1IHemufz8JqUU";

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      {location && (
        <GoogleMap
          mapContainerStyle={{ height: "400px" }}
          center={location}
          zoom={12}
        >
          <Marker position={location} />
        </GoogleMap>
      )}
    </LoadScript>
  );
}

export default Location;
*/


