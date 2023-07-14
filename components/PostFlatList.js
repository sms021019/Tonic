import {Center, Divider, FlatList} from "native-base";
import {View} from "react-native";
import Post from "./Post";
import React from "react";
import ImageModel from "../models/ImageModel";
import PostModel from "../models/PostModel";
import {ModelStatusType} from "../utils/utils";

export default function PostFlatList(props) {

    if (props.modelList === null) return (<></>)

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
                        <View key={data.item.doc_id}>
                            <View style={{margin: margin}}>
                                <Post onClickHandler={() => handleClick(data.item.doc_id)} key={data.item.doc_id} model={data.item}/>
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