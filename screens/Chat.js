import React, {
    useState,
    useEffect,
    useLayoutEffect,
    useCallback,
    useContext
} from 'react'
import { View, Text, TouchableOpacity, SafeAreaView} from 'react-native'
import { GiftedChat, Composer, Send, MessageStatusIndicator, Bubble, TypingIndicator, SystemMessage } from 'react-native-gifted-chat'
import {
    collection,
    addDoc,
    orderBy,
    query,
    limit,
    onSnapshot,
    doc
} from 'firebase/firestore';


import styled from "styled-components/native";
import {flexCenter} from "../utils/styleComponents";
import theme from '../utils/theme';
import GlobalContext from '../context/Context';
import {DBCollectionType, NavigatorType,ScreenType} from "../utils/utils";
import ChatroomModel from '../models/ChatroomModel';
import ErrorScreen from "./ErrorScreen";
import GoBackButton from "../components/GoBackButton";
import MenuButton from '../components/MenuButton'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

export default function Chat({navigation, route}) {
    const { user, gUserModel } = useContext(GlobalContext);
    const {chatroomModelList, postModelList} = useContext(GlobalContext);

    const [messages, setMessages] = useState([]);
    const [hasError, setHasError] = useState(false);
    const [chatModel, setChatModel] = useState(null);
    const [chatroomRef, setChatroomRef] = useState(null);
    const [chatroomMessagesRef, setChatroomMessageRef] = useState(null);
    const [chatroomTitle, setChatroomTitle] = useState("Chatroom");
    const [opponentUserModel, setOpponentUserModel] = useState(null);

    const [postModel, setPostModel] = useState(null);

    const index = route.params.index;

    var Filter = require('bad-words'),
    filter = new Filter();

    useEffect(() => {
        setChatModel(() => chatroomModelList.getOneByDocId(route.params.doc_id));
    },[])

    useEffect(() => {
        if (chatModel === null) return;
        setPostModel(0);

        setChatroomRef(chatModel.ref);
        
        setChatroomMessageRef(collection(chatModel.ref, DBCollectionType.MESSAGES));

        setChatroomTitle(user.email === chatModel.owner.email ? chatModel.customer.username : chatModel.owner.username)

    }, [chatModel])
    
    useLayoutEffect(() => {
        if(chatModel === null || chatroomMessagesRef === null || postModel === null) return;

        navigation.setOptions({
            
            headerTitle: chatroomTitle,
            headerLeft: () => <GoBackButton color={theme.colors.darkGray} ml={15} callback={() => navigation.navigate(ScreenType.CHANNEL)}/>,
            headerRight: () => (
                <MenuButton mr={5} size={6} color={'black'}
                    items={
                            [
                                {name: "Exit", color: theme.colors.primary, callback: handleExitChatroom},
                                {name: "Post", color: theme.colors.primary, callback: (() => navigation.navigate(NavigatorType.CONTENT_DETAIL, {docId: chatModel.postModelId}))},
                                {name: "Report", color: theme.colors.alert, callback: (() => {})},
                            ]
                    }
                />
            )

        });

        const q = query(chatroomMessagesRef, orderBy("createdAt", "desc"));
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
    }, [navigation, chatModel, chatroomMessagesRef, postModel]);
    

    const onSend = useCallback((messages = []) => {

        setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
        const { _id, createdAt, text, user} = messages[0];
        
        addDoc(chatroomMessagesRef, {
            _id,
            createdAt,
            text,
            user
        });


    }, [chatroomMessagesRef]);

    const handleInvite = () => {
        navigation.navigate(ScreenType.USER_SEARCH);
    }
    
    const handleExitChatroom = async () => {
        if(await chatModel.asyncExitChatroom(user.email) === false){
            // TO DO: handle error
            setHasError(true);
            return;
        }else{
            navigation.navigate(ScreenType.CHANNEL);
        }
    }

    /* ------------------
        Error Screen
    -------------------*/
    if (hasError) return <ErrorScreen/>


    renderBubble = (props) => {
        return (
            <View style={{paddingRight: 12}}>
            <View style={{position: 'absolute', right: -1, bottom: 0}}>
                <MessageStatusIndicator messageStatus={props.currentMessage.messageStatus} />
            </View>
            <Bubble {...props} />
            </View>
        )
    }

    onRenderSysyemMessage = (props) => (
        <SystemMessage
            {...props}
            containerStyle= {{backgroundColor:'#0782F9'}}
            textStyle={{color: "white", fontWeight:"500", fontSize: 17, textAlign: 'center'}}
        />
    );


    return (
        <SafeAreaView style={{flex: 1,}} >
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: user?.email,
                    name: user?.displayName,
                    avatar: gUserModel.model.profileImageUrl
                }}
                messagesContainerStyle={{
                    backgroundColor: '#fff'
                }}
                renderTicks={this.renderTicks}
                renderSystemMessage={onRenderSysyemMessage}
                
                bottomOffset={useBottomTabBarHeight()}
                
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