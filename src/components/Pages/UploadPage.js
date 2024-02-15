import React from 'react';

function UploadPage({ handleChangeUpload, capturePhoto, errorMessagePhoto, selectedFiles }) {
  return (
    <div>
      <label>Upload Pictures</label>
      <br />
      <label>Selected Files</label>
      <br/>
      {selectedFiles ? selectedFiles.map((index,name) => (<p key={index}>{name}</p>)) : <p>None Selected</p>}
      <br/>
      <input
        type="file"
        accept="image/*"
        name="image"
        onChange={handleChangeUpload}
        multiple
      />
      <br />
      <span>or</span>
      <button onClick={capturePhoto}>Take Photo</button>
      <br />
      {errorMessagePhoto && <p>{errorMessagePhoto}</p>}
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
