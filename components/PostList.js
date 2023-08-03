import {Center, Divider, FlatList} from "native-base";
import {View, Text, StyleSheet} from "react-native";
import Post from "./Post";
import React from "react";
import ImageModel from "../models/ImageModel";
import PostModel from "../models/PostModel";
import theme from "../utils/theme";

export default function PostList(props) {
    if (props.modelList === null) return (<></>)
    if (props.modelList.length === 0) return (
        <Center style={styles.noPostArea}>
            <Text style={styles.noPostText}>No blocked posts.</Text>
        </Center>
    )
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

const styles = StyleSheet.create({
    noPostArea: {height:'100%'},
    noPostText: {color:'gray'},
})