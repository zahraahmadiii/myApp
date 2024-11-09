import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TextScreen() {
    const [text, setText] = useState('');
    const [storedText, setStoredText] = useState('');

    // Load text from AsyncStorage when the component mounts
    useEffect(() => {
        const loadStoredText = async () => {
            try {
                const savedText = await AsyncStorage.getItem('userText');
                if (savedText) {
                    setStoredText(savedText); // Display the stored text in UI
                }
            } catch (error) {
                console.error('Failed to load text from AsyncStorage:', error);
            }
        };
        loadStoredText();
    }, []);

    // Save the typed text to AsyncStorage
    const saveTextToStorage = async () => {
        if (text.trim() === '') {
            Alert.alert('Error', 'Please enter some text');
            return;
        }
        try {
            await AsyncStorage.setItem('userText', text);
            setStoredText(text); // Immediately show the saved text in the UI
            setText(''); // Clear the input field
        } catch (error) {
            console.error('Failed to save text to AsyncStorage:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Text Screen</Text>

            {/* Text Input to write text */}
            <TextInput
                style={styles.input}
                value={text}
                onChangeText={setText}
                placeholder="Write something..."
            />

            {/* Button to save text */}
            <Button title="Save Text" onPress={saveTextToStorage} />

            {/* Display the saved text */}
            {storedText ? (
                <Text style={styles.savedText}>
                    Saved Text: {storedText}
                </Text>
            ) : (
                <Text>No text saved yet.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f7f7f7',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
    },
    savedText: {
        marginTop: 20,
        fontSize: 16,
        color: '#333',
        fontWeight: 'bold',
    },
});

