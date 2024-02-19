import React from 'react';
import '../../css/UploadPage.css'

function UploadPage({ imageKey,setFormData, setImages, selectedFilesImage, selectedFilesVideo }) {
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = (error) => reject(error);
    });
  };
  const handleChangeUploadImage = async (e) => {
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
      localStorage.setItem(imageKey, JSON.stringify(images64));
    }
  };
  const handleChangeUploadVideo = async (e) => {
    const {name, type, files} = e.target;
    return
  };
  return (
    <div className='UploadPage'>
      <h2>Upload Pictures</h2>
      <div className='uploadFrames'>
        <label>Upload photos showing the problem <span style={{ color: 'red' }}> *</span></label>
        <br/>
        <label htmlFor="file-upload" className="custom-upload-button">Click to choose photos to upload</label>
        <input
          id='file-upload'
          className='upload'
          type="file"
          accept="image/*"
          name="image"
          onChange={handleChangeUploadImage}
          multiple
        />
        <br/>
        {selectedFilesImage && selectedFilesImage.map((file, index) => (<label key={index}>{file}</label>))}
        {!selectedFilesImage && <label>None Selected</label>}
      </div>
      <br/>
      <div className='uploadFrames'>
        <label>Upload videos showing the problem</label>
        <label htmlFor="file-upload" className="custom-upload-button">Click to choose videos to upload</label>
        <br />
        <input
          id='file-upload'
          className='upload'
          type="file"
          accept="video/*"
          name="video"
          onChange={handleChangeUploadVideo}
          multiple
        />
        <br/>
        {selectedFilesVideo && selectedFilesVideo.map((file, index) => (<label key={index}>{file}</label>))}
        {!selectedFilesVideo && <label>None Selected</label>}
        </div>
      <br />
    </div>
  );
}

export default UploadPage;
