import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Divider, Flex} from "native-base";
import Modal from "../utils/modal";
import React, {useState} from "react";
import theme from "../utils/theme";
import BouncyCheckbox from "react-native-bouncy-checkbox";

export default function DeleteAccountModal(props) {
    const [userCheckBox, setUserCheckBox] = useState(false);
    const state = props.state ?? false;
    const setState = props.setState? props.setState : ()=>{};
    const onDeleteAccount = props.onDeleteAccount? props.onDeleteAccount : ()=>{};

    return (
        <Modal
            visible={state}
            dismiss={() => setState(false)}
        >
            <View style={styles.modalView}>
                <Text style={styles.deleteModalText}>
                    Delete Account
                </Text>
                <Divider style={{margin: 10}}/>
                <View style={{width:'100%'}}>
                    <Text>By deleting your account, all posts and all works will be delete permanently.</Text>
                    <BouncyCheckbox
                        onPress={(isChecked) => setUserCheckBox(isChecked)}
                        fillColor={theme.colors.primary}
                        unfillColor={"#ffffff"}
                        text={"I confirm deleting my account"}
                        size={20}
                        style={{marginTop:20}}
                        textStyle={{ textDecorationLine: 'none'}}
                    />
                </View>
                <Flex direction="row" style={{marginTop: 20}}>
                    <TouchableOpacity onPress={() => setState(false)} style={{marginRight: 40}} >
                        <Text style={styles.tonicTextPrimary}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onDeleteAccount()} disabled={!userCheckBox}>
                        <Text style={userCheckBox? styles.tonicTextRed : styles.tonicTextGray}>Delete</Text>
                    </TouchableOpacity>
                </Flex>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    deleteModalText: {fontSize: 16, fontWeight: '600'},
    tonicTextGray: {fontSize: 18, fontWeight: '600', color: theme.colors.iconGray},
    tonicTextPrimary: {fontSize: 18, fontWeight: '600', color: theme.colors.primary},
    tonicTextRed: {fontSize: 18, fontWeight: '600', color: theme.colors.tonicRed},
    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,

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
