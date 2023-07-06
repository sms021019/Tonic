import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Flex} from "native-base";
import Modal from "../utils/modal";
import React from "react";
import theme from "../utils/theme";


export default function DeletePostModal(props) {

    const state = props.state? props.state : false;
    const setState = props.setState? props.setState : ()=>{};
    const handleDeleteClick = props.handleDeleteClick? props.handleDeleteClick : ()=>{};

    return (
        <Modal
            visible={state}
            dismiss={() => setState(false)}
        >
            <View style={styles.modalView}>
                <Text style={styles.deleteModalText}>
                    Do you want to delete the post?
                </Text>
                <Flex direction="row" style={{marginTop: 20}}>
                    <TouchableOpacity onPress={() => setState(false)} style={{marginRight: 40}} >
                        <Text style={styles.tonicTextGray}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDeleteClick}>
                        <Text style={styles.tonicTextRed}>Delete</Text>
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
        padding: 35,

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
