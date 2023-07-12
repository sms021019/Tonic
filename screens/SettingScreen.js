import React from 'react'
import {Text, StyleSheet, View} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {signOut} from "firebase/auth";
import {auth} from "../firebase";

export default function SettingScreen({navigation}) {
    function logout() {
        signOut(auth).then(() => {
            console.log('signed out')
        }).catch((error) => {
            console.log(error);
        })
    }


    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={logout}>
                <Text style={styles.buttonText}>Account/Privacy Setting</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#f0f8ff', //걍 연한 파랑
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#00BFFF', //좀 연하지만 진한 파랑
        padding: 15,
        borderRadius: 10, // 둥글이
        marginVertical: 10,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5
    },
    buttonText: {
        fontSize: 20,
        color: 'white'
    },
});
