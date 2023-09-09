import React, {useState, useLayoutEffect, useCallback } from 'react'
import {View, SafeAreaView, StyleSheet} from 'react-native'
import { GiftedChat, MessageStatusIndicator, Bubble, SystemMessage } from 'react-native-gifted-chat'
import { addDoc, orderBy, query, onSnapshot,} from 'firebase/firestore';
import styled from "styled-components/native";
import {flexCenter} from "../utils/styleComponents";
import theme from '../utils/theme';
import {NavigatorType,ScreenType} from "../utils/utils";
import GoBackButton from "../components/GoBackButton";
import MenuButton from '../components/MenuButton'
import { useRecoilValue } from 'recoil';
import { thisUser, userAtomByEmail } from '../recoil/userState';
import { chatroomAtom } from '../recoil/chatroomState';
import ChatroomController from '../typeControllers/ChatroomController';
import {showQuickMessage} from "../helpers/MessageHelper";
import { getInset } from 'react-native-safe-area-view'


export default function ChatScreen({navigation, chatroomId}) {
    const [messages, setMessages] = useState([]);
    const user = useRecoilValue(thisUser);
    const chatroom = useRecoilValue(chatroomAtom(chatroomId));
    const chatroomMessageRef = ChatroomController.getChatroomMessageRefById(chatroomId)
    const opponentUserEmail = chatroom.customerEmail === user.email ? chatroom.ownerEmail : chatroom.customerEmail;
    const opponentUser = useRecoilValue(userAtomByEmail(opponentUserEmail));

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: opponentUser.username,
            headerLeft: () => <GoBackButton color={theme.colors.darkGray} ml={15} callback={() => navigation.navigate(ScreenType.CHANNEL)}/>,
            headerRight: () => (
                <MenuButton mr={5} size={6} color={'black'}
                    items={
                            [
                                {name: "Exit chatroom", color: theme.colors.primary, callback: asyncExitChatroom},
                                {name: "See post", color: theme.colors.primary, callback: (() => navigation.navigate(NavigatorType.CONTENT_DETAIL, {postId: chatroom.postId}))},
                                {name: "Report user", color: theme.colors.alert, callback: (() => {})},
                            ]
            }/>)
        });

        const q = query(chatroomMessageRef, orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, snapshot => {
            let temp = snapshot.docs.map(doc => ({
                _id: doc.id,
                createdAt: doc.data().createdAt.toDate(),
                text: doc.data().text,
                user: doc.data().user
            }));
            temp.push({
                _id: 0,
                text: 'Please refrain from inappropriate or offensive conversations. You may face membership sanctions.',
                createdAt: new Date().getTime(),
                system: true,
            });
            setMessages(temp);

        });

        return () => unsubscribe();
    }, [navigation]);


    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
        const { _id, createdAt, text, user} = messages[0];

        addDoc(chatroomMessageRef, {
            _id,
            createdAt,
            text,
            user
        });

    }, [chatroomMessageRef]);

    async function asyncExitChatroom () {
        if(await ChatroomController.asyncExitChatroom(chatroom) === false) {
            console.log('Failed to exit chatroom with unknown error');
            return;
        }

        showQuickMessage('Exited from chat');
        navigation.navigate(ScreenType.CHANNEL);
    }


    const renderBubble = (props) => {
        return (
            <View style={{paddingRight: 12}}>
            <View style={{position: 'absolute', right: -1, bottom: 0}}>
                <MessageStatusIndicator messageStatus={props.currentMessage.messageStatus} />
            </View>
            <Bubble {...props} />
            </View>
        )
    }

    const onRenderSysyemMessage = (props) => (
        <SystemMessage
            {...props}
            containerStyle= {{backgroundColor:'#c0c0c0', borderRadius: 15, margin:10, padding:4}}
            textStyle={{color: "white", fontWeight:"300", fontSize: 16, textAlign: 'center'}}
        />
    );

    return (
        <SafeAreaView style={styles.container} >
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: user.email,
                    name: user.username,
                    avatar: user.profileImageType
                }}
                messagesContainerStyle={{
                    backgroundColor: '#fff'
                }}
                renderTicks={this.renderTicks}
                renderSystemMessage={onRenderSysyemMessage}

                bottomOffset={getInset('bottom')}

            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        backgroundColor: theme.colors.white,
    },
})
