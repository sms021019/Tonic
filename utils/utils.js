import {Dimensions} from "react-native";
import React from "react";

export const NavigatorType = {
    MAIN: "mainNavigator",
    LOGIN: "LoginNavigator",
    HOME: "HomeNavigator",
    CONTENT_DETAIL: "ContentDetailNavigator",
    POSTING: "postingNavigator",
    START: "startNavigator",
    SEARCH: "searchNavigator",
}

export const ScreenType = {
    CONTENT: "contentScreen",
    CONTENT_DETAIL: "contentDetailScreen"
}

export const DBCollectionType = {
    USERS: "users",
    POSTS: "posts",
    MESSAGES: "messages",
}

export const StorageDirectoryType = {
    POST_IMAGES: "postImages",
}

const palette = {
    tealGreen: "#128c7e",
    tealGreenDark: "#075e54",
    green: "#25d366",
    lime: "#dcf8c6",
    skyblue: "#34b7f1",
    smokeWhite: "#ece5dd",
    white: "white",
    gray: "#3C3C3C",
    lightGray: "#757575",
    iconGray: "#717171",
};

export const theme = {
    colors: {
        background: palette.smokeWhite,
        foreground: palette.tealGreenDark,
        primary: palette.tealGreen,
        tertiary: palette.lime,
        secondary: palette.green,
        white: palette.white,
        text: palette.gray,
        secondaryText: palette.lightGray,
        iconGray: palette.iconGray,
    },
};

export const windowWidth = Dimensions.get("window").width;
export const windowHeight = Dimensions.get("window").height;
export const IMAGE_SIZE = {
    shortCardWidth: windowWidth * 0.44,
    shortCardHeight: windowWidth * 0.34,
    itemDetailWidth: windowWidth,
    itemDetailHeight: windowHeight * 0.5,
};
export const FIXED_FOOTER_HEIGHT = "120px";
export const FOOTER_BUTTON = windowWidth * 0.4;

export const POST_SIZE = {
    width: windowWidth * 0.9,
    height: 200,
}

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
