import RNFS from 'react-native-fs';
import {jsonDisp} from './commonUtils';

export const createNestedFolders = async path => {
  console.log('createNestedFolders() path=', path);
  const parts = path.split('/'); // Split the path into individual directories
  let currentPath = '';

  for (const part of parts) {
    currentPath = currentPath ? `${currentPath}/${part}` : part;
    try {
      const folderExists = await RNFS.exists(currentPath);
      if (folderExists) {
        console.log(`path already exists: ${currentPath}`);
      } else {
        await RNFS.mkdir(currentPath);
        console.log('created path:', currentPath);
      }
    } catch (error) {
      console.error('Error creating', currentPath, error);
    }
  }
};

export const createNewFolder = async (path, folderName) => {
  const folderPath = `${path}/${folderName}`;
  try {
    const folderExists = await RNFS.exists(folderPath);
    if (folderExists) {
      console.log(`path already exists: ${folderPath}`);
    } else {
      await RNFS.mkdir(folderPath);
      console.log(folderName, 'created');
    }
  } catch (error) {
    console.error('Error creating', folderName, error);
  }
};

export const getFilesInFolder = async folderPath => {
  try {
    const result = await RNFS.readDir(folderPath);
    const fileNames = result
      .filter(item => item.isFile())
      .map(file => file.name);
    console.log('File names in the folder:', fileNames);
    return fileNames;
  } catch (error) {
    console.error('Error reading folder:', error);
    return [];
  }
};

export const getFullPath = (fileDirectory, filename) =>
  fileDirectory + '/' + filename;

export const getFileName = filePath => {
  const parts = filePath.split(/[/\\]/);
  return parts[parts.length - 1];
};

export const getFileNameWithoutExtension = filePath => {
  const filename = getFileName(filePath);
  const parts = filename.split('.');
  return parts[0];
};

export const getFileExtension = filePath => {
  const filename = getFileName(filePath);
  const parts = filename.split('.');
  return parts[parts.length - 1];
};

export const copyFile = async (sourcePath, destinationPath) => {
  try {
    await RNFS.copyFile(sourcePath, destinationPath);
    console.log('file copied successfully!');
  } catch (error) {
    console.error('Error copying file:', error);
  }
};

export const deleteFile = async filePath => {
  try {
    await RNFS.deleteFile(filePath);
    console.log('file deleted successfully!');
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};

export const isFileExists = async (fileDirectory, fileName) => {
  try {
    const stats = await RNFS.stat(getFullPath(fileDirectory, fileName));
    return stats.isFile(); // Check if it's a file
  } catch (error) {
    // File may not exist if the error code is 'ENOENT' (Entity Not Found)
    console.error('isFileExists():', jsonDisp(error));
    return false;
  }
};
