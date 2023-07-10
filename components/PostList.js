import {Center, Divider, FlatList} from "native-base";
import {View} from "react-native";
import Post from "./Post";
import React from "react";
import ImageModel from "../models/ImageModel";
import PostModel from "../models/PostModel";

export default function PostList(props) {
    if (props.modelList === null) return (<></>)

    const handleClick = props.handleClick? props.handleClick : null;
    const margin = props.margin? props.margin : 20;

    return (
        <Center flex={1} px="0">
            { props.modelList.map((model) => (
                <View key={model.doc_id}>
                    <View style={{margin: margin}}>
                        <Post onClickHandler={() => handleClick(model.doc_id)} key={model.doc_id} model={model}/>
                    </View>
                    <Divider/>
                </View>
            ))}
        </Center>
    )
}