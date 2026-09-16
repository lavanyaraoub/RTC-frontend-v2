import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { socket } from '../../helpers/SocketContext'; // Adjust this path if your SocketContext.js is elsewhere

const TextProgramScreen = () => {
  const [ipAddress, setIpAddress] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [filePath, setFilePath] = useState('');

  const handleSave = () => {
    if (!ipAddress.trim() || !username.trim() || !password.trim() || !filePath.trim()) {
      Alert.alert('Validation Error', 'Please fill out all fields before saving.');
      return;
    }

    const configData = {
      ip: ipAddress,
      user: username,
      password: password,
      path: filePath,
    };

    // This sends the new event to your Go backend
    socket.emit('save-text-program', configData);

    Alert.alert('Success', 'Configuration has been sent to the server.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>PC Configuration</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Computer's IP Address</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 192.168.1.100"
            placeholderTextColor="#666"
            value={ipAddress}
            onChangeText={setIpAddress}
            keyboardType="default"
            autoCapitalize='none'
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Computer's User Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter username"
            placeholderTextColor="#666"
            value={username}
            onChangeText={setUsername}
            autoCapitalize='none'
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Computer's Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize='none'
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>User File Path</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., C:\\Users\\program.txt"
            placeholderTextColor="#666"
            value={filePath}
            onChangeText={setFilePath}
            autoCapitalize='none'
          />
        </View>
        
        <TouchableOpacity style={[styles.button, styles.buttonGreen]} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1c1c1e',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#2c2c2e',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#444',
  },
  button: {
    marginTop: 10,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonGreen: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TextProgramScreen;