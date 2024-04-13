import {useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import axios from 'axios';
import Button from '../components/Button';
import TextAreaInput from '../components/TextAreaInput';
import ImageCapture from '../components/ImageCapture';
import {UPLOAD_URL, UPLOAD_FILE_URL, SentFolderPath} from '../constants';
import {jsonDisp} from '../utils/commonUtils';
import {upload_file} from '../utils/apiUtils';
import {
  copyFile,
  getFileNameWithoutExtension,
  getFullPath,
} from '../utils/fsUtils';

export default function HomeScreen({navigation}) {
  const [typedText, setTypedText] = useState('');
  const [photoFileName, setPhotoFileName] = useState('');

  const handleTextChange = newText => {
    setTypedText(newText);
  };

  const onSnappedPhoto = async photo => {
    try {
      const prefix = 'rn_image_picker_lib_temp_';
      let imageFileName = photo?.fileName?.startsWith(prefix)
        ? photo?.fileName?.slice(prefix.length)
        : photo?.fileName;
      console.log('onSnappedPhoto(): imageFileName=', imageFileName);
      const destinationPath = `${SentFolderPath}/${imageFileName}`;
      await copyFile(photo?.uri, destinationPath);
      setPhotoFileName(imageFileName);
    } catch (error) {
      console.error('onSnappedPhoto(): Error:', error);
    } finally {
    }
  };

  const onShowInferencePress = async () => {
    console.log('onShowInferencePress(): typedText=', typedText);
    const guid = photoFileName?.length
      ? getFileNameWithoutExtension(photoFileName)
      : 'text';
    try {
      const textFileName = `${guid}.txt`;
      console.log('onShowInferencePress(): textFileName:', textFileName);

      const formData = new FormData();
      formData.append('text', typedText);
      formData.append('fileName', textFileName);

      // Combine image and text upload logic
      const [imgUploadResponse, textUploadResponse] = await Promise.all([
        upload_file(
          UPLOAD_FILE_URL,
          getFullPath(SentFolderPath, photoFileName),
        ),
        axios.post(UPLOAD_URL, formData, {
          headers: {'Content-Type': 'multipart/form-data'},
        }),
      ]);
      console.log(jsonDisp(imgUploadResponse));

      let res = true;
      if (imgUploadResponse?.error) {
        res = false;
        console.log(
          'onShowInferencePress(): Image upload failed:',
          imgUploadResponse.error,
        );
      }
      if (textUploadResponse?.error) {
        res = false;
        console.log(
          'onShowInferencePress(): Text upload failed:',
          textUploadResponse.error,
        );
      }
      if (res) {
        navigation.navigate('ImageDataDisplayScreen');
      }
    } catch (error) {
      console.error('onShowInferencePress(): Error:', error);
    }
  };

  return (
    <ScrollView>
      <View style={styles.view}>
        <ImageCapture onSnappedPhoto={onSnappedPhoto} />
        <View style={styles.homeButtonsContainer}>
          <TextAreaInput onTextChange={handleTextChange} />
        </View>
        <View style={styles.homeButtonsContainer}>
          <View style={styles.rowContainer}>
            <Button title="Show Inference" onPress={onShowInferencePress} />
            {/* <Button title="Upload Signs" onPress={onUploadSignsPress} /> */}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    // backgroundColor: 'yellow',
    // height: '100%',
    // minHeight: '100%',
  },
  homeButtonsContainer: {
    flex: 1,
    width: '100%',
    // backgroundColor: 'red',
    marginTop: 15,
  },
  container: {
    flex: 1,
    padding: 24,
    // backgroundColor: '#fff',
  },
  rowContainer: {
    // flex: 1,
    // width
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  text: {
    fontSize: 20,
    // color: 'white',
  },
});
