import React, {useLayoutEffect} from 'react'
import {Text, StyleSheet, View} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {signOut} from "firebase/auth";
import {auth} from "../firebase";
import {Box, Center, Divider, FlatList, Flex, ScrollView} from "native-base";
import {NavigatorType, ScreenType, windowWidth} from "../utils/utils";
import theme from "../utils/theme";

export default function SettingScreen({navigation}) {

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle:'Setting',
        });
    }, [navigation]);

    function handleSignOut() {
        signOut(auth).then(() => {
            console.log('signed out')
        }).catch((error) => {
            console.log(error);
        })

        navigation.navigate(NavigatorType.HOME);
    }

    function handleManageBlockedUserClick() {
        navigation.navigate(ScreenType.MANAGE_BLOCKED_USER);
    }

    function handleManageBlockedPostClick() {
        navigation.navigate(ScreenType.MANAGE_BLOCKED_POST);
    }

    return (
        <View style={styles.container}>
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
                        <Text style={styles.menuTextRight}>1.0</Text>
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
                <TouchableOpacity>
                    <Box style={styles.menu}>
                        <Flex direction={'row'}>
                            <Text style={styles.menuTextRed}>Delete Account</Text>
                        </Flex>
                    </Box>
                </TouchableOpacity>
                <Divider/>
                <Center mt={10} >
                    <Text style={styles.bold}>Contact</Text>
                    <Text style={styles.grayText}>admin@admin.com</Text>
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
