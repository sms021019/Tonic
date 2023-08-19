import React, {
    useState,
    useEffect,
    useLayoutEffect,
    useCallback,
    useContext
} from 'react'
import { View, Text, TouchableOpacity, SafeAreaView} from 'react-native'
import { GiftedChat, Composer, Send, MessageStatusIndicator, Bubble, TypingIndicator } from 'react-native-gifted-chat'
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

import { Menu, Pressable, HamburgerIcon } from 'native-base';
import theme from '../utils/theme';
import GlobalContext from '../context/Context';
import {DBCollectionType, NavigatorType,ScreenType} from "../utils/utils";
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/Octicons';
import Icon2 from 'react-native-vector-icons/Feather';
import ChatroomModel from '../models/ChatroomModel';
import ErrorScreen from "./ErrorScreen";
import GoBackButton from "../components/GoBackButton";
import MenuButton from '../components/MenuButton'

import PostModel from '../models/PostModel';
import DBHelper from '../helpers/DBHelper';
import Loading from '../components/Loading';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import UserModel from "../models/UserModel";




export default function Chat({navigation, route}) {
    const { user, gUserModel } = useContext(GlobalContext);
    const {chatroomModelList, postModelList} = useContext(GlobalContext);

    const [messages, setMessages] = useState([{
        _id: 0,
        text: '부적절하거나 불쾌감을 줄 수 있는 대화는 삼가 부탁드립니다. 회원제재를 받을 수 있습니다.',
        createdAt: new Date().getTime(),
        system: true,
    }]);
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
        setPostModel(() => postModelList.getOneByDocId(chatModel.postModelId));

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
    }, [navigation, chatModel, chatroomMessagesRef, postModel]);
    

    const onSend = useCallback((messages = []) => {

        // messages[0].text = filter.clean(messages[0].text); /// 이거 한국어 안됨 왕니;ㄹ묀;ㅗㅎㅁ;ㅣ뇌;뫼;모미;ㅗㄱ;ㅣ모미친거 아님?
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
        const { _id, createdAt, text, user} = messages[0];
        
        addDoc(chatroomMessagesRef, {
            _id,
            createdAt,
            text,
            user
        });
        // chatModel.setRecentChat(messages[0]);
        // chatroomModelList.liftChatroom(index);

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