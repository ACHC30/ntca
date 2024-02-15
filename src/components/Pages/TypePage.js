import React from 'react';

function TypePage({ formData, handleChange, cattleTypesAges }) {
  return (
    <div>
      <h2>What have you seen in the cattle?</h2>
      <label>Types/ages of cattle affected?</label>
      <select
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
      <br />
      <label>Other Comments</label>
      <input
        style={{ height: '96px', width: '393px' }}
        type="text"
        name="comment"
        value={formData.comment || ''}
        onChange={handleChange}
      />
    </div>
  );
}

export default TypePage;
