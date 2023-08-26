import {Center, Divider, FlatList} from "native-base";
import {View, Text, StyleSheet} from "react-native";
import Post from "./Post";
import React from "react";
import ImageModel from "../models/ImageModel";
import PostModel from "../models/PostModel";
import theme from "../utils/theme";

export default function PostList({postIds, handleClick, margin}) {

    margin = margin? margin : 10;

    return (
        <Center flex={1} px="0">
            { postIds.map((id) => (
                <View key={id}>
                    <View style={{margin: margin}}>
                        <Post onClickHandler={() => handleClick(id)} id={id}/>
                    </View>
                    <Divider/>
                </View>
            ))}
        </Center>
    )
}

const styles = StyleSheet.create({
    noPostArea: {height:'100%'},
    noPostText: {color:'gray'},
})
