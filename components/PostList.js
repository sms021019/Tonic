import {Center} from "native-base";
import Post from "./Post";
import React from "react";
import ErrorBoundary from "react-native-error-boundary";
import {View} from "react-native";

export default function PostList({postIds, handleClick, filterBlockedPost}) {
    filterBlockedPost = filterBlockedPost ?? true;

    return (
        <Center flex={1} px="0">
            { postIds.map((id) => (
                <View key={id}>
                    <ErrorBoundary FallbackComponent={ErrorPost}>
                        <Post onClickHandler={() => handleClick(id)} id={id} filterBlockedPost={filterBlockedPost}/>
                    </ErrorBoundary>
                </View>
            ))}
        </Center>
    )
}

function ErrorPost() {
    return (
        <></>
    )
}

