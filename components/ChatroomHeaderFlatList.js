import {Box, Center, Divider, FlatList} from "native-base";
import {View} from "react-native";
import Chat from "./Chat";
import React, { useEffect, useState } from "react";
import ChatroomModel from "../models/ChatroomModel";

export default function ChatFlatList(props) {


    const chatroomHeaderIds = props.chatroomHeaderIds ?? [];
    const handleClick = props.handleClick? props.handleClick : null;
    const margin = props.margin? props.margin : 2;
    const refreshing = props.refreshing? props.refreshing : false;
    const handleRefresh = props.handleRefresh? props.handleRefresh : null;


    return (
        <Box flex={1} px="0">
            <FlatList
                data={chatroomHeaderIds}
                renderItem={({chatroomHeaderId}) => {
                    return (
                        <View key={chatroomHeaderId.item}>
                            <View style={{margin: margin}}>
                                <Chat 
                                    onClickHandler={() => handleClick(chatroomHeaderId.item)} 
                                    id={chatroomHeaderId.item} 
                                />
                            </View>
                        </View>
                    );
                }}
                refreshing={refreshing}
                onRefresh={handleRefresh}
            />
        </Box>
    )
}