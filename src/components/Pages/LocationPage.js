import React from 'react';
import MapWithPin from '../MapWithPin'; // Assuming MapWithPin is a component in your project

function LocationPage({ formData, address, setAddress, handleChange }) {
  return (
    <div>
      <h2>Where were the affected cattle?</h2>
      <label>Property Name:</label>
      <input
        type="text"
        name="property"
        value={formData.property || ''}
        onChange={handleChange}
        placeholder="Property Name"
      />
      <br />
      <label>PIC - If Known:</label>
      <input
        type="text"
        name="pic"
        value={formData.pic || ''}
        onChange={handleChange}
        placeholder="PIC"
      />
      <br />
      <label>Location Cattle found:</label>
      <MapWithPin address={address} setAddress={setAddress} />
      <input
        type="text"
        name="location"
        value={formData.location || ''}
        onChange={handleChange}
        placeholder="Address"
      />
      <br />
    </div>
  );
}

export default LocationPage;
