// import { View, Text, StyleSheet, Button, Image, Alert } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as ImagePicker from 'expo-image-picker';
// import * as FileSystem from 'expo-file-system';
// export default function ImageScreen({ navigation }) {
//     const [photoBase64, setPhotoBase64] = useState(null);
//     // Load photo from AsyncStorage when the component mounts
//     useEffect(() => {
//         const loadPhoto = async () => {
//             const savedBase64 = await AsyncStorage.getItem('photoBase64');
//             if (savedBase64) {
//                 setPhotoBase64(savedBase64); // Set the Base64 string to display the image
//             }
//         };
//         loadPhoto();
//     }, []);

//     // Function to choose either camera or gallery
//     const choosePhotoSource = () => {
//         Alert.alert(
//             'Select Photo Source',
//             'Choose to take a picture or pick from gallery',
//             [
//                 {
//                     text: 'Take a Picture',
//                     onPress: () => takePicture(),
//                 },
//                 {
//                     text: 'Choose from Gallery',
//                     onPress: () => pickImage(),
//                 },
//                 {
//                     text: 'Cancel',
//                     style: 'cancel',
//                 },
//             ]
//         );
//     };

//     // Function to open the camera and take a picture
//     const takePicture = async () => {
//         // Request camera permission
//         const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();

//         if (cameraPermission.granted) {
//             // Launch camera to take a picture
//             const result = await ImagePicker.launchCameraAsync({
//                 allowsEditing: true,
//                 quality: 1,
//             });

//             if (!result.canceled) {
//                 const uri = result.assets[0].uri;
//                 const base64 = await uriToBase64(uri);
//                 await AsyncStorage.setItem('photoBase64', base64);

//                 setPhotoBase64(base64);
//             }
//         } else {
//             alert('Camera permission is required!');
//         }
//     };

//     // Function to pick an image from the gallery
//     const pickImage = async () => {
//         // Request gallery permission
//         const galleryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
//         console.log("Gallery Permission Status:", galleryPermission);
//         if (galleryPermission.granted) {
//             // Launch gallery to pick an image
//             const result = await ImagePicker.launchImageLibraryAsync({
//                 mediaTypes: ImagePicker.MediaTypeOptions.Images,
//                 allowsEditing: true,
//                 quality: 1,
//             });

//             if (!result.canceled) {
//                 const uri = result.assets[0].uri;
//                 const base64 = await uriToBase64(uri);
//                 // Save the Base64 string to AsyncStorage
//                 await AsyncStorage.setItem('photoBase64', base64);
//                 // console.log(photoBase64);
//                 setPhotoBase64(base64);
//             }
//         } else {
//             alert('Gallery permission is required!');
//         }


//     };
//     // Function to convert image URI to Base64 string
//     const uriToBase64 = async (uri) => {
//         try {
//             const base64 = await FileSystem.readAsStringAsync(uri, {
//                 encoding: FileSystem.EncodingType.Base64,
//             });
//             return base64;
//         } catch (error) {
//             console.error('Error converting image to Base64:', error);
//             return null;
//         }
//     };
//     return (
//         <View style={styles.container}>
//             {/* Button to choose between taking a picture or picking from gallery */}
//             <Button title="Upload Image" onPress={choosePhotoSource} />

//             {/* Display the photo if it exists */}
//             {photoBase64 ? (
//                 <Image
//                     source={{ uri: `data:image/jpeg;base64,${photoBase64}` }} // Display the Base64 image
//                     style={styles.image}
//                 />
//             ) : (
//                 <Text>No photo taken yet</Text>
//             )}
//         </View>
//     );
// };
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 20,
//     },
//     image: {
//         width: 300,
//         height: 300,
//         marginTop: 20,
//         resizeMode: 'contain',
//     },
// });


import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

export default function ImageScreen({ navigation }) {

    // Function to convert image URI to Base64 string
    const uriToBase64 = async (uri) => {
        try {
            const base64 = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            return base64;
        } catch (error) {
            console.error('Error converting image to Base64:', error);
            return null;
        }
    };

    // Function to pick an image from the gallery
    const pickImageFromGallery = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permission.granted) {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
            });
            if (!result.canceled) {
                const uri = result.assets[0].uri;
                const base64 = await uriToBase64(uri);
                await AsyncStorage.setItem('galleryImageBase64', base64); // Save gallery image as Base64
                navigation.navigate('Galleryscreen'); // Navigate to display screen
            }
        } else {
            alert('Gallery permission is required!');
        }
    };

    // Function to take a picture with the camera
    const takePictureWithCamera = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (permission.granted) {
            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                quality: 1,
            });
            if (!result.canceled) {
                const uri = result.assets[0].uri;
                const base64 = await uriToBase64(uri);
                await AsyncStorage.setItem('cameraImageBase64', base64); // Save camera image as Base64
                navigation.navigate('CameraScreen'); // Navigate to display screen
            }
        } else {
            alert('Camera permission is required!');
        }
    };

    return (
        <View style={styles.container}>
            <Button title="Choose from Gallery" onPress={pickImageFromGallery} />
            <Button title="Take Picture" onPress={takePictureWithCamera} style={styles.button} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        gap: 20
    },

});

