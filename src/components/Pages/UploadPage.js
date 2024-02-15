import React from 'react';

function UploadPage({ handleChange, capturePhoto, errorMessagePhoto }) {
  return (
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
      <button onClick={capturePhoto}>Take Photo</button>
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
}

export default UploadPage;
