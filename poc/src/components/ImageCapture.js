import React, {useState, useCallback} from 'react';
import {View, Button, Image} from 'react-native';
import {launchCamera} from 'react-native-image-picker';

const ImageCapture = ({onSnappedPhoto}) => {
  const [image, setImage] = useState(null);

  const captureImage = useCallback(async () => {
    try {
      const result = await launchCamera({
        saveToPhotos: false,
        mediaType: 'photo',
        includeBase64: false,
      });

      if (result.didCancel) {
        console.log('User cancelled image picker');
      } else if (result.errorCode) {
        console.log('ImagePicker Error: ', result.errorMessage);
      } else {
        setImage(result.assets[0]);
        onSnappedPhoto(result.assets[0]);
      }
    } catch (error) {
      console.error('Error capturing image:', error);
      setImage(null);
    }
  }, [setImage, onSnappedPhoto]);

  return (
    <View>
      {image && (
        <Image
          source={{uri: image?.uri}}
          style={{width: 300, height: 300, marginBottom: 20}}
        />
      )}
      <Button title="Take Photo" onPress={captureImage} />
    </View>
  );
};

export default ImageCapture;
