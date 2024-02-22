import React from 'react';
import '../../css/NumberMainPage.css'

function NumberMainPage({ formData, setFormData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (
    <div className='NumberMainPage'>
      <h2>What have you seen in a cattle?</h2>
      <div className='inputFrames'>
        <label>Approximate number of cattle affected? <span style={{ color: 'red' }}> *</span> </label>
        <br />
        <input
          className='input'
          type="number"
          name="affected"
          value={formData.affected || ''}
          onChange={handleChange}
        />
      </div>
      <br />
      <div className='inputFrames'>
        <label>Approximate number of cattle dead?</label>
        <br />
        <input
          className='input'
          type="number"
          name="dead"
          value={formData.dead || ''}
          onChange={handleChange}
        />
      </div>
      <br />
      <div className='inputFrames'>
        <label>Total number of yard at risk?</label>
        <br />
        <input
          className='input'
          type="number"
          name="risk"
          value={formData.risk || ''}
          onChange={handleChange}
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