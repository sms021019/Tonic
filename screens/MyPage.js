// React
import React, {useLayoutEffect, useMemo} from 'react'
import {View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image} from 'react-native'
import styled from "styled-components/native";
import {Feather, Ionicons} from "@expo/vector-icons";
import {Center, Flex, ScrollView} from "native-base";
// Util
import {flexCenter} from "../utils/styleComponents";
import {NavigatorType, windowHeight, windowWidth} from "../utils/utils";
import theme from "../utils/theme";
// Component
import PostList from '../components/PostList';
import CreatePostButton from "../components/CreatePostButton";
import {useRecoilValue} from "recoil";
import {thisUser} from "../recoil/userState";
import ProfileImageHelper from "../helpers/ProfileImageHelper";


export default function MyPage({navigation}) {
    const /**@type {UserDoc}*/ user = useRecoilValue(thisUser);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () =>
                <TouchableOpacity onPress={() => navigation.navigate(NavigatorType.SETTING)}>
                    <Feather name={"settings"} size={24} marginRight={15} />
                </TouchableOpacity>
        });
    }, [navigation]);

    const userProfileUrl = useMemo(() => {
        return ProfileImageHelper.getProfileImageUrl(user.profileImageType);
    }, [user])

/* ------------------
       Handlers
 -------------------*/
    function handleContentClick(postId) {
        navigation.navigate(NavigatorType.CONTENT_DETAIL, {postId: postId});
    }

    function handleEditProfileClick() {
        navigation.navigate(NavigatorType.EDIT_PROFILE);
    }

    function handleCreatePost() {
        navigation.navigate(NavigatorType.POST_CREATE);
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
                            <Image source={userProfileUrl} style={styles.profileImage}/>
                        </Center>
                        <Center style={styles.infoBox}>
                            <Text style={styles.nameText}>
                                {user.username}
                            </Text>
                            <Text style={styles.emailText}>
                                {user.email}
                            </Text>
                            <TouchableOpacity onPress={handleEditProfileClick}>
                                <Text style={styles.editText}>
                                    Edit Profile
                                </Text>
                            </TouchableOpacity>
                        </Center>
                    </View>
                    <View style={styles.myPostView}>
                        <Text style={styles.myPostHeader}>My Posts</Text>
                        <Center>
                            {
                                (user?.myPostIds.length === 0)?
                                <Text style={{marginTop: 50, color: 'gray'}}>No post</Text>
                                :
                                <PostList
                                    postIds={user?.myPostIds}
                                    handleClick={handleContentClick}
                                />
                            }
                        </Center>
                    </View>
                </ScrollView>
            </SafeAreaView>
            <CreateButtonArea>
                <CreatePostButton onPress={handleCreatePost}/>
            </CreateButtonArea>
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


const CreateButtonArea = styled.View`
  position: absolute;
  top: ${windowHeight - 156}px;
  left: ${windowWidth - 80}px;
`
