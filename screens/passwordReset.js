import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { auth } from '../firebase';
import { sendPasswordResetEmail } from "firebase/auth";
import errorHandler from '../errors/index';



export default PasswordResetScreen = () => {
    const [email, setEmail] = useState('');
    const [emailSent, setEmailSent] = useState('none');

    const handleReset = () => {
        sendPasswordResetEmail(auth, email)
        .then(() => {
            // Password reset email sent!
            console.log("Password reset email sent!")
            setEmail('');
            setEmailSent('block');
        })
        .catch(error => alert(errorHandler(error)))
    }

    return (
        <KeyboardAvoidingView
        style={styles.container}
        behavior='padding'
    >
        <Text>가입 시 사용한 이메일을 입력해주세요</Text>
       <View style = {styles.inputContainer}>
            <TextInput
                placeholder='Email'
                value={email}
                onChangeText={text => setEmail(text)}
                style = {styles.input}
            />
       </View>
       <View style = {styles.buttonContainer}>
        <TouchableOpacity
            onPress={handleReset}
            style={styles.button}
        >   
            <Text style={styles.buttonText}>SEND</Text>
        </TouchableOpacity>
      </View>

      <View style = {{display: emailSent}}>
        <Text>확인된 이메일로 비밀번호 재설정 이메일이 전송되었습니다.{"\n"}이메일을 확인해주세요.</Text>
      </View>
    </KeyboardAvoidingView>
    )
}

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
    buttonText: {
        color: 'white',
        fontWeight: 700,
        fontSize: 16,
    },
})