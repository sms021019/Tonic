import React, {useLayoutEffect} from 'react'
import {View, Text, SafeAreaView, TouchableOpacity} from 'react-native'
import styled from "styled-components/native";
import { AntDesign } from '@expo/vector-icons';
import {flexCenter} from "../utils/styleComponents";
import SearchBar from '../components/SearchBar'
import theme from '../utils/theme'

import {Flex, Divider} from "native-base";
import {NavigatorType, ScreenType} from "../utils/utils";
import GoBackButton from "../components/GoBackButton";
import { Icon, Button } from '@rneui/base';


export default function NewUserSearchScreen({navigation, route}) {
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "New ChatScreen User Search",
            headerLeft: () => <GoBackButton color={theme.colors.darkGray} ml={15} callback={() => navigation.goBack()}/>,
            headerRight: () => <Button type="clear" onPress={() => {}}>
                                    <Icon
                                        name='sc-telegram'
                                        type='evilicon'
                                        color='black'
                                        size={40}
                                    />
                                </Button>
        });
    }, [navigation]);

    return (
        <SafeAreaView style={{width:'100%', height:'100%'}}>
            <Flex>
                <Flex direction="row" alignItems="center" justifyContent="center">
                    <SearchBar placeholder="Search by username"/>
                </Flex>
            </Flex>
        </SafeAreaView>
    )
}

const Container = styled.View`
  ${flexCenter};
  background-color: #fff;
  align-items: center;
  justify-content: center;
`;
