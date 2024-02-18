import React from 'react';

function UploadPage({ imageKey,setFormData, setImages, selectedFiles }) {
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
      localStorage.setItem(imageKey, JSON.stringify(images64));
    }
  };
  return (
    <div>
      <h2>Upload Pictures</h2>
      <br />
      <label>Selected Files</label>
      <br/>
      {selectedFiles && selectedFiles.map((file, index) => (<p key={index}>{file}</p>))}
      {!selectedFiles && <p>None Selected</p>}
      <br/>
      <input
        type="file"
        accept="image/*"
        name="image"
        onChange={handleChangeUpload}
        multiple
      />
      <br />
      {/* <label>Upload Video</label>
      <br />
      <input
        type="file"
        accept="video/*"
        name="video"
        onChange={handleChangeUpload}
        multiple
      /> */}
    </div>
  );
}

export default UploadPage;
