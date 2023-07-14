import React, {useLayoutEffect} from 'react'
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import {Box, Center, Divider, FlatList, Flex, ScrollView} from "native-base";
import {NavigatorType, windowWidth} from "../utils/utils";
import theme from "../utils/theme";

export default function ManageBlockedUserScreen({navigation}) {

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle:'Manage blocked users',
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            <ScrollView>
                <Box style={styles.menu}>
                    <Flex direction={'row'}>
                        <Text style={styles.menuText}>Yongshn220</Text>
                        <TouchableOpacity>
                            <Text style={styles.menuTextGray}>Blocked</Text>
                        </TouchableOpacity>
                    </Flex>
                </Box>
                <Divider/>
                <Box style={styles.menu}>
                    <Flex direction={'row'}>
                        <Text style={styles.menuText}>Hollys123</Text>
                        <Text style={styles.menuTextRed}>Block</Text>
                    </Flex>
                </Box>
                <Divider/>
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
    menuTextGray: {flex:1, textAlign:'right', fontWeight: "600", fontSize:16, color: theme.colors.iconGray},
    menuTextRed: {flex:1, textAlign:'right', fontWeight: "600", fontSize:16, color: theme.colors.alert},
    bold: {fontWeight: "600"},
    grayText: {color: 'gray'},
});
