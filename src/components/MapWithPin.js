import { React, useState, useEffect } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const MapWithPin = ({address, setAddress}) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY // Replace with your API key
  });

  const [position, setPosition] = useState({ lat: 51.505, lng: -0.09 });
  
  useEffect(() => {
    // Fetch user's current position using Geolocation API
    if (address) {
      const geocoder = new window.google.maps.Geocoder();
  
      geocoder.geocode({ address: address }, (results, status) => {
        if (status === 'OK') {
          const location = results[0].geometry.location;
          setPosition({ lat: location.lat(), lng: location.lng() });
        } else {
          console.error('Geocode was not successful for the following reason:', status);
        }
      });
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, [address]);

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
          setAddress('No results found');
        }
      } else {
        setAddress('Geocoder failed due to: ' + status);
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
      {/* <div style={{ background: 'white', color:"black",position: 'absolute', top: '10px', left: '10px', padding: '10px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
        <strong>Address:</strong> {props.address}
      </div> */}
    </div>
  ) : null;
};

export default MapWithPin;
