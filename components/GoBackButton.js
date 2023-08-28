import {AntDesign} from "@expo/vector-icons";
import {StyleSheet, TouchableOpacity} from "react-native";
import React from "react";

export default function GoBackButton(props) {
    const callback = props.callback? props.callback : () => {};
    const size = props.size? props.size : 30;
    const mr = props.mr? props.mr : 0;
    const ml = props.ml? props.ml : 0;
    const color = props.color? props.color : 'black';
    const shadow = props.shadow ?? false;
    const shadowOpacity = shadow? 0.8 : 0;

    return (
        <TouchableOpacity onPress={callback}>
            <AntDesign color={color} name='left' size={size} style={{...styles.shadow, shadowOpacity: shadowOpacity, marginRight: mr, marginLeft: ml}}/>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: 'gray',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 3,
    },
});
