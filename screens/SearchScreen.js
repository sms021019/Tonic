import React, {useLayoutEffect} from 'react'
import {SafeAreaView} from 'react-native'
import styled from "styled-components/native";
import {flexCenter} from "../utils/styleComponents";
import SearchBar from '../components/SearchBar'

import {Flex} from "native-base";
import {NavigatorType} from "../utils/utils";
import GoBackButton from "../components/GoBackButton";


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
                    <GoBackButton mr={10} callback={() => navigation.navigate(NavigatorType.HOME)}/>
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
