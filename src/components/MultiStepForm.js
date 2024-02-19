import React, { useState, useEffect } from 'react';
import axios from 'axios';
//pages
import GetStartedPage from './Pages/GetStartedPage';
import PersonInfoPage from './Pages/PersonInfoPage';
import LocationPage from './Pages/LocationPage';
import ProblemsPage from './Pages/ProblemsPage';
import NumberMainPage from './Pages/NumberMainPage';
import TypePage from './Pages/TypePage';
import UploadPage from './Pages/UploadPage';
//Logos and images
import logo from '../images/NTCA_Logo.png';
//CSS
import 'react-phone-number-input/style.css'
import '../css/MultiStepForm.css'
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
    alert('Please wait email is being sent...');

    await axios.post(azureFunctionEndpoint, requestData)
      .then(() => alert('Email sent'))
      .catch((error) => console.error(error));
  };
  const renderForm = () => {
    switch (step) {
      case 1:
        return(
          <GetStartedPage logo= {logo}/>
        );
      case 2:
        return(
          <PersonInfoPage
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
          <UploadPage
            imageKey={IMAGE_STORAGE_KEY}
            setFormData={setFormData}
            setImages={setImages}
            selectedFiles={formData.image}
          />
        );
      default:
        return null;
    }
  };
  return (
    <div className='MultiStepForm'>
      <form onSubmit={handleSubmit}>
        {step > 1 && (
          <div className='MultiStepForm-backFrame'>
            <button className='MultiStepForm-back' type="button" onClick={prevStep}>
              &lt; Back
            </button>
          </div>
        )}
        {renderForm()}
        {step === 1 && (
          <button className='MultiStepForm-button' type="button" onClick={nextStep}>
            Report a Cattle Issue
          </button>
        )}
        {step < 7 && step !== 1 && (
          <button className='MultiStepForm-button' type="button" onClick={nextStep}>
            Next
          </button>
        )}
        {step === 7 && (
          <button className='MultiStepForm-button' type="submit">
            Submit
          </button>
        )}
      </form>
    </div>
  );
}
export default MultiStepForm;