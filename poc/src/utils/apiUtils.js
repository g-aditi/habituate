import RNFS from 'react-native-fs';
import jsonDisp from './commonUtils';
import axios from 'axios';
import {getFileName} from './fsUtils';

export const upload_file = async (upload_url, filePath) => {
  const chunkSize = 1024 * 1024; // upload in 1 mb chunks

  try {
    // Check if file exists
    const fileExists = await RNFS.stat(filePath);
    if (!fileExists) {
      return Promise.reject(new Error('File not found'));
    }
    const fileName = getFileName(filePath);
    const fileSize = fileExists.size;
    const totalChunks = Math.ceil(fileSize / chunkSize);

    // Upload each chunk in a loop
    for (
      let offset = 0, chunkIndex = 0;
      offset < fileSize;
      offset += chunkSize, chunkIndex++
    ) {
      const chunkData = await RNFS.read(filePath, chunkSize, offset, 'base64');

      const formData = new FormData();
      formData.append('fileName', fileName);
      formData.append('chunkData', chunkData);
      formData.append('chunkIndex', chunkIndex);
      formData.append('totalChunks', totalChunks);

      console.log('sending chunk:', chunkIndex);
      const res = await axios.post(upload_url, formData, {
        headers: {'Content-Type': 'multipart/form-data'},
      });

      if (res.status !== 200 && res.status !== 201) {
        return Promise.reject(
          new Error(`Chunk upload failed with status: ${res.status}`),
        );
      }

      console.log('chunk sent successfully');
    }

    // Return success if all chunks uploaded
    return Promise.resolve({message: 'File uploaded successfully'});
  } catch (error) {
    console.error('Error sending file:', jsonDisp(error));
    return Promise.reject(error); // Re-throw the error for caller handling
  }
};
