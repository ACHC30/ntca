import React from 'react';
import MapWithPin from '../MapWithPin'; // Assuming MapWithPin is a component in your project

function LocationPage({ formData, setFormData, address, setAddress}) {
    const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const handleAddressChange = (newAddress) => {
    setAddress(newAddress);
    setFormData((prevFormData) => ({
      ...prevFormData,
      location: newAddress // Update location field in formData
    }));
  };
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
      <label>Location Cattle found: <span style={{ color: 'red' }}> *</span> </label>
      <MapWithPin address={address} setAddress={handleAddressChange} />
      <input
        type="text"
        name="location"
        value={formData.location || ''}
        onChange={handleChange}
        placeholder="Address"
        readOnly
      />
      <br />
    </div>
  );
}

export default LocationPage;
