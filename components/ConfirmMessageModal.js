import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Flex} from "native-base";
import Modal from "../utils/modal";
import React from "react";
import theme from "../utils/theme";


export default function ConfirmMessageModal(props) {
    const state = props.state? props.state : false;
    const setState = props.setState? props.setState : ()=>{};
    const handler = props.handler? props.handler : () => {};

    function handleDismiss() {
        setState({
            state: false,
            message: "",
        })
        handler();
    }

    return (
        <Modal
            visible={state.state}
            dismiss={handleDismiss}
        >
            <View style={styles.modalView}>
                <Text style={styles.modalText}>{state.message}</Text>
                <Flex direction="row" style={{marginTop: 20}}>
                    <TouchableOpacity onPress={() => handleDismiss}>
                        <Text style={styles.tonicTextBlue}>OK</Text>
                    </TouchableOpacity>
                </Flex>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalText: {fontSize: 16, fontWeight: '500'},
    tonicTextGray: {fontSize: 18, fontWeight: '600', color: theme.colors.iconGray},
    tonicTextBlue: {fontSize: 18, fontWeight: '600', color: theme.colors.primary},
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
