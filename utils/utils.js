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
    MYPAGE:             "mypageScreen",
    POSTING:            "postingScreen",
    SEARCH:             "searchScreen",
    ERROR:              "errorScreen",
    SETTING:            "settingScreen",
    EDIT_PROFILE:       "editProfileScreen",
}

export const ModelStatusType = {
    NEW: "newModelStatus",
    LOADED: "loadedModelStatus",
}
export const DBCollectionType = {
    USERS:      "users",
    POSTS:      "postsTemp",
    MESSAGES:   "messages",
    CHATROOMS:  "chatrooms",
    IMAGE:      "images",
}

export const StorageDirectoryType = {
    POST_IMAGES: "postImages",
}

export const PageMode = {
    EDIT:     "edit",
    CREATE:   "create",
}

const palette = {
    tealGreen:          "#128c7e",
    tealGreenDark:      "#075e54",
    green:              "#25d366",
    lime:               "#dcf8c6",
    skyblue:            "#34b7f1",
    smokeWhite:         "#ece5dd",
    white:              "white",
    gray:               "#3C3C3C",
    lightGray:          "#757575",
    iconGray:           "#717171",
};

export const theme = {
    colors: {
        background:     palette.smokeWhite,
        foreground:     palette.tealGreenDark,
        primary:        palette.tealGreen,
        tertiary:       palette.lime,
        secondary:      palette.green,
        white:          palette.white,
        text:           palette.gray,
        secondaryText:  palette.lightGray,
        iconGray:       palette.iconGray,
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
