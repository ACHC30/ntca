import React from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

function PersonInfo({ formData, setFormData, reportersRole, errors }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    if(name === "name"){
      if (/\d/.test(value)){
        e.preventDefault();
      }
      else{
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));
      }
    }
    else{
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
    
  };
  const handleChangePhoneNum = (value, name) => {
    if (name === 'phone') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value.target.value,
      }));
    }
  };
  return (
    <div>
      <h2>Personal Information</h2>
      <label>Name:</label>
      <input
        type="text"
        name="name"
        value={formData.name || ''}
        onChange={handleChange}
        placeholder="Name"
      />
      <br />
      <label> Email: <span style={{ color: 'red' }}> *</span> </label>
        <input
          type="email"
          name="email"
          value={formData.email || ''}
          onChange={handleChange}
          placeholder="Email"
        />
      {errors && <span style={{ color: 'red' }}>{errors}</span>}
      <br />
      <PhoneInput
        international={false}
        defaultCountry="AU"
        value={formData.phone || ''}
        onChange={(value) => handleChangePhoneNum(value, 'phone')}
        placeholder="Enter Phone Number"
        style={{ width: '200px', margin: '0 auto' }}
      />
      <br />
      <label>Reporter's Role:</label>
      <select
        name="reportersRole"
        value={formData.reportersRole || ''}
        onChange={handleChange}
      >
        <option value="">Select An Option</option>
        {reportersRole.map((role, index) => (
          <option key={index} value={role}>
            {role}
          </option>
        ))}
      </select>
      <br />
    </div>
  );
}
  
export default PersonInfo;