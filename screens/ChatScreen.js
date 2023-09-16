import React, {Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useState} from 'react'
import {SafeAreaView, StyleSheet, Text, TouchableOpacity} from 'react-native'
import theme from '../utils/theme';
import {useRecoilValue} from "recoil";
import {thisUser, userAtomByEmail} from "../recoil/userState";
import {chatroomAtom} from "../recoil/chatroomState";
import ChatroomController from "../typeControllers/ChatroomController";
import GoBackButton from "../components/GoBackButton";
import {NavigatorType, ScreenType} from "../utils/utils";
import MenuButton from "../components/MenuButton";
import {addDoc, onSnapshot, orderBy, query} from "firebase/firestore";
import {GiftedChat, SystemMessage} from "react-native-gifted-chat";
import {showQuickMessage} from "../helpers/MessageHelper";
import { getInset } from 'react-native-safe-area-view'
import ErrorBoundary from "react-native-error-boundary";
import {Box, Center} from "native-base";
import ProfileImageHelper from "../helpers/ProfileImageHelper";
import LoadingScreen from "./LoadingScreen";
import {postAtom} from "../recoil/postState";


export default function ChatScreenWrapper(props) {
    return (
        <SafeAreaView style={styles.container} >
            <Suspense fallback={<LoadingScreen/>}>
                <ErrorBoundary FallbackComponent={() => <ChatScreenErrorHandler navigation={props.navigation}/>}>
                    <ChatScreen {...props}/>
                </ErrorBoundary>
            </Suspense>
        </SafeAreaView>
    )
}

function ChatScreenErrorHandler({navigation}) {
    function handleRedirectToChannel() {
        navigation.navigate(ScreenType.CHANNEL);
    }

    return (
        <Center style={{width:'100%', height:'100%'}}>
            <Text style={styles.errorText}>Fail to open a chat.</Text>
            <Box marginTop={3}></Box>
            <TouchableOpacity onPress={handleRedirectToChannel}>
                <Text style={styles.redirectText}>Redirect</Text>
            </TouchableOpacity>
        </Center>
    )
}

export function ChatScreen({navigation, chatroomId}) {
    const [messages, setMessages] = useState([]);
    const user = useRecoilValue(thisUser);
    const chatroom = useRecoilValue(chatroomAtom(chatroomId));
    const post = useRecoilValue(postAtom(chatroom?.postId));
    const chatroomMessageRef = ChatroomController.getChatroomMessageRefById(chatroomId)
    const opponentUserEmail = chatroom.customerEmail === user.email ? chatroom.ownerEmail : chatroom.customerEmail;
    const opponentUser = useRecoilValue(userAtomByEmail(opponentUserEmail));

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: opponentUser.username,
            headerLeft: () => <GoBackButton color={theme.colors.darkGray} ml={15} callback={() => navigation.navigate(ScreenType.CHANNEL)}/>,
            headerRight: () => (
                <MenuButton mr={5} size={6} color={'black'}
                    items={
                        [
                            {name: "Exit chatroom", color: theme.colors.primary, callback: asyncExitChatroom},
                            {name: "See post", color: theme.colors.primary, callback: handleSeePost},
                            {name: "Report user", color: theme.colors.alert, callback: (() => {})},
                        ]
            }/>)
        });
    }, [navigation]);

    useEffect(() => {
        const q = query(chatroomMessageRef, orderBy("createdAt", "desc"));

        const opponentUserProfileImageUrl = ProfileImageHelper.getProfileImageUrl(opponentUser.profileImageType);
        const unsubscribe = onSnapshot(q, snapshot => {
            let temp = snapshot.docs.map(doc => ({
                _id: doc.id,
                createdAt: doc.data().createdAt.toDate(),
                text: doc.data().text,
                user: {...doc.data()?.user, avatar: opponentUserProfileImageUrl}
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
    }, [])

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

    const myProfileImageUrl = useMemo(() => {
        return ProfileImageHelper.getProfileImageUrl(user.profileImageType);
    }, [user])

    async function asyncExitChatroom() {
        if(await ChatroomController.asyncExitChatroom(chatroom) === false) {
            console.log('Failed to exit chatroom with unknown error');
            return;
        }

        showQuickMessage('Exited from chat');
        navigation.navigate(ScreenType.CHANNEL);
    }

    async function handleSeePost() {
        if (!post) {
            alert("This post is deleted.");
        }
        else {
            navigation.navigate(NavigatorType.CONTENT_DETAIL, {postId: chatroom.postId});
        }
    }

    async function handleReportUser() {

    }

    const onRenderSysyemMessage = (props) => (
        <SystemMessage
            {...props}
            containerStyle= {{backgroundColor:'#c0c0c0', borderRadius: 15, margin:10, padding:4}}
            textStyle={{color: "white", fontWeight:"300", fontSize: 16, textAlign: 'center'}}
        />
    );

    return (
        <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
                _id: user.email,
                name: user.username,
                avatar: myProfileImageUrl,
            }}
            messagesContainerStyle={{
                backgroundColor: '#fff'
            }}
            renderTicks={this.renderTicks}
            renderSystemMessage={onRenderSysyemMessage}

            bottomOffset={getInset('bottom')}
        />
    )
}

const styles = StyleSheet.create({
    container: {display: 'flex', flex: 1, backgroundColor: theme.colors.white,},
    redirectText: {fontWeight:'600', fontSize:16, color: theme.colors.primary},
})
