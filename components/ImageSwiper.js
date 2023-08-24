import {windowWidth} from "../utils/utils";
import {Image, StyleSheet, View} from "react-native";
import Swiper from "react-native-swiper";
import React from "react";
import {Box} from "native-base";



/**
 * @param {{
 *   postImages: PostImage[];
 * }} props
 */
export default function ImageSwiper({postImages}) {

    return (
        <Swiper
            height={windowWidth}
            dot={<Box style={styles.dot} />}
            activeDot={<Box style={styles.activeDot} />}
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
    dot:            { backgroundColor: "#ececec", width: 6, height: 6, borderRadius: 4, margin: 3, borderColor:"rgba(0,0,0,0.3)", borderWidth: 0.5},
    activeDot:      { backgroundColor: "#ffffff", width: 8, height: 8, borderRadius: 4, margin: 3, borderColor:"rgba(0,0,0,0.3)", borderWidth: 0.5},
});
