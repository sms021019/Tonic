// React
import React, {useContext, useEffect, useLayoutEffect, useState} from 'react'
import {View, Text, TouchableOpacity, Button, StyleSheet, SafeAreaView, Image} from 'react-native'
import styled from "styled-components/native";
import {Feather, Ionicons} from "@expo/vector-icons";
import {Box, Center, Flex, ScrollView} from "native-base";
// Util
import {flexCenter} from "../utils/styleComponents";
import {NavigatorType, windowHeight, windowWidth} from "../utils/utils";
import theme from "../utils/theme";
// Firebase
import {auth, db} from '../firebase';
import { signOut } from 'firebase/auth';
// Context
import GlobalContext from '../context/Context';
// Component
import PostList from '../components/PostList';
import ErrorScreen from "./ErrorScreen";
// Model
import PostModel from '../models/PostModel';
import LoadingScreen from "./LoadingScreen";


export default function MyPage({navigation}) {
    const { gUserModel } = useContext(GlobalContext);
    const [postModelList, setPostModelList] = useState(null);
    const [pageReady, setPageReady] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () =>
                <TouchableOpacity onPress={() => navigation.navigate(NavigatorType.SETTING)}>
                    <Feather name={"settings"} size={24} marginRight={15} />
                </TouchableOpacity>
        });
    }, [navigation]);

    useEffect(() => {
        asyncLoadMyPosts().then();
    }, []);

    useEffect(() => {
        if (gUserModel && postModelList) {
            setPageReady(true);
        }
    }, [gUserModel, postModelList])

    if (pageReady === false) {
        return <LoadingScreen/>;
    }

    async function asyncLoadMyPosts() {
        let models = await PostModel.loadAllByRefs(gUserModel.model?.postRefs);
        if (models === null) return;

        setPostModelList(models);
    }

/* ------------------
       Handlers
 -------------------*/
    function handleContentClick(docId) {
        navigation.navigate(NavigatorType.CONTENT_DETAIL, {docId: docId});
    }

    function handleEditProfileClick() {
        navigation.navigate(NavigatorType.EDIT_PROFILE);
    }

/* ------------------
       Render
 -------------------*/
    return (
        <Container>
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View>
                        <Center style={styles.profileImageBox}>
                            <Image source={gUserModel.model.profileImageUrl} style={styles.profileImage}/>
                        </Center>
                        <Center style={styles.infoBox}>
                            <Text style={styles.nameText}>
                                {gUserModel.model?.username}
                            </Text>
                            <Text style={styles.emailText}>
                                {gUserModel.model?.email}
                            </Text>
                            <TouchableOpacity onPress={handleEditProfileClick}>
                                <Text style={styles.editText}>
                                    Edit Profile
                                </Text>
                            </TouchableOpacity>
                        </Center>
                    </View>
                    <View style={styles.myPostView}>
                        <Flex direction="row" justifyContent={"space-between"} alignItems={"center"}>
                            <Text style={styles.myPostHeader}>My Posts</Text>
                            <TouchableOpacity onPress={asyncLoadMyPosts}>
                                <Ionicons name={"reload"} size={24} marginRight={15} />
                            </TouchableOpacity>
                        </Flex>
                        <Center>
                            <PostList
                                modelList={postModelList}
                                handleClick={handleContentClick}
                            />
                        </Center>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </Container>
    )
}

/* ---------------
     Styles
 ----------------*/
const styles = StyleSheet.create({
    container:          { display: 'flex', justifyContent:'center', alignItems:'center', minWidth: windowWidth, backgroundColor:'white'},
    profileImageBox:    { width: windowWidth, height: 150 },
    profileImage:       { width: 120, height: 120, borderRadius: 100, borderWidth: 0.5},
    nameBox:            { width: windowWidth, height: 30 },
    infoBox:            { width: windowWidth, height: 100, marginBottom: 20 },
    nameText:           { fontWeight: '700', fontSize: 20, margin: 7 },
    emailText:          { fontWeight: '400', fontSize: 16, margin: 7 },
    editText:           { fontWeight: '400', fontSize: 16, margin: 7, color: theme.colors.primary },
    myPostView:         { shadowColor: 'black', shadowRadius: 7, shadowOpacity: 0.04, shadowOffset: { width: 0, height: -7 }, backgroundColor: 'white' },
    myPostHeader:       { fontWeight: '600', fontSize: 20, marginTop: 20, marginLeft: 20, marginBottom: 10 }
})

const Container = styled.View`
    ${flexCenter};
    background-color: #fff;
    align-items: center;
    justify-content: center;
`;
