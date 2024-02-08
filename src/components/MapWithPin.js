import {React, useState} from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const MapWithPin = () => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyAT48JtEH6vUlz2MnEPs4S6evoCTEYAhDc' // Replace with your API key
  });

  const [position, setPosition] = useState({ lat: 51.505, lng: -0.09 });
  const [address, setAddress] = useState("");

  const handleMarkerDrag = (event) => {
    setPosition({
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    });
    findAddress({
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    })
  };

  const findAddress = (event) => {
    const geocoder = new window.google.maps.Geocoder();
    const latlng = { lat: event.lat, lng: event.lng };

    geocoder.geocode({ 'location': latlng }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          setAddress(results[0].formatted_address);
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  };

  return isLoaded ? (
    <div style={{ height: '400px', width: '100%' }}>
      <GoogleMap
        mapContainerStyle={{ height: '100%', width: '100%' }}
        center={position}
        zoom={13}
        draggableCursor="pointer"
        options={{streetViewControl: false, mapTypeControl: false, fullscreenControl: false}}
      >
        <Marker
          position={position}
          draggable={true}
          onDragEnd={handleMarkerDrag}
        />
      </GoogleMap>
      <div style={{ background: 'white', color:"black",position: 'absolute', top: '10px', left: '10px', padding: '10px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
        <strong>Address:</strong> {address}
      </div>
    </div>
  ) : null;
};

export default MapWithPin;
