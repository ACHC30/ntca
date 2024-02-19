import React from 'react';
import '../../css/TypePage.css';

function TypePage({ formData, setFormData, cattleTypesAges }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  return (
    <div className='TypePage'>
      <h2>What have you seen in the cattle?</h2>
      <div className='selectFrame'>
        <label>Types/ages of cattle affected?</label>
        <br />
        <select
          className='select'
          name="cattleAffected"
          value={formData.cattleAffected || ''}
          onChange={handleChange}
        >
          <option value="">Select An Option</option>
          {cattleTypesAges.map((ta, index) => (
            <option key={index} value={ta}>
              {ta}
            </option>
          ))}
        </select>
      </div>
      <br />
      <div className='inputFrames'>
        <label>Other Comments</label>
        <br />
        <input
          className='input'
          type="text"
          name="comment"
          value={formData.comment || ''}
          onChange={handleChange}
        />
      </div>
      <br />
    </div>
  );
}

export default TypePage;
