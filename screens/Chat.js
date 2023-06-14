import React, {
    useState,
    useEffect,
    useLayoutEffect,
    useCallback
} from 'react'
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import {
    collection,
    addDoc,
    orderBy,
    query,
    limit,
    onSnapshot,
    doc
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import styled from "styled-components/native";
import {flexCenter} from "../utils/styleComponents";

import Channel from './Channel';
import { signOut } from 'firebase/auth';



export default function Chat({navigation: {navigate}, route}) {
    const [messages, setMessages] = useState([]);
    const collectionRef = collection(db, 'chatrooms');
    const chatroomRef = doc(collectionRef, route.params.id);
    const chatroomMessagesRef = collection(chatroomRef, "messages");
    

    useLayoutEffect(() => {
        
        


        const q = query(chatroomMessagesRef, orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, snapshot => {
            
            setMessages(
                snapshot.docs.map(doc => ({
                    _id: doc.id,
                    createdAt: doc.data().createdAt.toDate(),
                    text: doc.data().text,
                    user: doc.data().user
                }))
            )
        });
        return () => unsubscribe();
    }, []);
    

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages));

        const { _id, createdAt, text, user} = messages[0];
        addDoc(chatroomMessagesRef, {
            _id,
            createdAt,
            text,
            user
        });
    }, []);

    
   
    return (
        <SafeAreaView style={{flex: 1,}}>
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: auth?.currentUser?.email,
                    name: auth?.currentUser?.displayName,
                    avatar: 'https://i.pravatar.cc/300'
                }}
                messagesContainerStyle={{
                    backgroundColor: '#fff'
                }}
                
            />
        </SafeAreaView>
            
    )
}

const Container = styled.View`
  ${flexCenter};
  background-color: #fff;
  align-items: center;
  justify-content: center;
`;