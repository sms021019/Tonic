import {Center} from "native-base";
import Post from "./Post";
import React from "react";
import ErrorBoundary from "react-native-error-boundary";

export default function PostList({postIds, handleClick, filterBlockedPost}) {
    filterBlockedPost = filterBlockedPost ?? true;

    return (
        <Center flex={1} px="0">
            { postIds.map((id) => (
                <ErrorBoundary FallbackComponent={ErrorPost}>
                    <Post key={id} onClickHandler={() => handleClick(id)} id={id} filterBlockedPost={filterBlockedPost}/>
                </ErrorBoundary>
            ))}
        </Center>
    )
}

function ErrorPost() {
    return (
        <></>
    )
}

