import React from 'react'
import {Text, StyleSheet, View} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const SettingScreen = ({navigation}) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={() => {
                // 계정 설정 / 알람 등
            }}>
                <Text style={styles.buttonText}>Account/Privacy Setting</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => {
                // 이 앱에 대한 기초적 설명
            }}>
                <Text style={styles.buttonText}>About</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => {
                // 언어 세팅 (만약 있다면)
            }}>
                <Text style={styles.buttonText}>Language</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => {
                // 로그아웃
            }}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => {
                // 계정 삭제
            }}>
                <Text style={styles.buttonText}>Delete Account</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => {
                navigation.navigate('ContactPage');
            }}>
                <Text style={styles.buttonText}>Contact</Text>
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

export default SettingScreen;