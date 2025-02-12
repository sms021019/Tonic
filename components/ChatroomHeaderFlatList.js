import {Box, FlatList} from "native-base";
import {View} from "react-native";
import React from "react";
import ChatroomHeader from "./ChatroomHeader";

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
                renderItem={(chatroomHeaderId) => {
                    return (
                        <View key={chatroomHeaderId.item}>
                            <View style={{margin: margin}}>
                                <ChatroomHeader
                                    onClickHandler={(chatroomId) => handleClick(chatroomId)}
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
