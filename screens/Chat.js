import React, {
    useState,
    useEffect,
    useLayoutEffect,
    useCallback,
    useContext
} from 'react'
import { View, Text, TouchableOpacity, SafeAreaView} from 'react-native'
import { GiftedChat, Composer, Send } from 'react-native-gifted-chat'
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







export default function Chat({navigation, route}) {
    const { user } = useContext(GlobalContext);

    const [messages, setMessages] = useState([]);
    const [hasError, setHasError] = useState(false);

    const chatroomRef = route.params.ref;
    const chatroomMessagesRef = collection(chatroomRef, DBCollectionType.MESSAGES);
    
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

        const handleExitChatroom = async () => {
            if(await ChatroomModel.exitChatroom(chatroomRef, user) === false){
                // TO DO: handle error
                setHasError(true);
                return;
            }else{
                navigation.navigate(ScreenType.CHANNEL);
            }
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

    const pickImageasync = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        let imgURI = null;
        const hasStoragePermissionGranted = status === "granted";

        if (!hasStoragePermissionGranted) return null;


        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (!result.canceled) {
            imgURI = result.uri;
        }

        return imgURI;
    };

    const uploadImageToStorage = async (imgURI) => {
        const ref = `messages/${[FILE_REFERENCE_HERE]}`

        const imgRef = firebase.storage().ref(ref);

        const metadata = { contentType: "image/jpg" };


        // Fetch image data as BLOB from device file manager 

        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", imgURI, true);
            xhr.send(null);
        });

        // Put image Blob data to firebase servers
        await imgRef.put(blob, metadata);

        // We're done with the blob, close and release it
        blob.close();

        // Image permanent URL
        const url = await imgRef.getDownloadURL();


        return url
    };
       

    const handleSendImage = () => {
        try{
            pickImageasync().then((imgURI) => {
                uploadImageToStorage(imgURI);
            })

        }catch(e){
            console.log(e);
        }
    }

    
    renderSend = props => {      
        if (!props.text.trim()) { // text box empty
            return  (
                <TouchableOpacity onPress={handleSendImage}>
                    <Icon name="image" size={40}/>
                </TouchableOpacity>
            );
          }
        return (
            <Send {...props}>
                <Icon2 name='send' size={40}/>     
            </Send>
        );
      }

/* ------------------
    Error Screen
-------------------*/
if (hasError) return <ErrorScreen/>
   
    return (
        <SafeAreaView style={{flex: 1,}}>
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: user?.email,
                    name: user?.displayName,
                    avatar: 'https://i.pravatar.cc/300'
                }}
                messagesContainerStyle={{
                    backgroundColor: '#fff'
                }}
                renderSend={this.renderSend}
                
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