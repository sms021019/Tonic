import React, {useContext, useEffect, useLayoutEffect, useState} from 'react'
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import {Box, Center, Divider, Flex, ScrollView} from "native-base";
import {windowHeight, windowWidth} from "../utils/utils";
import theme from "../utils/theme";
import GlobalContext from "../context/Context";
import UserModel from "../models/UserModel";
import LoadingScreen from "./LoadingScreen";
import UnblockPostModal from "../components/UnblockPostModal";
import UnblockUserModal from "../components/UnblockUserModal";

export default function ManageBlockedUserScreen({navigation}) {
    const {gUserModel, events} = useContext(GlobalContext);
    const [userModelsWrapper, setUserModelsWrapper] = useState({
        models: [],
        ready: false,
    });
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

    if (userModelsWrapper.ready === false) {
        return <LoadingScreen/>
    }

    async function asyncLoadUserModels() {
        let userModels = [];

        for (let email of gUserModel.model.userReports) {
            userModels.push(await UserModel.loadDataById(email));
        }
        setUserModelsWrapper({models: userModels, ready: true});
    }

    async function OnUnblockUserButtonClick(model) {
        setSelectedUserModel(model);
        setUnblockModalOn(true);
    }

    async function unblockUser() {
        await gUserModel.unblockUser(selectedUserModel?.email);

        events.invokeOnContentUpdate();
        setUnblockModalOn(false);
    }

    return (
        <View style={styles.container}>
            <UnblockUserModal state={unblockModalOn} setState={setUnblockModalOn} username={selectedUserModel?.username} handleUnblockUser={unblockUser}/>
            {
                userModelsWrapper.models.length === 0 ?
                <Center minHeight={windowHeight / 2}>
                    <Text style={styles.grayText}>No blocked users.</Text>
                </Center>
                :
                <ScrollView>
                    {
                        userModelsWrapper.models.map((model) => (
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
                        ))
                    }
                </ScrollView>
            }
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
