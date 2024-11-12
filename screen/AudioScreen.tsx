import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AudioScreen() {
    const [recording, setRecording] = useState(null);
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioBase64, setAudioBase64] = useState(null);
    const [playbackPosition, setPlaybackPosition] = useState(0);
    const [playbackDuration, setPlaybackDuration] = useState(0);

    // Load previously recorded audio from AsyncStorage on component mount
    useEffect(() => {
        const loadAudio = async () => {
            const savedAudioBase64 = await AsyncStorage.getItem('audioBase64');
            if (savedAudioBase64) setAudioBase64(savedAudioBase64);
        };
        loadAudio();
    }, []);

    // Interval to update playback position while playing
    useEffect(() => {
        let interval;
        if (isPlaying && sound) {
            interval = setInterval(async () => {
                const status = await sound.getStatusAsync();
                if (status.isLoaded) {
                    setPlaybackPosition(status.positionMillis);
                    setPlaybackDuration(status.durationMillis);
                }
            }, 500); // Update every 500ms
        }
        return () => clearInterval(interval);
    }, [isPlaying, sound]);

    // Start audio recording
    const startRecording = async () => {
        try {
            const permission = await Audio.requestPermissionsAsync();
            if (!permission.granted) {
                Alert.alert('Permission Denied', 'Microphone permission is required to record audio.');
                return;
            }
            const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
            setRecording(recording);
            await recording.startAsync();
            console.log('Recording started...');
        } catch (error) {
            console.error('Error starting recording:', error);
        }
    };

    // Stop recording, save to AsyncStorage, and convert to Base64
    const stopRecording = async () => {
        if (recording) {
            try {
                await recording.stopAndUnloadAsync();
                const uri = recording.getURI();
                const base64 = await FileSystem.readAsStringAsync(uri, {
                    encoding: FileSystem.EncodingType.Base64,
                });
                await AsyncStorage.setItem('audioBase64', base64);
                setAudioBase64(base64);
                console.log('Recording saved.');
            } catch (error) {
                console.error('Error stopping recording:', error);
            } finally {
                setRecording(null);
            }
        }
    };

    // Play audio from Base64 data
    const playAudio = async () => {
        if (audioBase64) {
            try {
                if (sound) {
                    await sound.unloadAsync();
                }
                const { sound: newSound } = await Audio.Sound.createAsync(
                    { uri: `data:audio/mp4;base64,${audioBase64}` },
                    { shouldPlay: true }
                );
                setSound(newSound);
                setIsPlaying(true);
                console.log('Playing audio...');
            } catch (error) {
                console.error('Error playing audio:', error);
            }
        } else {
            Alert.alert('No audio found', 'Please record an audio first.');
        }
    };

    // Update playback status
    const updatePlaybackStatus = (status) => {
        if (status.isLoaded) {
            setPlaybackPosition(status.positionMillis);
            if (!playbackDuration) setPlaybackDuration(status.durationMillis);
            if (status.didJustFinish) {
                setIsPlaying(false);
                setPlaybackPosition(0);
                sound && sound.stopAsync();
            }
        }
    };

    // Handle slider position change
    const handleSliderChange = async (value) => {
        if (sound) {
            await sound.setPositionAsync(value);
            setPlaybackPosition(value);
        }
    };

    return (
        <View style={styles.container}>
            {!recording && !isPlaying && (
                <Button title="Record a Voice" onPress={startRecording} />
            )}
            {recording && <Button title="Stop Recording" onPress={stopRecording} />}
            {audioBase64 && !isPlaying && !recording && (
                <Button title="Play Recorded Audio" onPress={playAudio} />
            )}
            {isPlaying && (
                <View style={styles.timelineContainer}>
                    <Text>Playing...</Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={playbackDuration}
                        value={playbackPosition}
                        onValueChange={(value) => setPlaybackPosition(value)}
                        onSlidingComplete={handleSliderChange}
                    />
                    <Text>
                        {Math.floor(playbackPosition / 1000)}s / {Math.floor(playbackDuration / 1000)}s
                    </Text>
                </View>
            )}
            {!audioBase64 && <Text>No audio recorded yet</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f7f7f7',
    },
    timelineContainer: {
        alignItems: 'center',
        width: '80%',
        marginTop: 20,
    },
    slider: {
        width: '100%',
        height: 40,
        marginTop: 10,
    },
});
