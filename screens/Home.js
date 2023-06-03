import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { signOut } from 'firebase/auth'
import { useNavigation } from '@react-navigation/native';
import { errorHandler } from '../errors';
import { auth, db } from '../firebase';
import { getDocs, collection } from "firebase/firestore";
// import { getUsername } from '../firestore';

const HomeScreen = () => {
    const navigation = useNavigation() 
    const [username, setUsername] = useState(auth.currentUser?.displayName);
    
    

    const getUsername = async () => {
        console.log("finding username...");
        const userCollection = collection(db, 'users'); 
        const userSnap = await getDocs(userCollection);
        userSnap.forEach(doc => {
            if(doc.data().uid === auth.currentUser.uid){setUsername(doc.data().username);console.log("set username..")}
        });
    }
    getUsername();
    

    const handleSignOut = () => {
        signOut(auth)
        .then(() => {
            navigation.replace("LoginNavigator")
            console.log(`${username} logged out`)
        })
        .catch(error => alert(errorHandler(error)))
    }

  return (
    <View style={styles.container}>
      <Text>Email: {auth.currentUser?.email}</Text>
      <Text>Username: {username}</Text>
      <TouchableOpacity
        onPress={handleSignOut}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#0782F9',
        width: '60%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 40,
    },
    buttonText: {
        color: 'white',
        fontWeight: 700,
        fontSize: 16,
    },
})