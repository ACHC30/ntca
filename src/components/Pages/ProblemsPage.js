import React from 'react';

function ProblemsPage({ problems, formData, handleChange }) {
  return (
    <div>
      <h2>Problems Present</h2>
      {problems.map((problem, index) => (
        <div key={index}>
          <input
            key={index}
            type="checkbox"
            name="problems"
            value={problem}
            checked={formData.problems && formData.problems.includes(problem)}
            onChange={handleChange}
          />
          <label>{problem}</label>
          <br />
        </div>
      ))}
    </div>
  );
}

export default ProblemsPage;
