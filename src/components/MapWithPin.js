import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';

const MapWithPin = () => {
  const [pinCoords, setPinCoords] = useState(null);
  const [address, setAddress] = useState('');

  useEffect(() => {
    // Fetch user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPinCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
  }, []);

  const handleMapClick = ({ lat, lng }) => {
    setPinCoords({ lat, lng });
    getAddressFromCoordinates(lat, lng);
  };

  const getAddressFromCoordinates = (lat, lng) => {
    const geocoder = new window.google.maps.Geocoder();
    const latLng = new window.google.maps.LatLng(lat, lng);

    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          setAddress(results[0].formatted_address);
        } else {
          setAddress('Location not found');
        }
      } else {
        setAddress('Geocoder failed due to: ' + status);
      }
    });
  };

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyAT48JtEH6vUlz2MnEPs4S6evoCTEYAhDc', libraries: ['places'] }}
        defaultCenter={{ lat: 0, lng: 0 }}
        defaultZoom={4}
        center={pinCoords}
        onClick={handleMapClick}
      >
        {pinCoords && <Pin lat={pinCoords.lat} lng={pinCoords.lng} />}
      </GoogleMapReact>
      <div>
        <label>Address:</label>
        <input type="text" value={address} readOnly />
      </div>
    </div>
  );
};

const Pin = () => <div style={{ color: 'red', fontSize: '24px' }}>📍</div>;

export default MapWithPin;
