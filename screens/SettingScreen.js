import React, {useContext, useLayoutEffect, useState} from 'react'
import {Text, StyleSheet, View} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {Box, Center, Divider, FlatList, Flex, ScrollView} from "native-base";
import {NavigatorType, ScreenType, windowWidth} from "../utils/utils";
import theme from "../utils/theme";
import packageJson from '../package.json';
import AuthController from "../typeControllers/AuthController";
import {showQuickMessage} from "../helpers/MessageHelper";
import DeleteAccountModal from "../components/DeleteAccountModal";
import {useRecoilValue} from "recoil";
import {userAuthAtom} from "../recoil/userState";
import GlobalContext from "../context/Context";

export default function SettingScreen({navigation}) {
    const {userStateManager} = useContext(GlobalContext);
    const userAuth = useRecoilValue(userAuthAtom);
    const [deleteAccountModalOn, setDeleteAccountModalOn] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle:'Setting',
        });
    }, [navigation]);

    async function handleSignOut() {
        if (await AuthController.asyncSignOut() === false) {
            showQuickMessage("Fail to sign out. Please try again.");
        }
        else {
            userStateManager.setUserAuth(null);
            showQuickMessage("Successfully signed out.")
            navigation.navigate(NavigatorType.LOGIN);
        }
    }

    async function onDeleteAccount(password) {
        if (await userStateManager.deleteUserAccount(password) === false) {
            showQuickMessage("Fail to delete account. Please try again.");
        }
        else {
            userStateManager.resetAll();
            showQuickMessage("Account deleted successfully.");
        }
    }

    function onDeleteAccountTrigger() {
        setDeleteAccountModalOn(true);
    }

    function handleManageBlockedUserClick() {
        navigation.navigate(ScreenType.MANAGE_BLOCKED_USER);
    }

    function handleManageBlockedPostClick() {
        navigation.navigate(ScreenType.MANAGE_BLOCKED_POST);
    }

    return (
        <View style={styles.container}>
            <DeleteAccountModal state={deleteAccountModalOn} setState={setDeleteAccountModalOn} onDeleteAccount={onDeleteAccount}/>
            <ScrollView>
                <TouchableOpacity onPress={handleManageBlockedUserClick}>
                    <Box style={styles.menu}>
                        <Flex direction={'row'}>
                            <Text style={styles.menuText}>Manage blocked users</Text>
                        </Flex>
                    </Box>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleManageBlockedPostClick}>
                    <Box style={styles.menu}>
                        <Flex direction={'row'}>
                            <Text style={styles.menuText}>Manage blocked posts</Text>
                        </Flex>
                    </Box>
                </TouchableOpacity>
                <Box style={styles.menu}>
                    <Flex direction={'row'}>
                        <Text style={styles.menuText}>Version</Text>
                        <Text style={{...styles.menuTextRight, color:'gray'}}>{packageJson.version}</Text>
                    </Flex>
                </Box>
                <Divider/>
                <TouchableOpacity onPress={handleSignOut}>
                    <Box style={styles.menu}>
                        <Flex direction={'row'}>
                            <Text style={styles.menuText}>Sign Out</Text>
                        </Flex>
                    </Box>
                </TouchableOpacity>
                <TouchableOpacity onPress={onDeleteAccountTrigger}>
                    <Box style={styles.menu}>
                        <Flex direction={'row'}>
                            <Text style={styles.menuTextRed}>Delete Account</Text>
                        </Flex>
                    </Box>
                </TouchableOpacity>
                <Divider/>
                <Center mt={10} >
                    <Text style={styles.bold}>Contact</Text>
                    <Text style={styles.grayText}>tonic.cs.acc@gmail.com</Text>
                </Center>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    menu: {width: windowWidth, height: 60, justifyContent:'center', paddingLeft: 20, paddingRight: 20},
    menuText: {flex:1, fontWeight: "600", fontSize:16, color: theme.colors.text},
    menuTextRight: {flex:1, textAlign:'right', fontWeight: "600", fontSize:16, color: theme.colors.text},
    menuTextBlue: {fontWeight: "600", fontSize:16, color: theme.colors.primary},
    menuTextRed: {fontWeight: "600", fontSize:16, color: theme.colors.alert},
    bold: {fontWeight: "600"},
    grayText: {color: 'gray'},
});
