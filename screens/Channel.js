import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../firebase';
import { QuerySnapshot, onSnapshot } from 'firebase/firestore';
import {Text, View, TouchableOpacity, StyleSheet, TextInput, FlatList} from "react-native";
import { query, orderBy, limit, collection, serverTimestamp, addDoc } from "firebase/firestore";
import { useFirestoreQuery } from '../context/Context';




const Channel = ({ user = null, id = null }) => {
    
    const messagesRef = db.collection(`messages-${id}`);
    const messages = useFirestoreQuery(
        messagesRef.orderBy("createdAt","desc").limit(100)
    );

    const [newMessage, setNewMessage] = useState("");
 
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
