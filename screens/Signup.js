import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Button, ButtonGroup } from '@rneui/themed';
import React, { useEffect, useState } from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebase';
import errorHandler from '../errors/index';


const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [passowrd, setPassword] = useState('');
    const [username, setUsername] = useState('');

    
    const handleSignUp = async () => {
            createUserWithEmailAndPassword(auth, email, passowrd)
            .then(userCredentials => {
                updateProfile(auth.currentUser, { displayName: username }).catch(
                  (err) => console.log(err)
                );
                console.log('Registered in with: ', userCredentials.user.email);
            })
            .catch(error => alert(errorHandler(error)))
    }

    // const handleSignUp = async (username, email, password) => {
    //   try {
    //     await createUserWithEmailAndPassword(auth, email, password).catch((err) =>
    //       console.log(err)
    //     );
    //     await updateProfile(auth.currentUser, { displayName: username }).catch(
    //       (err) => console.log(err)
    //     );
    //   } catch (err) {
    //     console.log(err);
    //   }
    // };

  return (
    <KeyboardAvoidingView
        style={styles.container}
        behavior='padding'
    >
      <View style = {styles.inputContainer}>
        <TextInput
            placeholder='Username'
            value={username}
            onChangeText={text => setUsername(text)}
            style = {styles.input}
        />
        <TextInput
            placeholder='Email'
            value={email}
            onChangeText={text => setEmail(text)}
            style = {styles.input}
        />
        <TextInput
            placeholder='Password'
            value={passowrd}
            onChangeText={text => setPassword(text)}
            style = {styles.input}
            secureTextEntry
        />
      </View>

      <View style = {styles.buttonContainer}>
        <TouchableOpacity
            onPress={handleSignUp}
            style={[styles.button, styles.buttonOutline]}
        >   
            <Text style={styles.buttonOutlineText}>Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        width: '80%'
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,

    },
    button: {
        backgroundColor: '#0782F9',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center'
    },
    buttonOutline: {
        backgroundColor: 'white',
        marginTop: 5,
        borderColor: '#0782F9',
        borderWidth: 2,
    },
    buttonText: {
        color: 'white',
        fontWeight: 700,
        fontSize: 16,
    },
    buttonOutlineText: {
        color: '#0782F9',
        fontWeight: 700,
        fontSize: 16,
    },
})