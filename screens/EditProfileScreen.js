import React, {useContext, useEffect, useLayoutEffect, useMemo, useState} from 'react';
import {View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {Center, Flex, ScrollView} from "native-base";
import theme from "../utils/theme";
import {ProfileImageType, ScreenType, windowWidth} from "../utils/utils";
import ProfileImageHelper from "../helpers/ProfileImageHelper";
import LoadingAnimation from '../components/LoadingAnimation'
import {updateProfile} from "firebase/auth";
import {useRecoilValue} from "recoil";
import {thisUser} from "../recoil/userState";
import UserController from "../typeControllers/UserController";
import {showQuickMessage} from "../helpers/MessageHelper";
import GlobalContext from "../context/Context";

export default function EditProfileScreen({navigation}) {
    const {userStateManager} = useContext(GlobalContext);
    const /**@type {UserDoc}*/ user = useRecoilValue(thisUser);

    const [newUsername, setNewUsername] = useState(user.username);
    const [newProfileImageType, setNewProfileImageType] = useState(user.profileImageType);
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
        if (loading === false && save === true) {
            setLoading(true);
            asyncUpdateProfile().then();
        }
    }, [save])

    const selectedProfileImageUrl = useMemo(() => {
        return ProfileImageHelper.getProfileImageUrl(newProfileImageType);
    }, [newProfileImageType])

    async function asyncUpdateProfile() {
        let errorStatus = false;

        if (user.profileImageType !== newProfileImageType) {
            if (await UserController.asyncUpdateProfile(user.email, newProfileImageType) === false)
                errorStatus = true;
        }

        if (user.username !== newUsername) {
            if (await UserController.asyncUpdateUsername(user.email, newUsername) === false)
                errorStatus = true;
        }

        if (errorStatus) {
            showQuickMessage("Fail to update profile. Please try again later.");
        }
        else {
            showQuickMessage("Successfully updated profile.");
            userStateManager.refreshUser();
        }

        setLoading(false);
        navigation.navigate(ScreenType.MYPAGE)
    }

    function selectProfileImage(type) {
        setNewProfileImageType(type);
    }

    return (
        <ScrollView style={styles.container}>
            <LoadingAnimation visible={loading}/>
            <View marginTop={10}>
                <Center style={styles.profileImageBox}>
                    <Image source={selectedProfileImageUrl} style={styles.profileImageBig}/>
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
                        Username
                    </Text>
                </View>
                <View style={styles.formContainer}>
                    <TextInput
                        placeholder="Username"
                        value={newUsername}
                        onChangeText={setNewUsername}
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
