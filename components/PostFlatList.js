import {Center, Divider, FlatList} from "native-base";
import Post from "./Post";
import React from "react";
import ErrorBoundary from "react-native-error-boundary";

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
                        <ErrorBoundary FallbackComponent={ErrorPost}>
                            <Post key={postId.item} onClickHandler={() => handleClick(postId.item)} id={postId.item}/>
                        </ErrorBoundary>
                    );
                }}
                refreshing={refreshing}
                onRefresh={handleRefresh}
            />
        </Center>
    )
}


function ErrorPost() {
    return (
        <></>
    )
}
