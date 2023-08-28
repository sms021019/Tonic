import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {HamburgerIcon, Menu, Pressable} from "native-base";
export default function MenuButton(props)
{
    let mr = props.mr? props.mr : 5;
    let size = props.size? props.size : 6;
    let items = props.items? props.items : null;
    let color = props.color? props.color : 'white';
    let isShadow = props.shadow? props.shadow : false;
    let shadowOpacity = (isShadow)? 0.8 : 0;

    if (items === null) return (<></>);

    return (
        <Menu w="140px" trigger={triggerProps => {
            return (
                <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                    <HamburgerIcon size={6} color= {color} mr={5} style={{...styles.shadow, shadowOpacity: shadowOpacity}}/>
                </Pressable>
            );
        }}>
            {
                items.map((item) => (
                    <Menu.Item onPress={item.callback} key={item.name}>
                        <Text style={{color: item.color}}>{item.name}</Text>
                    </Menu.Item>
                ))
            }
        </Menu>
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





