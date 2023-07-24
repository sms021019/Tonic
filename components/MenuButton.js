import React from 'react';
import {Text} from 'react-native';
import {HamburgerIcon, Menu, Pressable} from "native-base";
export default function MenuButton(props)
{
    let mr = props.mr? props.mr : 5;
    let size = props.size? props.size : 6;
    let items = props.items? props.items : null;

    if (items === null) return (<></>);

    return (
        <Menu w="140px" trigger={triggerProps => {
            return (
                <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                    <HamburgerIcon size={6} color="white" mr={5}/>
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