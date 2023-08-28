import {Center, Divider, FlatList} from "native-base";
import {View, Text} from "react-native";
import Post from "./Post";
import React from "react";
import ImageModel from "../models/ImageModel";
import PostModel from "../models/PostModel";
import {ModelStatusType} from "../utils/utils";

export default function PostFlatList(props) {

    const postIds = props.postIds ?? [];
    const handleClick = props.handleClick? props.handleClick : null;
    const margin = props.margin? props.margin : 20;
    const refreshing = props.refreshing? props.refreshing : false;
    const handleRefresh = props.handleRefresh? props.handleRefresh : null;

    return (
        <Center flex={1} px="0">
            <FlatList
                data={postIds}
                renderItem={(postId) => {
                    return (
                        <View key={postId.item}>
                            <View style={{margin: margin}}>
                                <Post onClickHandler={() => handleClick(postId.item)} id={postId.item}/>
                            </View>
                            <Divider/>
                        </View>
                    );
                }}
                refreshing={refreshing}
                onRefresh={handleRefresh}
            />
        </Center>
    )
}
