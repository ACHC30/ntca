import {React, useState} from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const MapWithPin = () => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyAT48JtEH6vUlz2MnEPs4S6evoCTEYAhDc' // Replace with your API key
  });

  const [position, setPosition] = useState({ lat: 51.505, lng: -0.09 });

  const handleMarkerDrag = (event) => {
    setPosition({
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
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
    </div>
  ) : null;
};

export default MapWithPin;
