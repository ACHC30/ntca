import React, { useState, useEffect } from 'react';
import axios from 'axios';
//pages
import PersonInfo from './Pages/PersonInfo';
import LocationPage from './Pages/LocationPage';
import ProblemsPage from './Pages/ProblemsPage';
import NumberMainPage from './Pages/NumberMainPage';
import TypePage from './Pages/TypePage';
import UploadPage from './Pages/UploadPage';
//Logos and images
import logo from '../images/logo.svg';
//CSS
import 'react-phone-number-input/style.css'
//cache keys
const FORM_STORAGE_KEY = 'multiStepForm';
const IMAGE_STORAGE_KEY = 'fileListImage';

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
  const [errorMessagePhoto, setErrorMessagePhoto] = useState("");
  const [step, setStep] = useState(1);
  const [entryID, setEntryID] = useState(1);
  const [images, setImages] = useState({});
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
    // Retrieve the File List
    const retrievedFileList = localStorage.getItem(IMAGE_STORAGE_KEY);
    if (retrievedFileList) {
      const deserializedFileList = JSON.parse(retrievedFileList);
      setImages(deserializedFileList);
    }
    // Get Entry ID from database
    // ----here
    setFormData(prevFormData => ({
      ...prevFormData,
      entryID: entryID
    }));
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
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };
  const handleChangeUpload = async (e) => {
    const {name, type, files} = e.target;
    if (type === 'file') {
      //save file name in JSON file
      const fileArray = Array.from(files);
      const imageArray = fileArray.map((file) => file.name + "_" + entryID);
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: imageArray,
      }));
      // Convert each image to base64
      const images64 = []
      for (let i = 0; i < files.length; i++) {
        const base64String = await convertToBase64(files[i]);
        images64.push(base64String);
      }
      setImages(images64);
      //Save the image to cache
      localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(images64));
    }
  }
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
    // Clear form data from cache
    localStorage.removeItem(FORM_STORAGE_KEY);
    localStorage.removeItem(IMAGE_STORAGE_KEY);
    // Clear & Reset the form data after submission
    setStep(1);
    setAddress("");
    setErrorMessagePhoto("");
    setImages({});
    setEntryID((prevEntryID) => prevEntryID + 1);
    // function to save entry id to database.
    setFormData(() => {
        const parsedFormData = {};
        // Ensure 'Other' is always checked first
        if (parsedFormData.problems && !parsedFormData.problems.includes('Other')) {
          parsedFormData.problems.push('Other');
        } else if (!parsedFormData.problems) {
          parsedFormData.problems = ['Other'];
        }
        return parsedFormData;
    });
    return
  };
  const sendEmail = async () => {
    const azureFunctionEndpoint = 'https://ntca-aibrisbane.azurewebsites.net/api/HttpTrigger1?code=shGA9qTFkEQcPCRnRx4IZUTLpsL_Q3IYk330GAeDVZ2GAzFuJmJTnQ==';

    // Combine formData and Images into a single object
    const requestData = {
      formData: formData,
      base64Images: images
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
        return(
          <PersonInfo
            formData={formData}
            handleChange={handleChange}
            handleChangePhoneNum={handleChangePhoneNum}
            reportersRole={reportersRole}
          />
        ); 
      case 3:
        return (
          <LocationPage
            formData={formData}
            address={address}
            setAddress={handleAddressChange}
            handleChange={handleChange}
          />
        );
      case 4:
        return (
          <ProblemsPage
            problems={problems}
            formData={formData}
            handleChange={handleChange}
          />
        );
      case 5:
        return (
          <NumberMainPage
            formData={formData}
            handleChange={handleChange}
          />
        );
      case 6:
        return(
          <TypePage
            formData={formData}
            handleChange={handleChange}
            cattleTypesAges={cattleTypesAges}
          />
        );
      case 7:
        return(
          <UploadPage
            handleChangeUpload={handleChangeUpload}
            capturePhoto={capturePhoto}
            errorMessagePhoto={errorMessagePhoto}
            selectedFiles={formData.image}
          />
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