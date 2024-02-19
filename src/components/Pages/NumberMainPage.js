import React from 'react';
import '../../css/NumberMainPage.css'

function NumberMainPage({ formData, setFormData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    if(name !== "dateSeen"){
      if (!/\d/.test(value)){
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

  return (
    <div className='NumberMainPage'>
      <h2>What have you seen in a cattle?</h2>
      <div className='inputFrames'>
        <label>Approximate number of cattle affected? <span style={{ color: 'red' }}> *</span> </label>
        <br />
        <input
          className='input'
          type="text"
          name="affected"
          value={formData.affected || ''}
          onChange={handleChange}
          placeholder="1-2-3"
        />
      </div>
      <br />
      <div className='inputFrames'>
        <label>Approximate number of cattle dead?</label>
        <br />
        <input
          className='input'
          type="text"
          name="dead"
          value={formData.dead || ''}
          onChange={handleChange}
          placeholder="1-2-3"
        />
      </div>
      <br />
      <div className='inputFrames'>
        <label>Total number of yard at risk?</label>
        <br />
        <input
          className='input'
          type="text"
          name="risk"
          value={formData.risk || ''}
          onChange={handleChange}
          placeholder="1-2-3"
        />
      </div>
      <br />
      <div className='dateFrame'>
        <label>Date Problem Seen? <span style={{ color: 'red' }}> *</span></label>
        <br />
        <input
          className='date'
          type="date"
          name="dateSeen"
          value={formData.dateSeen || ''}
          onChange={handleChange}
        />
      </div>
      <br />
    </div>
  );
}

export default NumberMainPage;