import React, { useEffect } from 'react';
import { View, Button, Image, StyleSheet, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CameraScreen({ navigation }) {
    // Function to take a picture and save it to AsyncStorage
    // const takePicture = async () => {
    //     // Request camera permission
    //     const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();

    //     if (cameraPermission.granted) {
    //         // Launch camera to take a picture
    //         const result = await ImagePicker.launchCameraAsync({
    //             allowsEditing: true,
    //             quality: 1,
    //         });

    //         if (!result.canceled) {
    //             const uri = result.assets[0].uri;

    //             // Save the URI of the photo to AsyncStorage
    //             await AsyncStorage.setItem('photoUri', uri);

    //             // Navigate back to Home screen after taking the picture
    //             navigation.navigate('Home');
    //         }
    //     } else {
    //         alert('Camera permission is required!');
    //     }

    // };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Camera Screen</Text>
            {/* <Button title="Take Picture" onPress={takePicture} /> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});
