import React from 'react';

function UploadPage({ handleChangeUpload, selectedFiles }) {
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
