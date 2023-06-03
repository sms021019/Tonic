import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { QuerySnapshot, onSnapshot } from 'firebase/firestore';
import {Text, View} from "react-native";
import { query, orderBy, limit, collection } from "firebase/firestore";



const Channel = ({ user = null }) => {
    const [messages, setMessages] = useState([]);

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

    return (
        <View>
            {messages.map(message => (
                <Text key={message.id}>{message.text}</Text>
            ))}
        </View>
    );
};

export default Channel;