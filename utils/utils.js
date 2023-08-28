import {Dimensions} from "react-native";
import React from "react";

export const NavigatorType = {
    MAIN:               "mainNavigator",
    LOGIN:              "loginNavigator",
    HOME:               "homeNavigator",
    CONTENT_DETAIL:     "contentDetailNavigator",
    POSTING:            "postingNavigator",
    START:              "startNavigator",
    SEARCH:             "searchNavigator",
    EMAIL:              "emailVerification",
    SETTING:            "settingNavigator",
    EDIT_PROFILE:       "editProfileNavigator",
    CHAT:               "chatNavigator",
}

export const ScreenType = {
    INTRO:              "introScreen",
    LOGIN:              "loginScreen",
    SIGNUP:             "signupScreen",
    EMAIL_VERIFICATION: "emailVerification",
    PASSWORD_RESET:     "passwordReset",
    CONTENT:            "contentScreen",
    CONTENT_DETAIL:     "contentDetailScreen",
    CHAT:               "chatScreen",
    CHAT_LIST:          "chatListScreen",
    CHANNEL:            "channelScreen",
    USER_SEARCH:        "userSearchScreen",
    MYPAGE:             "mypageScreen",
    POSTING:            "postingScreen",
    SEARCH:             "searchScreen",
    ERROR:              "errorScreen",
    SETTING:            "settingScreen",
    EDIT_PROFILE:       "editProfileScreen",
    MANAGE_BLOCKED_USER: "manageBlockedUserScreen",
    MANAGE_BLOCKED_POST: "manageBlockedPostScreen",
}

export const ModelStatusType = {
    NEW: "newModelStatus",
    LOADED: "loadedModelStatus",
}
export const DBCollectionType = {
    USERS:      "users",
    POSTS:      "posts",
    MESSAGES:   "messages",
    CHATROOMS:  "chatrooms",
    CHATROOMHEADERS: "chatroomHeaders",
    IMAGE:      "images",
    REPORTED_USERS: "reportedUsers",
}

export const StorageDirectoryType = {
    POST_IMAGES: "postImages",
}

export const PageMode = {
    EDIT:     "edit",
    CREATE:   "create",
}

export const ProfileImageType = {
    A: "profileImageA",
    B: "profileImageB",
    C: "profileImageC",
    D: "profileImageD",
    E: "profileImageE",
    F: "profileImageF",
    G: "profileImageG",
    H: "profileImageH",
}

export const windowWidth = Dimensions.get("window").width;
export const windowHeight = Dimensions.get("window").height;
export const IMAGE_SIZE = {
    shortCardWidth: windowWidth * 0.44,
    shortCardHeight: windowWidth * 0.34,
    itemDetailWidth: windowWidth,
    itemDetailHeight: windowHeight * 0.5,
};



export function LOG(message) {
    console.log(message);
}

export function LOG_ERROR(...message) {
    console.log("ERROR: " + message.join(' | '));
}

export function createURL(...params) {
    return params.join('/');
}

export const EMAIL_DOMAIN = "@stonybrook.edu";
