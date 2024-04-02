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
import LoadingPage from './LoadingPage';
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
  const [apiKey, setApiKey] = useState('');
  const [address, setAddress] = useState("");
  const [images, setImages] = useState({});
  const [videos, setVideos] = useState({});
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(() => {
    const storedFormData = localStorage.getItem(FORM_STORAGE_KEY);
    const parsedFormData = storedFormData ? JSON.parse(storedFormData) : {};
    // Ensure 'Other' is always checked first
   /* if (parsedFormData.problems && !parsedFormData.problems.includes('Other')) {
      parsedFormData.problems.push('Other');
    } else if (!parsedFormData.problems) {
      parsedFormData.problems = ['Other'];
    }*/
    return parsedFormData;
  });
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
    if(!formData.images || formData.images.length < 1){
      alert('Upload At Least One Photo');
      return;
    }
    // Send the email
    sendEmail();
    // Clear form data from cache
    localStorage.removeItem(FORM_STORAGE_KEY);
    localStorage.removeItem(IMAGE_STORAGE_KEY);
    // Clear & Reset the form data after submission
    setAddress("");
    setImages({});
    setVideos({});
    setFormData(() => {
      const parsedFormData = {};
      // // Ensure 'Other' is always checked first
      // if (parsedFormData.problems && !parsedFormData.problems.includes('Other')) {
      //   parsedFormData.problems.push('Other');
      // } else if (!parsedFormData.problems) {
      //   parsedFormData.problems = ['Other'];
      // }
      // return parsedFormData;
    });

    return
  };
  const sendEmail = async () => {
    // Show loading page 
    setStep((prevStep) => prevStep + 1);
    // Begin Sending Email
    const azureFunctionEndpoint = 'https://func-dev-ntca-001.azurewebsites.net/api/HttpTrigger-dev-uploading-ntca-001?code=3HNcsp2QRF5Uzq2PuOlfLI5G6bXH0IM2ZYYyrwSKTvXpAzFuPPTPyw==';
    // Combine formData and Images into a single object
    const requestData = {
      formData: formData,
      base64Images: images,
      base64Videos: videos
    };
   // Make a POST request to the Azure Function endpoint
   await axios.post(azureFunctionEndpoint, requestData)
   .then((response) => {
       // Check if the response status is successful (status code 200)
       if (response.status === 200) {
           // Show success message when email is sent successfully
           setStep(1);
           alert('Email sent');
       } else {
           // Show an error message if there is a problem with the response
           alert('Error sending email. Please try again later.');
       }
   })
   .catch((error) => {
       // Show an error message if there is an error during the request
       console.error('Error sending email:', error);
       alert('Error sending email. Please try again later.');
   });
  };
  const fetchGoogleMapsApiKey = async () => {
    try {
      const response = await axios.get('https://func-dev-ntca-001.azurewebsites.net/api/HttpTrigger-dev-GoogleAPI-ntca-001?code=IFE6dmJnHPZ9qvl0P85rrsPxKehMrvaxxA7ZzbzK1CnpAzFuj2q14g==');
      const apiKey = response.data.googleMapsAPIKey;
      // Set Google Maps API Key
      setApiKey(apiKey)
    } catch (error) {
      console.error('Error fetching Google Maps API Key:', error);
    }
  };
  //useEffects
  useEffect(() => {
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);
  useEffect(() => {
    // Fetch Google Maps API Key from your Azure Function endpoint (needs to be here or it will be done twice!!!!)
    fetchGoogleMapsApiKey();
    // Retrieve the Files List
    const retrievedImageList = localStorage.getItem(IMAGE_STORAGE_KEY);
    if (retrievedImageList) {
      const deserializedImageList = JSON.parse(retrievedImageList);
      setImages(deserializedImageList);
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
            apiKey={apiKey}
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
            setVideos={setVideos}
            selectedFilesImage={formData.images}
            selectedFilesVideo={formData.videos}
          />
        );
      case 8:
        return(
          <LoadingPage type={'spin'} color={'black'} />
        );
      default:
        return null;
    }
  };
  return (
    <div className='MultiStepForm'>
      <form onSubmit={handleSubmit}>
        {step > 1 && step !== 8 && (
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