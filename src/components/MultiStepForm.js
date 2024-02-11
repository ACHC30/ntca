import React, { useState, useEffect } from 'react';
import MapWithPin from './MapWithPin';

const FORM_STORAGE_KEY = 'multiStepForm';

function MultiStepForm() {
  const [address, setAddress] = useState("");
  const [image, setImage] = useState(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(() => {
    const storedFormData = localStorage.getItem(FORM_STORAGE_KEY);
    const parsedFormData = storedFormData ? JSON.parse(storedFormData) : {};
    
    // Ensure 'Decay' is included in the problems array
    if (parsedFormData.problems && !parsedFormData.problems.includes('Other')) {
      parsedFormData.problems.push('Other');
    } else if (!parsedFormData.problems) {
      parsedFormData.problems = ['Other'];
    }
  
    return parsedFormData;
  });
  

  useEffect(() => {
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      // If the checkbox is checked, add its value to the array
      // If it's unchecked, remove its value from the array
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: checked
          ? [...(prevFormData[name] || []), value]
          : (prevFormData[name] || []).filter((item) => item !== value),
      }));
    } else if (type === 'file') {
      // Handle image upload
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: event.target.result // Store image data URL directly in formData
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

   // Callback function to update address state
   const handleAddressChange = (newAddress) => {
    setAddress(newAddress);
    setFormData((prevFormData) => ({
      ...prevFormData,
      location: newAddress // Update location field in formData
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if at least one checkbox is checked
    if (!formData.problems || formData.problems.length === 0) {
        alert('Please select at least one problem.');
        return;
    }
    // Handle form submission here
    console.log('Form submitted with data:', formData);
    // Clear form data from localStorage
    localStorage.removeItem(FORM_STORAGE_KEY);
    // Optionally, you can clear the form data after submission
    setFormData({});
    // Reset step to 1
    setStep(1);
    // Reset uploaded image after submission
    setImage(null); 
  };

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const renderForm = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2>Personal Information</h2>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
            />
            <br />
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
            />
            <br />
            <label>Phone:</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
            />
            <br />
            <label>Reporters Role:</label>
            <select
              name="reportersRole"
              value={formData.reportersRole || ''}
              onChange={handleChange}
            >
              <option value="">Select Role</option>
              <option value="Farmer">Farmer</option>
              <option value="Veterinarian">Veterinarian</option>
              <option value="Researcher">Researcher</option>
            </select>
            <br />
          </div>
        );
        case 2:
        return (
          <div>
            <h2>Location</h2>
            <label>Property Name:</label>
            <input
              type="text"
              name="property"
              value={formData.property || ''}
              onChange={handleChange}
            />
            <br />
            <label>PIC:</label>
            <input
              type="text"
              name="pic"
              value={formData.pic || ''}
              onChange={handleChange}
            />
            <br />
            <label>Location Cattle is found:</label>
            {/* Pass address state and callback function to MapWithPin component */}
            <MapWithPin address={address} setAddress={handleAddressChange} />
            <input
              style={{width: "50%"}}
              type="text"
              name="location"
              value={formData.location || ''}
              onChange={handleChange}
            />
            <br />
          </div>
        );
        case 3:
        return (
          <div>
            <h2>What have you seen?</h2>
            <label>Approximate number of cattle affected?</label>
            <input
              type="text"
              name="affected"
              value={formData.affected || ''}
              onChange={handleChange}
            />
            <br />
            <label>Approximate number of cattle dead?</label>
            <input
              type="text"
              name="dead"
              value={formData.dead || ''}
              onChange={handleChange}
            />
            <br />
            <label>Total number of yard at risk?</label>
            <input
              type="text"
              name="risk"
              value={formData.risk || ''}
              onChange={handleChange}
            />
            <br />
            <label>Types/ages of cattle affected?</label>
            <select
              name="cattleAffected"
              value={formData.cattleAffected || ''}
              onChange={handleChange}
            >
              <option value="">Select Cattle Type/Age</option>
              <option value="Calves">Calves</option>
              <option value="Heifers">Heifers</option>
              <option value="Cows">Cows</option>
            </select>
            <br />
          </div>
        );
        case 4:
        return (
          <div>
            <h2>Problems</h2>
            <label>Sudden Death</label>
            <input
              type="checkbox"
              name="problems"
              value="Sudden Death"
              checked={formData.problems && formData.problems.includes('Sudden Death')}
              onChange={handleChange}
            />
            <label>Skin lesions/problems</label>
            <input
              type="checkbox"
              name="problems"
              value="Skin lesions/problems"
              checked={formData.problems && formData.problems.includes('Skin lesions/problems')}
              onChange={handleChange}
            />
            <br />
            <label>Mouth or nose lesions</label>
            <input
              type="checkbox"
              name="problems"
              value="Mouth or nose lesions"
              checked={formData.problems && formData.problems.includes('Mouth or nose lesions')}
              onChange={handleChange}
            />
            <label>Lame cattle</label>
            <input
              type="checkbox"
              name="problems"
              value="Lame cattle"
              checked={formData.problems && formData.problems.includes('Lame cattle')}
              onChange={handleChange}
            />
            <br />
            <label>Balance/standing (neurological) problems</label>
            <input
              type="checkbox"
              name="problems"
              value="Balance/standing (neurological) problems"
              checked={formData.problems && formData.problems.includes('Balance/standing (neurological) problems')}
              onChange={handleChange}
            />
            <label>Reproductive issues</label>
            <input
              type="checkbox"
              name="problems"
              value="Reproductive issues"
              checked={formData.problems && formData.problems.includes('Reproductive issues')}
              onChange={handleChange}
            />
            <br />
            <label>Breathing difficulties/coughing</label>
            <input
              type="checkbox"
              name="problems"
              value="Breathing difficulties/coughing"
              checked={formData.problems && formData.problems.includes('Breathing difficulties/coughing')}
              onChange={handleChange}
            />
            <label>Wasting/ill thrift</label>
            <input
              type="checkbox"
              name="problems"
              value="Wasting/ill thrift"
              checked={formData.problems && formData.problems.includes('Wasting/ill thrift')}
              onChange={handleChange}
            />
            <br />
            <label>Other</label>
            <input
              type="checkbox"
              name="problems"
              value="Other"
              checked={formData.problems && formData.problems.includes('Other')}
              onChange={handleChange}
            />
            <br />
            <label>Upload Pictures</label>
            <input
            type="file"
            accept="image/*"
            name="image"
            onChange={handleChange}
            />
            <br />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {renderForm()}
        {step > 1 && (
          <button type="button" onClick={prevStep}>
            Previous
          </button>
        )}
        {step < 4 && (
          <button type="button" onClick={nextStep}>
            Next
          </button>
        )}
        {step === 4 && (
          <button type="submit">
            Submit
          </button>
        )}
      </form>
    </div>
  );
}

export default MultiStepForm;
