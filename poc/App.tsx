import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import ImageDataDisplayScreen from './src/screens/ImageDataDisplayScreen';
import {PermissionsAndroid} from 'react-native';
import {createNestedFolders} from './src/utils/fsUtils';
import {ReceivedFolderPath, SentFolderPath} from './src/constants';
import {jsonDisp} from './src/utils/commonUtils';

const Stack = createNativeStackNavigator();

export default function App() {
  async function requestMultiplePermissions() {
    try {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        PermissionsAndroid.PERMISSIONS.CAMERA,
        // Add more permissions as needed
      ];

      const granted = await PermissionsAndroid.requestMultiple(permissions);
      console.log(granted);
    } catch (err) {
      console.warn(err);
    }
  }

  async function createRequiredFolders() {
    try {
      // await createNewFolder(FileDirectory);
      await createNestedFolders(ReceivedFolderPath);
      await createNestedFolders(SentFolderPath);
    } catch (err) {
      console.error('createRequiredFolders', jsonDisp(err));
    }
  }

  React.useEffect(() => {
    requestMultiplePermissions();
    createRequiredFolders();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="ImageDataDisplayScreen"
          component={ImageDataDisplayScreen}
          options={{
            title: 'Image Data Display',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
