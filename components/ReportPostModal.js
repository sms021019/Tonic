import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Flex} from "native-base";
import Modal from "../utils/modal";
import React from "react";
import theme from "../utils/theme";


export default function ReportPostModal(props) {

    const state = props.state? props.state : false;
    const setState = props.setState? props.setState : ()=>{};
    const handleReportPost = props.handleReportPost? props.handleReportPost : ()=>{};

    return (
        <Modal
            visible={state}
            dismiss={() => setState(false)}
        >
            <View style={styles.modalView}>
                <Text style={styles.deleteModalText}>
                    Do you want to report and block this post?
                </Text>
                <Flex direction="row" style={{marginTop: 20}}>
                    <TouchableOpacity onPress={() => setState(false)} style={{marginRight: 40}} >
                        <Text style={styles.tonicTextGray}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleReportPost}>
                        <Text style={styles.tonicTextRed}>Report</Text>
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
