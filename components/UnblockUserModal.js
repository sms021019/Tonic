import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Divider, Flex} from "native-base";
import Modal from "../utils/modal";
import React from "react";
import theme from "../utils/theme";


export default function UnblockUserModal(props) {
    const state = props.state ?? false;
    const setState = props.setState? props.setState : ()=>{};
    const onUnblockUser = props.onUnblockUser? props.onUnblockUser : ()=>{};

    return (
        <Modal
            visible={state}
            dismiss={() => setState(false)}
        >
            <View style={styles.modalView}>
                <Text style={styles.deleteModalText}>
                    Do you want to unblock this user?
                </Text>
                <Divider style={{marginTop: 15}}/>
                <Flex direction="row" style={{marginTop: 20}}>
                    <TouchableOpacity onPress={() => setState(false)} style={{marginRight: 40}} >
                        <Text style={styles.tonicTextGray}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onUnblockUser}>
                        <Text style={styles.tonicTextRed}>Unblock</Text>
                    </TouchableOpacity>
                </Flex>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    deleteModalText: {fontSize: 16, fontWeight: '600'},
    tonicTextGray: {fontSize: 18, fontWeight: '600', color: theme.colors.iconGray},
    tonicTextRed: {fontSize: 18, fontWeight: '600', color: theme.colors.tonicRed},
    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,

        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
})
