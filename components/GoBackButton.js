import {AntDesign} from "@expo/vector-icons";
import {TouchableOpacity} from "react-native";
import React from "react";

export default function GoBackButton(props) {
    const callback = props.callback? props.callback : () => {};
    const size = props.size? props.size : 24;
    const mr = props.mr? props.mr : 0;
    const ml = props.ml? props.ml : 0;
    const color = props.color? props.color : 'black';
    return (
        <TouchableOpacity onPress={callback}>
            <AntDesign color={color} name='left' size={size} style={{marginRight: mr, marginLeft: ml}}/>
        </TouchableOpacity>
    )
}