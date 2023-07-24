import React, {useContext, useEffect, useLayoutEffect, useState} from 'react'
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import {Box, Divider, Flex, ScrollView} from "native-base";
import {windowWidth} from "../utils/utils";
import theme from "../utils/theme";
import GlobalContext from "../context/Context";
import UserModel from "../models/UserModel";
import LoadingScreen from "./LoadingScreen";
import UnblockPostModal from "../components/UnblockPostModal";
import UnblockUserModal from "../components/UnblockUserModal";

export default function ManageBlockedUserScreen({navigation}) {
    const {gUserModel, events} = useContext(GlobalContext);
    const [userModels, setUserModels] = useState([]);
    const [unblockModalOn, setUnblockModalOn] = useState(false);
    const [selectedUserModel, setSelectedUserModel] = useState(null);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle:'Blocked users',
        });
    }, [navigation]);

    useEffect(() => {
        asyncLoadUserModels().then();
    }, [gUserModel])

    async function asyncLoadUserModels() {
        let _userModels = [];

        for (let email of gUserModel.model.userReports) {
            _userModels.push(await UserModel.loadDataById(email));
        }
        setUserModels(_userModels);
    }

    async function OnUnblockUserButtonClick(model) {
        setSelectedUserModel(model);
        setUnblockModalOn(true);
    }

    async function unblockUser() {
        await gUserModel.asyncUnblockUser(selectedUserModel?.email);

        events.invokeOnContentUpdate();
        setUnblockModalOn(false);
    }

    if (userModels.length === 0) {
        return <Text> No blocked users. </Text>
    }


    return (
        <View style={styles.container}>
            <UnblockUserModal state={unblockModalOn} setState={setUnblockModalOn} username={selectedUserModel?.username} handleUnblockUser={unblockUser}/>
            <ScrollView>
                {userModels.map((model) => (
                    <>
                        <Box style={styles.menu}>
                            <Flex direction={'row'}>
                                <Text style={styles.menuText}>{model.username}</Text>
                                <TouchableOpacity onPress={() => OnUnblockUserButtonClick(model)}>
                                    <Text style={styles.menuTextRed}>Unblock</Text>
                                </TouchableOpacity>
                            </Flex>
                        </Box>
                        <Divider/>
                    </>
                ))}
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
    blueText: {flex:1, textAlign:'right', fontWeight: "600", fontSize:16, color: theme.colors.primary},
    menuTextRed: {flex:1, textAlign:'right', fontWeight: "600", fontSize:16, color: theme.colors.alert},
    bold: {fontWeight: "600"},
    grayText: {color: 'gray'},
});
