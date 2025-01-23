import React, { useState } from 'react';
import axios from 'axios';

function Mp3Uploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const baseUrl = "http://localhost:8001/usersOn";


  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    // <AudioLoaderAnimation />
    if (!selectedFile) {
      alert('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(baseUrl + '/uploadMp3', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('File uploaded successfully!');
      console.log(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Upload MP3 File</h2>
      <form onSubmit={handleUpload}>
        <input type="file" accept="audio/mpeg" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default Mp3Uploader;
