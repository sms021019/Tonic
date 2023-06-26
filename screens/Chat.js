import React, {
    useState,
    useEffect,
    useLayoutEffect,
    useCallback,
    useContext
} from 'react'
import { View, Text, TouchableOpacity, SafeAreaView} from 'react-native'
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
import { AntDesign, Feather } from '@expo/vector-icons';
import styled from "styled-components/native";
import {flexCenter} from "../utils/styleComponents";

import Channel from './Channel';
import { signOut } from 'firebase/auth';

import { Menu, Pressable, HamburgerIcon } from 'native-base';
import theme from '../utils/theme';
import GlobalContext from '../context/Context';
import { ExitChatroom } from './Channel';
import {NavigatorType,ScreenType} from "../utils/utils";





export default function Chat({navigation, route}) {
    const [messages, setMessages] = useState([]);
    // const collectionRef = collection(db, 'chatrooms');
    // const chatroomRef = doc(collectionRef, route.params.id);
    // console.log(route.params.ref);
    const chatroomRef = route.params.ref;
    const chatroomMessagesRef = collection(chatroomRef, "messages");
    const { user } = useContext(GlobalContext);
    

    useLayoutEffect(() => {

        navigation.setOptions({
            headerRight: () =>
            <Menu w="120px" trigger={triggerProps => {
                return (
                    <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                        <HamburgerIcon size={6} color="black" mr={5}/>
                    </Pressable>
                );
            }}>
        
                    <>
                        <Menu.Item onPress={handleExitChatroom}>
                            <Text style={{color: theme.colors.primary}}>Exit</Text>
                        </Menu.Item>
                        <Menu.Item onPress={() => {}}>
                            <Text style={{color: theme.colors.alert}}>Delete</Text>
                        </Menu.Item>
                    </>

                
            </Menu>
        });

        const handleExitChatroom = () => {
            ExitChatroom(chatroomRef, user).then(() => {
                navigation.navigate(ScreenType.CHANNEL);
            })
        }

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