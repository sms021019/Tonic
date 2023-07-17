import React, {useContext, useEffect, useLayoutEffect, useState} from 'react';
import {View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {Box, Center, Divider, Flex, ScrollView} from "native-base";
import theme from "../utils/theme";
import {NavigatorType, PageMode, ProfileImageType, ScreenType, windowWidth} from "../utils/utils";
import styled from "styled-components/native";
import {flexCenter, TonicButtonWhite} from "../utils/styleComponents";
import GlobalContext from "../context/Context";
import {Feather} from "@expo/vector-icons";
import ImageHelper from "../helpers/ImageHelper";
import LoadingAnimation from '../components/LoadingAnimation'
import {updateProfile} from "firebase/auth";

export default function EditProfileScreen({navigation}) {
    const {user, gUserModel} = useContext(GlobalContext);
    const [username, setUsername] = useState(gUserModel.model.username);
    const [profileImageType, setProfileImageType] = useState(gUserModel.model.profileImageType);
    const [save, setSave] = useState(false);
    const [loading, setLoading] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "Edit Profile",
            headerRight: () =>
                <Button
                    onPress={() => setSave(true)}
                    title={"Save"}
                />
        });
    }, [navigation]);

    useEffect(() => {
        if (save) {
            asyncUpdateProfile();
        }
    }, [save])

    let myProfileImageUrl = ImageHelper.getProfileImageUrl(profileImageType);

    async function asyncUpdateProfile() {
        if (isProfileChanged()) {
            navigation.navigate(ScreenType.MYPAGE);
            return;
        }

        setLoading(true);

        await updateProfile(user, {displayName: username})

        gUserModel.model.username = username;
        gUserModel.model.profileImageType = profileImageType;
        await gUserModel.model.asyncUpdateProfile();

        gUserModel.commit(gUserModel.model);

        setLoading(false);
        navigation.navigate(ScreenType.MYPAGE)
    }

    function isProfileChanged() {
        return (gUserModel.model.username === username && gUserModel.model.profileImageType === profileImageType)
    }

    function selectProfileImage(type) {
        setProfileImageType(type);
    }

    return (
        <ScrollView style={styles.container}>
            <LoadingAnimation visible={loading}/>
            <View marginTop={10}>
                <Center style={styles.profileImageBox}>
                    <Image source={myProfileImageUrl} style={styles.profileImageBig}/>
                </Center>
                <Flex alignItems={'center'} marginRight={12} marginLeft={12}>
                    <Flex direction={'row'} m={1}>
                        <TouchableOpacity style={styles.pArea} onPress={() => selectProfileImage(ProfileImageType.A)}>
                            <Image source={require("../assets/profileImages/pi1.jpg")} style={styles.profileImageSmall}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.pArea} onPress={() => selectProfileImage(ProfileImageType.B)}>
                            <Image source={require("../assets/profileImages/pi2.jpg")} style={styles.profileImageSmall}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.pArea} onPress={() => selectProfileImage(ProfileImageType.C)}>
                            <Image source={require("../assets/profileImages/pi3.jpg")} style={styles.profileImageSmall}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.pArea} onPress={() => selectProfileImage(ProfileImageType.D)}>
                            <Image source={require("../assets/profileImages/pi4.jpg")} style={styles.profileImageSmall}/>
                        </TouchableOpacity>
                    </Flex>
                    <Flex direction={'row'} m={1}>
                        <TouchableOpacity style={styles.pArea} onPress={() => selectProfileImage(ProfileImageType.E)}>
                            <Image source={require("../assets/profileImages/pi5.jpg")} style={styles.profileImageSmall}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.pArea} onPress={() => selectProfileImage(ProfileImageType.F)}>
                            <Image source={require("../assets/profileImages/pi6.jpg")} style={styles.profileImageSmall}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.pArea} onPress={() => selectProfileImage(ProfileImageType.G)}>
                            <Image source={require("../assets/profileImages/pi7.jpg")} style={styles.profileImageSmall}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.pArea} onPress={() => selectProfileImage(ProfileImageType.H)}>
                            <Image source={require("../assets/profileImages/pi8.jpg")} style={styles.profileImageSmall}/>
                        </TouchableOpacity>
                    </Flex>
                </Flex>
            </View>
            <Center marginTop={12}>
                <View marginTop={5}>
                    <Text style={styles.boldText}>
                        Nickname
                    </Text>
                </View>
                <View style={styles.formContainer}>
                    <TextInput
                        placeholder="Username"
                        value={username}
                        onChangeText={setUsername}
                        style={styles.input}
                    />
                </View>
            </Center>
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    container: {
        minWidth: windowWidth,
        backgroundColor: 'white'
    },
    profileImageBox: {width: windowWidth, height: 150},
    pArea: {display:'flex', flex:1, alignItems:'center', justifyContent:'center'},
    profileImageBig: {width: 120, height: 120, borderRadius: 100, borderWidth: 0.5},
    profileImageSmall: {width: 60, height: 60, borderRadius: 100, borderWidth: 0.5},
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginBottom: 20,
    },
    formContainer: {
        width: '70%',
    },
    boldText:          { fontWeight: '700', fontSize: 16, margin: 7, color:theme.colors.text},
})
