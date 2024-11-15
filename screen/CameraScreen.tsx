import React, { useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

export default function CameraScreen() {
    const [cameraImageBase64, setCameraImageBase64] = useState(null);

    useEffect(() => {
        const loadCameraImage = async () => {
            const base64 = await AsyncStorage.getItem('cameraImageBase64');
            if (base64) setCameraImageBase64(base64);
        };
        loadCameraImage();
    }, []);

    // Save image to device's gallery
    const saveImageToGallery = async () => {
        if (!cameraImageBase64) return;

        // Request media library permission
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status === 'granted') {
            try {
                // Write Base64 data to a file in the file system
                const fileUri = FileSystem.documentDirectory + 'cameraImage.jpg';
                await FileSystem.writeAsStringAsync(fileUri, cameraImageBase64, {
                    encoding: FileSystem.EncodingType.Base64,
                });

                // Save the file to the media library
                await MediaLibrary.createAssetAsync(fileUri);
                Alert.alert('Success', 'Image saved to gallery!');
            } catch (error) {
                console.error('Error saving image to gallery:', error);
                Alert.alert('Error', 'Failed to save image.');
            }
        } else {
            Alert.alert('Permission Denied', 'Media library permission is required to save images.');
        }
    };

    return (
        <View style={styles.container}>
            <Text>Camera Image:</Text>
            {cameraImageBase64 ? (
                <Image
                    source={{ uri: `data:image/jpeg;base64,${cameraImageBase64}` }}
                    style={styles.image}
                />
            ) : (
                <Text>No picture taken.</Text>
            )}
            <Button title="Save to Gallery" onPress={saveImageToGallery} />
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
    image: {
        width: 300,
        height: 300,
        marginTop: 20,
        resizeMode: 'contain',
        marginBottom: 50,
    },
});
