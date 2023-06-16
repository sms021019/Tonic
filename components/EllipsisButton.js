import {Ionicons} from "@expo/vector-icons";
import {TouchableOpacity} from "react-native";
import React from "react";

export default function EllipsisButton(props) {
    const callback = props.callback? props.callback : () => {};
    const size = props.size? props.size : 25;
    const mr = props.mr? props.mr : 0;
    const ml = props.ml? props.ml : 0;
    const color = props.color? props.color : 'white';
    return (
        <TouchableOpacity onPress={callback}>
            <Ionicons color={color} name='ellipsis-vertical' size={size} style={{marginRight: mr, marginLeft: ml}}/>
        </TouchableOpacity>
    )
}