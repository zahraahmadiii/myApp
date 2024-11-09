import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to my app</Text>

            <View style={styles.buttonContainer}>
                {/* Custom TouchableOpacity button styles */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('ImageScreen')}
                >
                    <Text style={styles.buttonText}>Image</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('AudioScreen')}
                >
                    <Text style={styles.buttonText}>Audio</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('VideoScreen')}
                >
                    <Text style={styles.buttonText}>Video</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('TextScreen')}
                >
                    <Text style={styles.buttonText}>Text</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f7f7f7', // Light background color
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 40, // Spacing between title and buttons
    },
    buttonContainer: {
        width: '100%',
        paddingHorizontal: 20,
    },
    button: {
        backgroundColor: '#6200ea', // Material Design Purple
        paddingVertical: 15,
        marginBottom: 15,
        borderRadius: 8, // Rounded corners
        alignItems: 'center', // Center the text inside the button
    },
    buttonText: {
        color: '#fff', // White text for the buttons
        fontSize: 18,
        fontWeight: '600',
    },
});
