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
    "Other",
  ];
  //useStates
  const [address, setAddress] = useState("");
  const [images, setImages] = useState({});
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
    // Retrieve the File List
    const retrievedFileList = localStorage.getItem(IMAGE_STORAGE_KEY);
    if (retrievedFileList) {
      const deserializedFileList = JSON.parse(retrievedFileList);
      setImages(deserializedFileList);
    }
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
    // Perform validation before proceeding to the next step
    if (step === 2) {
      if (!formData.email || formData.email === '' || !formData.reportersRole || formData.reportersRole === '') {
        alert('Please fill in Email and Choose at least one role');
        return;
      }
      else{
        // Regular expression to match email pattern
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailPattern.test(formData.email)){
          alert('The email provided is not a valid email')
          return;
        }
      }
    } else if (step === 3) {
      if (!formData.location || formData.location === '') {
        alert('Please provide the address.');
        return;
      }
    } else if (step === 4) {
      if (!formData.problems || formData.problems.length === 0) {
        alert('Please select at least one problem.');
        return;
      }
    } else if (step === 5) {
      if(!formData.affected || formData.affected === ''){
        alert('At Least one cattle needs to be affected.');
        return;
      } else if(!formData.dateSeen || formData.dateSeen === ''){
        alert('Select a date');
        return;
      }
    } else if(step === 6) {
      if(!formData.cattleAffected || formData.cattleAffected === ''){
        alert('Select at least one cattle type/age.');
        return;
      }
    }
    // If validation passes, proceed to the next step
    setStep((prevStep) => prevStep + 1);   
  };
  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = (error) => reject(error);
    });
  };
  const handleChangeUpload = async (e) => {
    const {name, type, files} = e.target;
    if (type === 'file') {
      //save file name in JSON file
      const fileArray = Array.from(files);
      const imageArray = fileArray.map((file) => file.name);
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
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // check for image upload
    if(!formData.image || formData.image.length < 1){
      alert('Upload At Least One Photo');
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
    setImages({});
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

    // console.log(formData);

    await axios.post(azureFunctionEndpoint, requestData)
      .then(() => console.log('Email sent'))
      .catch((error) => console.error(error));
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
            setFormData={setFormData}
            reportersRole={reportersRole}
          />
        ); 
      case 3:
        return (
          <LocationPage
            formData={formData}
            setFormData={setFormData}
            address={address}
            setAddress={setAddress}
          />
        );
      case 4:
        return (
          <ProblemsPage
            formData={formData}
            setFormData={setFormData}
            problems={problems}
          />
        );
      case 5:
        return (
          <NumberMainPage
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 6:
        return(
          <TypePage
            formData={formData}
            setFormData={setFormData}
            cattleTypesAges={cattleTypesAges}
          />
        );
      case 7:
        return(
          //upload logic??
          <UploadPage
            handleChangeUpload={handleChangeUpload}
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