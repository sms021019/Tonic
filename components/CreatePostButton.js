import {TouchableOpacity} from "react-native";
import React from "react";
import styled from "styled-components/native";
import {windowHeight, windowWidth} from "../utils/utils";
import {TonicButton} from "../utils/styleComponents";

export default function CreatePostButton(props) {
    const onPress = props.onPress? props.onPress : () => {};

    return (
        <TouchableOpacity onPress={onPress}>
            <CreateButton>
                <BasicText>+</BasicText>
            </CreateButton>
        </TouchableOpacity>
    )
}

const CreateButton = styled.View`
  ${TonicButton};
  border-radius: 100px;
  width: 60px;
  height: 60px;
`;
const BasicText = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: 600;
`;