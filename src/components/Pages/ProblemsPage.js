import React from 'react';

function ProblemsPage({ problems, formData, setFormData }) {
  const handleChangeProblems = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      // If the checkbox is checked, add its value to the array
      // If it's unchecked, remove its value from the array
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: checked
          ? [...(prevFormData[name] || []), value]
          : (prevFormData[name] || []).filter((item) => item !== value),
      }));      
    }
  };
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
            onChange={handleChangeProblems}
          />
          <label>{problem}</label>
          <br />
        </div>
      ))}
    </div>
  );
}

export default ProblemsPage;
