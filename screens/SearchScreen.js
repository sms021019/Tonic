import React, {useLayoutEffect} from 'react'
import {View, Text, SafeAreaView, TouchableOpacity} from 'react-native'
import styled from "styled-components/native";
import { AntDesign } from '@expo/vector-icons';
import {flexCenter} from "../utils/styleComponents";
import SearchBar from '../components/SearchBar'
import theme from '../utils/theme'

import {Flex, Divider} from "native-base";
import {NavigatorType} from "../utils/utils";


export default function SearchScreen({navigation}) {

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false
        });
    }, [navigation]);

    return (
        <SafeAreaView style={{width:'100%', height:'100%'}}>
            <Flex>
                <Flex direction="row" alignItems="center" justifyContent="center">
                    <TouchableOpacity onPress={() => navigation.navigate(NavigatorType.HOME)}>
                        <AntDesign name='left' size={24} style={{marginRight: 10}}/>
                    </TouchableOpacity>
                    <SearchBar />
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