import AnimatedLoader from "react-native-animated-loader";
import React from "react";
import {StyleSheet} from "react-native";

export default function LoadingAnimation({visible}) {
    return (
        <AnimatedLoader
            visible={visible}
            overlayColor="rgba(255,255,255,0.75)"
            animationStyle={styles.lottie}
            source={require("../assets/loading.json")}
            speed={1}
        />
    )
}


const styles = StyleSheet.create({
    lottie: {
        width: 100,
        height: 100,
    },
})
