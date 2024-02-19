import React from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import '../../css/PersonInfoPage.css'

function PersonInfoPage({ formData, setFormData, reportersRole }) {
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
    <div className='PersonInfoPage'>
      <h2>Who Are You?</h2>
      <br />
      <input
        className='input'
        type="text"
        name="name"
        value={formData.name || ''}
        onChange={handleChange}
        placeholder="Name"
      />
      <br />
        <input
          className='input'
          type="email"
          name="email"
          value={formData.email || ''}
          onChange={handleChange}
          placeholder="Email*"
        />
      <br />
      <div className='phonenum'>
        <label>Phone Number</label>
        <br />
        <PhoneInput
          className='phonenumfield'
          international={false}
          defaultCountry="AU"
          value={formData.phone || ''}
          onChange={(value) => handleChangePhoneNum(value, 'phone')}
          placeholder="+61"
        />
      </div>
      <br />
      <div className='dropdown'>
        <label>Reporter's Role:</label>
        <br />
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
      </div>
      <br />
    </div>
  );
}
  
export default PersonInfoPage;