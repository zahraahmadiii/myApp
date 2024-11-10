import React, { useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

export default function Galleryscreen() {
    const [galleryImageBase64, setGalleryImageBase64] = useState(null);

    useEffect(() => {
        const loadGalleryImage = async () => {
            const base64 = await AsyncStorage.getItem('galleryImageBase64');
            if (base64) setGalleryImageBase64(base64);
        };
        loadGalleryImage();
    }, []);

    // Save image to device's gallery
    const saveImageToGallery = async () => {
        if (!galleryImageBase64) return;

        // Request media library permission
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status === 'granted') {
            try {
                // Write Base64 data to a file in the file system
                const fileUri = FileSystem.documentDirectory + 'galleryImage.jpg';
                await FileSystem.writeAsStringAsync(fileUri, galleryImageBase64, {
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
            <Text>Gallery Image:</Text>
            {galleryImageBase64 ? (
                <Image
                    source={{ uri: `data:image/jpeg;base64,${galleryImageBase64}` }}
                    style={styles.image}
                />
            ) : (
                <Text>No image selected from gallery.</Text>
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
