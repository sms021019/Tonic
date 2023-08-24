import {windowWidth} from "../utils/utils";
import {Image, StyleSheet, View} from "react-native";
import Swiper from "react-native-swiper";
import React from "react";
import {LinearGradient} from "expo-linear-gradient";


/**
 * @param {{
 *   postImages: PostImage[];
 * }} props
 */
export default function ImageSwiper({postImages}) {

    return (
        <Swiper
            height={windowWidth}
            dot={<View style={{...styles.dot, ...styles.shadow}} />}
            activeDot={<View style={{...styles.activeDot, ...styles.shadow}} />}
            loop={false}
        >
            {postImages.map((postImage, index) => (
                <View key={index}>
                    <Image style={{width: windowWidth, height: windowWidth}}
                           source={{uri: postImage.downloadUrlMid}}
                    />
                </View>
            ))}
        </Swiper>
    )
}

const styles = StyleSheet.create({
    dot:            { backgroundColor: "rgba(255,255,255,.8)", width: 7, height: 7, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,},
    activeDot:      { backgroundColor: "#FFF", width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,},
    shadow: {
        shadowColor: 'gray',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 3,
    },
});
