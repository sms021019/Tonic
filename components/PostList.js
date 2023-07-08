import {Center, Divider, FlatList} from "native-base";
import {View} from "react-native";
import Post from "./Post";
import React from "react";
import ImageModel from "../models/ImageModel";
import PostModel from "../models/PostModel";

export default function PostList(props) {

    if (props.modelList === null) return (<></>)
    if (props.modelList.length === 0) {
        props.modelList.push(new PostModel(
            -1,
            null,
            ImageModel.newModel(require("../assets/AppStartLogo.png"), require("../assets/AppStartLogo.png")),
            "첫번째 게시물을 생성해보세요!",
            "첫번째 게시물을 생성해보세요!",
            "1",
            "admin@admin.com",
        ))
    }

    const handleClick = props.handleClick? props.handleClick : null;
    const margin = props.margin? props.margin : 20;
    const refreshing = props.refreshing? props.refreshing : false;
    const handleRefresh = props.handleRefresh? props.handleRefresh : null;

    return (
        <Center flex={1} px="0">
            <FlatList
                data={props.modelList}
                renderItem={(data) => {
                    return (
                        <View key={data.item._doc_id}>
                            <View style={{margin: margin}}>
                                <Post onClickHandler={() => handleClick(data.item._doc_id)} key={data.item._doc_id} model={data.item}/>
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