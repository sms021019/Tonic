import {windowWidth} from "../utils/utils";
import {Image, StyleSheet, View} from "react-native";
import Swiper from "react-native-swiper";
import React from "react";


export default function ImageSwiper({imageModels}) {

    return (
        <Swiper
            height={windowWidth}
            dot={<View style={styles.dot} />}
            activeDot={<View style={styles.activeDot} />}
            loop={false}
        >
            {imageModels.map((model, index) => (
                <View key={index}>
                    <Image style={{width: windowWidth, height: windowWidth}}
                           source={{uri: model.oDownloadUrl}}
                    />
                    {/*<LinearGradient*/}
                    {/*    // Background Linear Gradient*/}
                    {/*    colors={['rgba(0,0,0,0.1)', 'transparent']}*/}
                    {/*    start={{ x: 0, y: 0.2}}*/}
                    {/*    end={{x: 0, y: 0.3}}*/}
                    {/*    style={styles.background}*/}
                    {/*/>*/}
                </View>
            ))}
        </Swiper>
    )
}

const styles = StyleSheet.create({
    dot:                    { backgroundColor: "rgba(255,255,255,.5)", width: 7, height: 7, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,},
    activeDot:              { backgroundColor: "#FFF", width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,},
});