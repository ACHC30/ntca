import React, { useState, useEffect } from 'react';
import MapWithPin from './MapWithPin';
import PhoneInput from 'react-phone-number-input'
import axios from 'axios';
//Logos and images
import logo from '../logo.svg';
//CSS
import 'react-phone-number-input/style.css'

const FORM_STORAGE_KEY = 'multiStepForm';

function MultiStepForm() {
  //Lists
  const problems = [
    "Sudden death",
    "Skin lesions/problems",
    "Mouth or nose lesions",
    "Lame cattle",
    "Balance/standing (neurological) problems",
    "Reproductive issues",
    "Breathing difficulties/coughing",
    "Wasting/ill thrift",
    "Other"
  ];
  const cattleTypesAges = [
    "All Cattle Types/ages",
    "Cows Only",
    "Weaners Only",
    "Calves Only",
    "Bulls Only",
    "Steers Only",
    "Helfers Only",
    "Helfers And Steers",
    "Other"
  ];
  const reportersRole = [
    "Cattle Handler",
    "Livestock owner/management",
    "Other"
  ];
  //useStates
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
  //useEffects
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
  //Functions
  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };
  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };
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
      setImage(files);
      const fileArray = Array.from(files);
      const imageArray = fileArray.map((file) => file.name);
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: imageArray, // Store an array of file objects directly
      }));
    } else {
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
  const sendEmail = async () => {
    const azureFunctionEndpoint = 'https://ntca-aibrisbane.azurewebsites.net/api/HttpTrigger1?code=shGA9qTFkEQcPCRnRx4IZUTLpsL_Q3IYk330GAeDVZ2GAzFuJmJTnQ==';
    const base64Images = [];

    // Convert each image to base64
    for (let i = 0; i < image.length; i++) {
      const base64String = await convertToBase64(image[i]);
      base64Images.push(base64String);
    }

    // Combine formData and base64Images into a single object
    const requestData = {
      formData: formData,
      base64Images: base64Images
    };

    await axios.post(azureFunctionEndpoint, requestData)
      .then(() => console.log('Email sent'))
      .catch((error) => console.error(error));
  };
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = (error) => reject(error);
    });
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
              image: [...(prevFormData.image || []), imageDataUrl],
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
  const renderForm = () => {
    switch (step) {
      case 1:
        return(
          <div>
            <img src={logo} className="App-logo" alt="logo" />
            <h1>Welcome To NTCA</h1>
            <h3>Report instances of diseases found in cattle in the Northern Territory</h3>
          </div>
        );
      case 2:
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
              onChange={(value) => handleChangePhoneNum(value, 'phone')}
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
              {reportersRole.map((roles, index) => (<option key={index} value={roles}>{roles}</option>))}
            </select>
            <br />
          </div>
        );
      case 3:
        return (
          <div>
            <h2>Where were the affected cattle?</h2>
            <label>Property Name:</label>
            <input
              type="text"
              name="property"
              value={formData.property || ''}
              onChange={handleChange}
              placeholder="Property Name"
            />
            <br />
            <label>PIC - If Known:</label>
            <input
              type="text"
              name="pic"
              value={formData.pic || ''}
              onChange={handleChange}
              placeholder="PIC"
            />
            <br />
            <label>Location Cattle found:</label>
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
      case 4:
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
      case 5:
        return (
          <div>
            <h2>What have you seen in a cattle?</h2>
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
            <label>Date Problem Seen?</label>
            <input
              type="date"
              name="dateSeen"
              value={formData.dateSeen || ''}
              onChange={handleChange}
            />
          </div>
        );
      case 6:
        return(
          <div>
            <h2>What have you seen in the cattle?</h2>
            <label>Types/ages of cattle affected?</label>
            <select
              name="cattleAffected"
              value={formData.cattleAffected || ''}
              onChange={handleChange}
            >
              <option value="">Select An Option</option>
              {cattleTypesAges.map((ta) => (<option value={ta}>{ta}</option>))}
            </select>
            <br />
            <label>Other Comments</label>
            <input
              style={{height:"96px", width:"393px"}}
              type="text"
              name="comment"
              value={formData.comment || ''}
              onChange={handleChange}
            />
          </div>
        );
      case 7:
        return(
          <div>
            <label>Upload Pictures</label>
            <br />
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
            <label>Upload Video</label>
            <br />
            <input
            type="file"
            accept="video/*"
            name="video"
            onChange={handleChange}
            multiple
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {step > 1 && (
          <button type="button" onClick={prevStep}>
            Previous
          </button>
        )}
        {renderForm()}
        {step === 1 && (
          <button type="button" onClick={nextStep}>
            Report a Cattle Issue
          </button>
        )}
        
        {step < 7 && step !== 1 && (
          <button type="button" onClick={nextStep}>
            Next
          </button>
        )}
        {step === 7 && (
          <button type="submit">
            Submit
          </button>
        )}
      </form>
    </div>
  );
}
export default MultiStepForm;