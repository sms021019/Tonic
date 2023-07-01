import React, {useLayoutEffect, useState, useContext, useEffect} from 'react'
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native'
import styled from "styled-components/native";
import {flexCenter, TonicButton} from "../utils/styleComponents";
import {NavigatorType, PageMode, ScreenType, windowHeight, windowWidth} from "../utils/utils";
import GoBackButton from "../components/GoBackButton";
import theme from '../utils/theme';
import {Box, Flex, ScrollView, Menu, Pressable, HamburgerIcon} from "native-base";
import Swiper from "react-native-swiper";
import {LinearGradient} from "expo-linear-gradient";
import EllipsisButton from "../components/EllipsisButton";
import { CreateChatroom } from './Channel';
import { db } from '../firebase';
import { 
    doc,
    getDoc
} from 'firebase/firestore';
import GlobalContext from '../context/Context';

export default function ContentDetailScreen({navigation, postData}) {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        let postUserRef = doc(db, `/users/${postData.user}`);
        getDoc(postUserRef).then((doc) => {
            setUserInfo(doc.data());
            console.log('loaded data')
        })
    },[])

    useLayoutEffect(() => {
        
        navigation.setOptions({
            headerTransparent: true,
            headerTitle: "",
            headerLeft: () => <GoBackButton
                color={theme.colors.white}
                ml={15}
                callback={() => navigation.navigate(NavigatorType.HOME)}
            />,
            // TODO : check if the current user is the owner of the post.
            headerRight: () =>
                <Menu w="120px" trigger={triggerProps => {
                    return (
                        <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                            <HamburgerIcon size={6} color="white" mr={5}/>
                        </Pressable>
                    );
                }}>
                    {(/* is mine? */ true)?
                        <>
                            <Menu.Item onPress={handleEditPost}>
                                <Text style={{color: theme.colors.primary}}>Edit</Text>
                            </Menu.Item>
                            <Menu.Item onPress={handleDeletePost}>
                                <Text style={{color: theme.colors.alert}}>Delete</Text>
                            </Menu.Item>
                        </>
                        :
                        <>
                            <Menu.Item onPress={handleReportPost}>
                            <Text style={{color: theme.colors.alert}}>Report</Text>
                            </Menu.Item>
                        </>
                    }
                </Menu>
        });
    }, [navigation]);
    
    const uriWraps = postData.imageDownloadUrls;
    const title = postData.title;
    const price = postData.price;
    const info = postData.info;
    const userEmail = postData.user;
    const { user } = useContext(GlobalContext);
    

    const handleChatClick = () => {
        CreateChatroom(doc(db, `/users/${userEmail}`), user).then((ref) => {
            navigation.navigate(NavigatorType.CHAT, { screen: ScreenType.CHAT, params: {ref: ref}, });
        });
    }


    function handleEditPost() {
        navigation.navigate(NavigatorType.POSTING, {mode: PageMode.EDIT, data: postData});
    }

    function handleDeletePost() {

    }

    function handleReportPost() {

    }

    return (
        <Container>
            <ScrollView>
                <Swiper
                    height={windowWidth}
                    dot={<View style={styles.dot} />}
                    activeDot={<View style={styles.activeDot} />}
                    loop={false}
                >
                    {uriWraps.map((wrap, index) => (
                        <View key={wrap.oUri + index}>
                            <Image style={{width: windowWidth, height: windowWidth}}
                                   source={{uri: wrap.oUri}}
                            />
                            <LinearGradient
                                // Background Linear Gradient
                                colors={['rgba(0,0,0,0.1)', 'transparent']}
                                start={{ x: 0, y: 0.2}}
                                end={{x: 0, y: 0.3}}
                                style={styles.background}
                            />
                        </View>
                    ))}
                </Swiper>
                <View style={styles.contentArea}>
                    <Box w="100%" h="60px" alignItems="left" justifyContent="center">
                        <Text style={styles.titleText}>{title}</Text>
                    </Box>
                    <Flex w="100%" h="30px" mb="50px" direction="row" alignItems="center">
                        <Text style={styles.userNameText}>{`@${userInfo?.username}`}</Text>
                        <Text style={{color:'gray'}}>1 day ago</Text>
                    </Flex>
                    <Text style={styles.contentText}>{info}</Text>
                </View>
            </ScrollView>
            <View style={styles.footerArea}>
                <Flex direction="row" alignItems='center'>
                    <Text flex="1" style={styles.priceText}>
                        ${price.toLocaleString()}
                    </Text>
                    <ChatButton style={{marginRight:10}} onPress={handleChatClick}>
                        <TonicText>Chat</TonicText>
                    </ChatButton>
                </Flex>
            </View>
        </Container>
    )
}

const styles = StyleSheet.create({

    slide: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "transparent",
    },

    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },

    dot: {
        backgroundColor: "rgba(255,255,255,.5)",
        width: 7,
        height: 7,
        borderRadius: 4,
        marginLeft: 3,
        marginRight: 3,
        marginTop: 3,
        marginBottom: 3,
    },

    activeDot: {
        backgroundColor: "#FFF",
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: 3,
        marginRight: 3,
        marginTop: 3,
        marginBottom: 3,
    },

    footerArea: {
        alignSelf: 'center',
        height: 100,
        width: "100%",
        borderRadius: 4,
        padding: 10,
        shadowColor: 'black',
        shadowRadius: 8,
        shadowOpacity: 0.07,
        backgroundColor: 'white',
    },

    contentArea: {display: 'flex', justifyContent:'center', width:"100%", padding:16,
        shadowOpacity:0.07, shadowRadius:10, shadowOffset: {width: 0, height: -15}, backgroundColor:'white' },

    priceText: {fontSize: 24, fontWeight:'800', paddingLeft:10},
    titleText: {fontSize: 24, fontWeight: '800'},
    userNameText: {fontSize: 16, fontWeight: '600', marginRight:8, color:theme.colors.primary},
    contentText: {fontSize: 20},
    bottomSheetPrimaryText: {fontSize: 22, fontWeight: '600', color:theme.colors.primary, margin:15},
    bottomSheetAlertText: {fontSize: 22, fontWeight: '600', color:theme.colors.alert, margin:15}
});


const Container = styled.View`
  ${flexCenter};
  background-color: #fff;
  align-items: center;
  justify-content: center;
`;


const ChatButton = styled.Pressable`
    ${TonicButton};
    width: 70px;
    height: 50px;
    border-radius: 8px;
`;

const TonicText = styled.Text`
    color: ${theme.colors.white};
    font-size: 18px;
    font-weight: 600;
`;
