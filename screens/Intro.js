import React from "react";
import {Text, View, Image, Pressable, StyleSheet, TouchableOpacity} from "react-native";
import { flexCenter, kiwiButton } from "../utils/styleComponents";
import styled from "styled-components/native";
import { windowWidth } from "../utils/utils";
import theme from "../utils/theme";

export default function Intro({navigation}) {
  const goLogin = () => {
    navigation.push("Login");
  };

  return (
    <Container>
      <Text style={styles.head}>토닉 토닉</Text>
      <Text style={styles.content}>알뜰 살뜰 스토니 중고거래</Text>
      <Text style={styles.contentBottom}>얼른 시작해보세요!</Text>
      <StartButton onPress={goLogin}>
        <StartText>시작하기</StartText>
      </StartButton>
      <TouchableOpacity>
        <Text style={styles.tip}>이미 계정이 있나요? 로그인</Text>
      </TouchableOpacity>
    </Container>
  );
}

const styles = StyleSheet.create({
  head: {
    fontSize: 24,
    fontWeight: "700",
  },
  content: {
    fontSize: 18,
    paddingTop: 4,
    paddingBottom: 4,
  },
  contentBottom: {
    fontSize: 18,
    marginBottom: 32,
  },
  tip: {
    fontSize: 12,
    marginTop: 10,
    color: theme.colors.foreground,
  }
});

const StartButton = styled.Pressable`
  ${kiwiButton}
  width: ${windowWidth * 0.9}px;
  height: 56px;
  border-radius: 8px;
`;

const Container = styled.View`
  ${flexCenter}
  background-color: #fff;
  align-items: center;
  justify-content: center;
`;

const StartText = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: 600;
`;
