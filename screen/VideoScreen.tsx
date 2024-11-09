import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { Video } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

export default function VideoScreen({ navigation }) {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);

    const [isRecording, setIsRecording] = useState(false);
    const [videoUri, setVideoUri] = useState<string | null>(null);
    // const cameraRef = useRef(null);
    const cameraRef = useRef<Camera | null>(null);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);


    // Start recording the video
    const startRecording = async () => {
        if (cameraRef.current) {
            try {
                const videoRecordPromise = cameraRef.current.recordAsync();
                if (videoRecordPromise) {
                    setIsRecording(true);
                    const data = await videoRecordPromise;
                    setVideoUri(data.uri); // Save the video URI directly
                    setIsRecording(false);

                    // Optionally, you can save the URI to AsyncStorage if needed
                    await AsyncStorage.setItem('videoUri', data.uri);
                }
            } catch (error) {
                console.error("Error while recording: ", error);
                setIsRecording(false);
            }
        }
    };

    // Stop recording
    const stopRecording = async () => {
        if (cameraRef.current && isRecording) {
            cameraRef.current.stopRecording();
            setIsRecording(false);
        }
    };

    // Render video player if URI exists
    const renderVideo = () => {
        if (videoUri) {
            return (
                <View style={styles.videoContainer}>
                    <Text style={styles.text}>Recorded Video</Text>
                    <Video
                        source={{ uri: videoUri }}
                        style={styles.video}
                        useNativeControls
                        resizeMode="cover"  // Use "cover" or "stretch" if "contain" is causing issues
                        isLooping
                    />

                </View>
            );
        }
        return null;
    };

    if (hasPermission === null) {
        return <View />;
    }

    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Record a Video</Text>

            {/* Camera view */}
            <View style={styles.cameraContainer}>
                <Camera style={styles.camera} type={Camera.Constants.Type.back} ref={cameraRef} />
            </View>

            {/* Button to start/stop recording */}
            <Button
                title={isRecording ? 'Stop Recording' : 'Start Recording'}
                onPress={isRecording ? stopRecording : startRecording}
            />

            {renderVideo()}
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
    cameraContainer: {
        width: '100%',
        height: 300,
        marginBottom: 20,
    },
    camera: {
        flex: 1,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#fff',
    },
    videoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    video: {
        width: 300,
        height: 300,
    },
});
