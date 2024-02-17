import React from 'react';

function NumberMainPage({ formData, setFormData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (
    <div>
      <h2>What have you seen in a cattle?</h2>
      <label>Approximate number of cattle affected? <span style={{ color: 'red' }}> *</span> </label>
      <input
        type="text"
        name="affected"
        value={formData.affected || ''}
        onChange={handleChange}
        placeholder="1-2-3"
      />
      <br />
      <label>Approximate number of cattle dead?</label>
      <input
        type="text"
        name="dead"
        value={formData.dead || ''}
        onChange={handleChange}
        placeholder="1-2-3"
      />
      <br />
      <label>Total number of yard at risk?</label>
      <input
        type="text"
        name="risk"
        value={formData.risk || ''}
        onChange={handleChange}
        placeholder="1-2-3"
      />
      <br />
      <label>Date Problem Seen?</label>
      <input
        type="date"
        name="dateSeen"
        value={formData.dateSeen || ''}
        onChange={handleChange}
      />
    </div>
  );
}

export default NumberMainPage;
