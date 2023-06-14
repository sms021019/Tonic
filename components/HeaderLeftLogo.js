import React from 'react';
import {Text} from 'react-native';
export default function HeaderLeftLogo(props)
{
    let fontSize = props.size? props.size : 16;
    let fontWeight = props.fontWeight? props.fontWeight : 800;
    let ml = props.ml? props.ml : 16
    return (
        <Text style={{fontSize: fontSize, fontWeight: fontWeight, marginLeft: ml}}>
            TONIC
        </Text>
    )
}