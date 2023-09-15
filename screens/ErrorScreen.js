import React from 'react'
import {Text, Image, StyleSheet} from 'react-native'
import styled from "styled-components/native";
import {flexCenter} from "../utils/styleComponents";
import {windowWidth} from "../utils/utils";
import theme from "../utils/theme";

export default function ErrorScreen() {

    function redirectToSafeScreen() {
        // resetError();
    }

    return (
        <Container>
            <Image source={require("../assets/errorIcon.png")} style={{width:windowWidth*0.4, height:windowWidth*0.4}} />
            <Text style={styles.errorText}>Oops!</Text>
            <Text style={styles.errorText}>Something went wrong</Text>
            {/*<Box marginTop={100}></Box>*/}
            {/*<TouchableOpacity onPress={redirectToSafeScreen}>*/}
            {/*    <Center style={styles.redirectArea}>*/}
            {/*       <Text style={styles.redirectText}>Restart</Text>*/}
            {/*    </Center>*/}
            {/*</TouchableOpacity>*/}
        </Container>
    )
}

const Container = styled.View`
  ${flexCenter};
  background-color: #fff;
  align-items: center;
  justify-content: center;
`;


const styles = StyleSheet.create({
    errorText: {fontWeight:'400', fontSize:16, color:'gray', margin:2},
    redirectArea: {backgroundColor:theme.colors.primary, width: windowWidth*0.5, height: 40, borderRadius:50},
    redirectText: {fontWeight:'600', fontSize:16, color: '#ffffff'},
})
