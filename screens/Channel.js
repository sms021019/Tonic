import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../firebase';
import { QuerySnapshot, onSnapshot } from 'firebase/firestore';
import {Text, View, TouchableOpacity, StyleSheet, TextInput, FlatList} from "react-native";
import { query, orderBy, limit, collection, serverTimestamp, addDoc } from "firebase/firestore";




const Channel = ({ user = null }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState();

    useEffect(() => {
        if(db) {
            const messagesCollection = collection(db, 'messages');
            const q = query(messagesCollection, orderBy("createdAt"), limit(100));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const data = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id,
                }));
                setMessages(data);
            })
            return unsubscribe;
        }
    }, [db]);

    // input 필드 포커싱과 하단 스크롤을 위한 useRef
    const inputRef = useRef();
    const bottomListRef = useRef();

    const handleSend = async () => {
        await addDoc(collection(db, "messages"), {
            text: newMessage,
            createdAt: serverTimestamp(),
            username: auth.currentUser.displayName,
            email: auth.currentUser.email,
        });
        setNewMessage();
    }
 
    return (
        <View style={styles.container}>
            {messages.map(message => (
                <Text key={message.id}>{message.text}</Text>
            ))}
            <View style = {styles.inputContainer}>
                <TextInput
                    ref={bottomListRef}
                    value={newMessage}
                    onChangeText={text => setNewMessage(text)}
                    placeholder='Type your message here ...'
                    style = {styles.input}
                />
            </View>
            <TouchableOpacity
                onPress={handleSend}
                disabled = {!newMessage}
            >
                <Text style={styles.buttonOutlineText}>SEND</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Channel;

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