// import React, { useEffect, useState } from 'react';
// import { View, Text, Button, StyleSheet, Alert } from 'react-native';
// import { Audio } from 'expo-av';  // Updated to 'expo-av'
// import * as FileSystem from 'expo-file-system';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export default function AudioScreen({ navigation }) {
//     const [recording, setRecording] = useState(null);
//     const [sound, setSound] = useState();
//     const [isPlaying, setIsPlaying] = useState(false);
//     const [audioBase64, setAudioBase64] = useState(null);

//     useEffect(() => {
//         // Load the saved audio from AsyncStorage when the component mounts
//         const loadAudio = async () => {
//             const savedAudioBase64 = await AsyncStorage.getItem('audioBase64');
//             if (savedAudioBase64) {
//                 setAudioBase64(savedAudioBase64); // Set the saved Base64 string
//             }
//         };
//         loadAudio();
//     }, []);

//     // Start recording audio
//     const startRecording = async () => {
//         try {
//             // Request permissions for microphone (this is handled by expo-av now)
//             const permission = await Audio.requestPermissionsAsync();
//             if (permission.granted) {
//                 // Start the recording
//                 const { recording } = await Audio.Recording.createAsync(
//                     Audio.RecordingOptionsPresets.HIGH_QUALITY
//                 );
//                 setRecording(recording);
//                 console.log('Recording started...');
//                 await recording.startAsync();
//             } else {
//                 Alert.alert('Permission Denied', 'Microphone permission is required to record audio.');
//             }
//         } catch (error) {
//             console.error('Error starting recording:', error);
//         }
//     };

//     // Stop recording audio and save it as Base64 in AsyncStorage
//     const stopRecording = async () => {
//         if (recording) {
//             try {
//                 console.log('Stopping recording...');
//                 await recording.stopAndUnloadAsync();
//                 const uri = recording.getURI();
//                 const base64 = await FileSystem.readAsStringAsync(uri, {
//                     encoding: FileSystem.EncodingType.Base64,
//                 });
//                 await AsyncStorage.setItem('audioBase64', base64); // Save to AsyncStorage
//                 setAudioBase64(base64); // Update state with the recorded audio
//                 console.log('Recording stopped and saved.');
//             } catch (error) {
//                 console.error('Error stopping recording:', error);
//             } finally {
//                 setRecording(null); // Reset recording state
//             }
//         }
//     };

//     // Play the recorded audio
//     const playAudio = async () => {
//         if (audioBase64) {
//             try {
//                 const { sound } = await Audio.Sound.createAsync(
//                     { uri: `data:audio/mp4;base64,${audioBase64}` },
//                     { shouldPlay: true }
//                 );
//                 setSound(sound);
//                 setIsPlaying(true);
//                 console.log('Playing audio...');
//                 sound.setOnPlaybackStatusUpdate((status) => {
//                     if (status.didJustFinish) {
//                         setIsPlaying(false);
//                     }
//                 });
//             } catch (error) {
//                 console.error('Error playing audio:', error);
//             }
//         } else {
//             Alert.alert('No audio found', 'Please record an audio first.');
//         }
//     };

//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>Audio Screen</Text>

//             {recording ? (
//                 <Button title="Stop Recording" onPress={stopRecording} />
//             ) : (
//                 <Button title="Start Recording" onPress={startRecording} />
//             )}

//             {audioBase64 && !isPlaying && (
//                 <Button title="Play Recorded Audio" onPress={playAudio} />
//             )}

//             {isPlaying && <Text>Playing...</Text>}

//             {!audioBase64 && <Text>No audio recorded yet</Text>}
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 20,
//         backgroundColor: '#f7f7f7',
//     },
//     title: {
//         fontSize: 28,
//         fontWeight: 'bold',
//         color: '#333',
//         marginBottom: 40,
//     },
// });
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { Audio } from 'expo-av'; // Updated to 'expo-av'
import Slider from '@react-native-community/slider'; // Updated import
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AudioScreen({ navigation }) {
    const [recording, setRecording] = useState(null);
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioBase64, setAudioBase64] = useState(null);
    const [playbackPosition, setPlaybackPosition] = useState(0);
    const [playbackDuration, setPlaybackDuration] = useState(0);

    useEffect(() => {
        const loadAudio = async () => {
            const savedAudioBase64 = await AsyncStorage.getItem('audioBase64');
            if (savedAudioBase64) {
                setAudioBase64(savedAudioBase64);
            }
        };
        loadAudio();
    }, []);

    const startRecording = async () => {
        try {
            const permission = await Audio.requestPermissionsAsync();
            if (permission.granted) {
                const { recording } = await Audio.Recording.createAsync(
                    Audio.RecordingOptionsPresets.HIGH_QUALITY
                );
                setRecording(recording);
                console.log('Recording started...');
                await recording.startAsync();
            } else {
                Alert.alert('Permission Denied', 'Microphone permission is required to record audio.');
            }
        } catch (error) {
            console.error('Error starting recording:', error);
        }
    };

    const stopRecording = async () => {
        if (recording) {
            try {
                console.log('Stopping recording...');
                await recording.stopAndUnloadAsync();
                const uri = recording.getURI();
                const base64 = await FileSystem.readAsStringAsync(uri, {
                    encoding: FileSystem.EncodingType.Base64,
                });
                await AsyncStorage.setItem('audioBase64', base64);
                setAudioBase64(base64);
                console.log('Recording stopped and saved.');
            } catch (error) {
                console.error('Error stopping recording:', error);
            } finally {
                setRecording(null);
            }
        }
    };

    const playAudio = async () => {
        if (audioBase64) {
            try {
                const { sound } = await Audio.Sound.createAsync(
                    { uri: `data:audio/mp4;base64,${audioBase64}` },
                    { shouldPlay: true }
                );
                setSound(sound);
                setIsPlaying(true);
                sound.setOnPlaybackStatusUpdate(updatePlaybackStatus);
                console.log('Playing audio...');
            } catch (error) {
                console.error('Error playing audio:', error);
            }
        } else {
            Alert.alert('No audio found', 'Please record an audio first.');
        }
    };

    const updatePlaybackStatus = (status) => {
        if (status.isLoaded && status.isPlaying) {
            setPlaybackPosition(status.positionMillis);
            setPlaybackDuration(status.durationMillis);
        } else if (status.didJustFinish) {
            setIsPlaying(false);
            setPlaybackPosition(0);
            setPlaybackDuration(0);
            sound && sound.stopAsync();
        }
    };

    const handleSliderChange = async (value) => {
        if (sound) {
            await sound.setPositionAsync(value);
        }
    };

    return (
        <View style={styles.container}>

            {!recording && !isPlaying && (
                <Button title="Record a Voice" onPress={startRecording} />
            )}

            {recording && (
                <Button title="Stop Recording" onPress={stopRecording} />
            )}

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
                        onValueChange={handleSliderChange}
                    />
                    <Text>{Math.floor(playbackPosition / 1000)}s / {Math.floor(playbackDuration / 1000)}s</Text>
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
        gap: 30,
        padding: 20,
        backgroundColor: '#f7f7f7',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 40,
    },
    timelineContainer: {
        alignItems: 'center',
        width: '80%',
    },
    slider: {
        width: '100%',
        height: 40,
        marginTop: 10,
    },
});
