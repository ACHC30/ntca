import React from 'react';
import MapWithPin from '../MapWithPin'; // Assuming MapWithPin is a component in your project
import '../../css/LocationPage.css'

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
    <div className='LocationPage'>
      <h2>Where were the affected cattle?</h2>
      <div className='inputFrames'>
        <label>Property Name:</label>
        <br />
        <input
          className='input'
          type="text"
          name="property"
          value={formData.property || ''}
          onChange={handleChange}
          placeholder="Property Name"
        />
      </div>
      <br />
      <div className='inputFrames'>
        <label>PIC - If Known:</label>
        <br />
        <input
          className='input'
          type="text"
          name="pic"
          value={formData.pic || ''}
          onChange={handleChange}
          placeholder="PIC"
        />
      </div>
      <br />
      <div className='mapsFrame'>
        <label>Location Cattle found: <span style={{ color: 'red' }}> *</span> </label>
        <MapWithPin address={address} setAddress={handleAddressChange} />
        <br />
        <input
          className='input'
          type="text"
          name="location"
          value={formData.location || ''}
          onChange={handleChange}
          placeholder="Address"
          readOnly
        />
      </div>
      <br />
    </div>
  );
}

export default LocationPage;
