import React, {useLayoutEffect, useState} from 'react'
import {View, Text, StyleSheet, Image} from 'react-native'
import styled from "styled-components/native";
import {flexCenter, TonicButton} from "../utils/styleComponents";
import {NavigatorType, windowHeight, windowWidth} from "../utils/utils";
import GoBackButton from "../components/GoBackButton";
import theme from '../utils/theme';
import {Box, Center, Divider, Flex, ScrollView, SectionList, TextArea} from "native-base";
import Swiper from "react-native-swiper";

export default function ContentDetailScreen({navigation}) {
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTransparent: true,
            headerTitle: "",
            headerLeft: () => <GoBackButton
                color={theme.colors.white}
                ml={10}
                callback={() => navigation.navigate(NavigatorType.HOME)}
            />
        });
    }, [navigation]);


    return (
        <Container>
            <ScrollView>
                <Swiper
                    height={windowWidth}
                    dot={<View style={styles.dot} />}
                    activeDot={<View style={styles.activeDot} />}
                    loop={false}
                >
                    <View>
                        <Image style={{width: windowWidth, height: windowWidth}}
                            source={require("../assets/AppStartLogo.png")}
                        />
                    </View>
                    <View>
                        <Image style={{width: windowWidth, height: windowWidth}}
                            source={require("../assets/TonicStartImage.png")}
                        />
                    </View>
                </Swiper>
                <View style={styles.contentArea}>
                    <Box w="100%" h="60px" alignItems="left" justifyContent="center">
                        <Text style={styles.titleText}>ABCDEFGHIJKLMNOPQRST</Text>
                    </Box>
                    <Flex w="100%" h="30px" mb="50px" direction="row" alignItems="center">
                        <Text style={styles.userNameText}>@Username</Text>
                        <Text style={{color:'gray'}}>1 day ago</Text>
                    </Flex>
                    <Text style={styles.contentText}>If you're looking for random paragraphs, you've come to the right place. When a random word or a random sentence isn't quite enough, the next logical step is to find a random paragraph. We created the Random Paragraph Generator with you in mind. The process is quite simple. Choose the number of random paragraphs you'd like to see and click the button. Your chosen number of paragraphs will instantly appear. </Text>
                </View>
            </ScrollView>
            <View style={styles.footerArea}>
                <Flex direction="row" alignItems='center'>
                    <Text flex="1" style={styles.priceText}>
                        $25,000
                    </Text>
                    <ChatButton style={{marginRight:10}}>
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

    contentArea: {display:'flex',  alignItems:'left', justifyContent:'center', width:"100%", padding:16, shadowOpacity:0.15, shadowRadius:10, backgroundColor:'white' },

    priceText: {fontSize: 24, fontWeight:'800', paddingLeft:10},
    titleText: {fontSize: 24, fontWeight: 800},
    userNameText: {fontSize: 16, fontWeight: 600, marginRight:8, color:theme.colors.primary},
    contentText: {fontSize: 20}
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
