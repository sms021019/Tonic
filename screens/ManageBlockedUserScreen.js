import React, {useContext, useLayoutEffect, useState} from 'react'
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import {Box, Center, Divider, Flex, ScrollView} from "native-base";
import {windowWidth} from "../utils/utils";
import theme from "../utils/theme";
import UnblockUserModal from "../components/UnblockUserModal";
import {thisUser, userAtomByEmail} from "../recoil/userState";
import {useRecoilValue} from "recoil";
import UserController from "../typeControllers/UserController";
import {showQuickMessage} from "../helpers/MessageHelper";
import GlobalContext from "../context/Context";

export default function ManageBlockedUserScreen({navigation}) {
    const /**@type {UserDoc}*/ user = useRecoilValue(thisUser);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle:'Blocked users',
        });
    }, [navigation]);


    return (
        <View style={styles.container}>
            {
                (user.reportedUserEmails.length === 0) ?
                    <Center style={{top: 300}}>
                        <Text style={{color:'gray'}}>No blocked user.</Text>
                    </Center>
                :
                <ScrollView>
                    {
                        user.reportedUserEmails.map((reportedUserEmail) => (
                            <View key={reportedUserEmail}>
                                <ReportedUser reporterEmail={user.email} reportedUserEmail={reportedUserEmail}/>
                                <Divider/>
                            </View>
                        ))
                    }
                </ScrollView>
            }
        </View>
    )
}


function ReportedUser({reporterEmail, reportedUserEmail}) {
    const {userStateManager} = useContext(GlobalContext);
    const /**@type {UserDoc}*/ reportedUser = useRecoilValue(userAtomByEmail(reportedUserEmail));
    const [unblockModalOn, setUnblockModalOn] = useState(false);

    async function asyncUnblockUser() {
        if (await UserController.asyncUnblockUser(reporterEmail, reportedUserEmail) === false) {
            showQuickMessage("Fail to unblock user. Please try again.");
        }
        else {
            showQuickMessage("Successfully unblocked the user.");
            userStateManager.refreshUser();
        }
    }

    async function onUnblockButtonClick() {
        setUnblockModalOn(true);
    }

    return (
        <View>
            <UnblockUserModal state={unblockModalOn} setState={setUnblockModalOn} username={reportedUser.username} onUnblockUser={asyncUnblockUser}/>
            <Box style={styles.menu}>
                <Flex direction={'row'}>
                    <Text style={styles.menuText}>{reportedUser.username}</Text>
                    <TouchableOpacity onPress={onUnblockButtonClick}>
                        <Text style={styles.menuTextRed}>Unblock</Text>
                    </TouchableOpacity>
                </Flex>
            </Box>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: theme.colors.white,},
    menu: {width: windowWidth, height: 60, justifyContent:'center', paddingLeft: 20, paddingRight: 20},
    menuText: {flex:1, fontWeight: "600", fontSize:16, color: theme.colors.text},
    blueText: {flex:1, textAlign:'right', fontWeight: "600", fontSize:16, color: theme.colors.primary},
    menuTextRed: {flex:1, textAlign:'right', fontWeight: "600", fontSize:16, color: theme.colors.alert},
    bold: {fontWeight: "600"},
    grayText: {color: 'gray'},
});
