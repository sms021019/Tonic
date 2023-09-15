import React, {useLayoutEffect} from 'react'
import {SafeAreaView} from 'react-native'
import styled from "styled-components/native";
import {flexCenter} from "../utils/styleComponents";
import SearchBar from '../components/SearchBar'
import theme from '../utils/theme'

import {Flex} from "native-base";
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
