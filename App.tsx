import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CameraScreen from './screen/CameraScreen';
import HomeScreen from './screen/HomeScreen';
import ImageScreen from './screen/ImageScreen';
import AudioScreen from './screen/AudioScreen';
import VideoScreen from './screen/VideoScreen';
import TextScreen from './screen/TextScreen';
import Galleryscreen from './screen/GalleryScreen';

const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
        />
        <Stack.Screen
          name="ImageScreen"
          component={ImageScreen}
        />
        <Stack.Screen
          name="Galleryscreen"
          component={Galleryscreen}
        />
        <Stack.Screen
          name="CameraScreen"
          component={CameraScreen}
        />
        <Stack.Screen
          name="AudioScreen"
          component={AudioScreen}
        />
        <Stack.Screen
          name="VideoScreen"
          component={VideoScreen}
        />
        <Stack.Screen
          name="TextScreen"
          component={TextScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
