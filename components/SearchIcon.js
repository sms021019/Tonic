import React from "react";
import {TouchableOpacity} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {Icon} from "native-base";

export default function SearchIcon(props) {
    let ml = props.ml? props.ml : "0";
    let mr = props.mr? props.mr : "3";
    let size = props.size? props.size : "7";
    let color = props.color? props.color : "gray.400"

    let callback = props.callback? props.callback : () => {};

    return (
        <TouchableOpacity onPress={callback}>
            <Icon
                ml= {ml}
                mr= {mr}
                size= {size}
                color= {color}
                as= { <Ionicons name="ios-search"/> }
            />
        </TouchableOpacity>
    )
}