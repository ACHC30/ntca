import React, { useState, useEffect } from 'react';
import MapWithPin from './MapWithPin';
import PhoneInput from 'react-phone-number-input'
import axios from 'axios';
import 'react-phone-number-input/style.css'

const FORM_STORAGE_KEY = 'multiStepForm';

function MultiStepForm() {
  const [address, setAddress] = useState("");
  const [image, setImage] = useState(null);
  const [errorMessagePhoto, setErrorMessagePhoto] = useState("");
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(() => {
    const storedFormData = localStorage.getItem(FORM_STORAGE_KEY);
    const parsedFormData = storedFormData ? JSON.parse(storedFormData) : {};
    
    // Ensure 'Other' is always checked first
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

  useEffect(() => {
    // Fetch IP address when component mounts
    fetch("https://api.ipify.org?format=json")
      .then(response => response.json())
      .then(data => {
        const ipAddress = data.ip;
        setFormData(prevFormData => ({
          ...prevFormData,
          ipAddress: ipAddress
        }));
      })
      .catch(error => {
        console.error("Error fetching IP address:", error);
      });
  }, []);

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
      // Handle multiple file uploads
      const fileArray = Array.from(files);
      const imageArray = fileArray.map((file) => URL.createObjectURL(file));
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: imageArray, // Store an array of image data URLs
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleChangePhone = (value, name) => {
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

   // Callback function to update address state
   const handleAddressChange = (newAddress) => {
    setAddress(newAddress);
    setFormData((prevFormData) => ({
      ...prevFormData,
      location: newAddress // Update location field in formData
    }));
  };

  const capturePhoto = (e) => {
    e.preventDefault(); // Prevent form submission
  
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      // Access the device camera
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          // Display camera stream in a video element
          const video = document.createElement('video');
          video.srcObject = stream;
          video.setAttribute('autoplay', true);
          video.setAttribute('playsinline', true); // For iOS Safari
          document.body.appendChild(video);
  
          // Create a canvas element to capture a frame
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const context = canvas.getContext('2d');
  
          // Capture a frame from the video stream when a photo is requested
          const takePhoto = () => {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageDataUrl = canvas.toDataURL('image/jpeg');
            
            // Append the captured photo data URL to the array of images in the form state
            setFormData((prevFormData) => ({
              ...prevFormData,
              images: [...(prevFormData.images || []), imageDataUrl],
            }));
  
            // You can now use `imageDataUrl` to display or upload the captured image
            console.log('Captured photo:', imageDataUrl);
  
            // Stop the camera stream
            stream.getVideoTracks().forEach(track => track.stop());
            video.remove();
            canvas.remove();
          };
  
          // Add a button to capture the photo
          const captureButton = document.createElement('button');
          captureButton.textContent = 'Capture Photo';
          captureButton.addEventListener('click', takePhoto);
          document.body.appendChild(captureButton);
        })
        .catch((error) => {
          console.error('Error accessing the camera:', error);
          setErrorMessagePhoto('Error accessing the camera. Please make sure camera permissions are granted.');
        });
    } else {
      setErrorMessagePhoto('Sorry, capturing photo is not supported on this device.'); // Message for PC users
    }
  };

  const convertFormDataToJsonFile = (formData) => {
    const json = JSON.stringify(formData, null, 2);
    return json; // Return the JSON content as a string
  };

  const sendEmail = () => {
    const sendGridApiKey = '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'; // Replace with your SendGrid API key
    
    const jsonContent = convertFormDataToJsonFile(formData);
    const base64Content = btoa(jsonContent); // Convert JSON content to base64
    
    const emailData = {
      to: formData.email,
      from: 'christopher@aibrisbane.com.au',
      subject: 'Sending Json file test',
      attachments: [
        {
          content: base64Content,
          filename: 'formData.json',
          type: 'application/json',
          disposition: 'attachment'
        },
      ]
    };
    
    axios.post('https://api.sendgrid.com/v3/mail/send', emailData, {
      headers: {
        Authorization: `Bearer ${sendGridApiKey}`,
        'Content-Type': 'application/json',
      },
    })
    .then(() => console.log('Email sent'))
    .catch((error) => console.error(error));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Check if at least one checkbox is checked
    if (!formData.problems || formData.problems.length === 0) {
        alert('Please select at least one problem.');
        return;
    }
    // Send the email
    sendEmail();
    // Clear form data from localStorage
    localStorage.removeItem(FORM_STORAGE_KEY);
    // Optionally, you can clear the form data after submission
    setFormData({});
    // Reset step to 1
    setStep(1);
    // Reset uploaded image after submission
    setImage(null); 

    return
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
              placeholder="Name"
            />
            <br />
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              placeholder="Email"
            />
            <br />
            <PhoneInput
              international={false}
              defaultCountry="AU"
              value={formData.phone || ''}
              onChange={(value) => handleChangePhone(value, 'phone')}
              placeholder="Enter Phone Number"
              style={{ width: '200px', margin: '0 auto' }}
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
              placeholder="Property Name"
            />
            <br />
            <label>PIC:</label>
            <input
              type="text"
              name="pic"
              value={formData.pic || ''}
              onChange={handleChange}
              placeholder="PIC"
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
              placeholder="Address"
            />
            <br />
          </div>
        );
        case 3:
        return (
          <div>
            <h2>What have you seen?</h2>
            <label>Date Seen?</label>
            <input
              type="date"
              name="dateSeen"
              value={formData.dateSeen || ''}
              onChange={handleChange}
            />
            <br />
            <label>Approximate number of cattle affected?</label>
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
            multiple
            />
            <br />
            <span>or</span>
            <button onClick={(e) => capturePhoto(e)}>Take Photo</button>
            <br />
            {errorMessagePhoto && <p>{errorMessagePhoto}</p>}
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