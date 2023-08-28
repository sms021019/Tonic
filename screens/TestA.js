import React, {Suspense, useEffect} from 'react';
import {View, SafeAreaView, Text} from 'react-native';
import {windowWidth, windowHeight} from "../utils/utils";
import styled from "styled-components/native";

export default function TestA() {

    return (
        <SafeAreaView>
            <Text>123</Text>
        </SafeAreaView>
    )
}

/* ------------------
       Styles
 -------------------*/
const Container = styled.View`
  display: flex;
  flex: 1;
  background-color: #fff;
`;

const ContentArea = styled.View`
  display: flex;
  flex: 1;
  background-color: #fff;
`;

const CreateButtonArea = styled.View`
  position: absolute;
  top: ${windowHeight - 250}px;
  left: ${windowWidth - 80}px;
`
