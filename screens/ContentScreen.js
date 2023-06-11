import React, {useContext, useEffect, useLayoutEffect, useState} from 'react'
import {Text, TouchableOpacity, View, Button} from 'react-native'
import {Center, FlatList, Input, Icon, Divider} from "native-base";
import styled from "styled-components/native";
// util
import {flexCenter, TonicButton} from "../utils/styleComponents";
import {DBCollectionType, NavigatorType, windowHeight, windowWidth} from "../utils/utils";
// components
import Post from "../components/Post";
import HeaderLeftLogo from '../components/HeaderLeftLogo'
import SearchIcon from "../components/SearchIcon";

import {errorHandler} from '../errors';
import GlobalContext from '../context/Context';
// firebase
import {getDocs, collection} from 'firebase/firestore';
import {db} from "../firebase";

const LoadingView = <View><Text>Loading...</Text></View>

export default function ContentScreen({navigation}) {
    const {user} = useContext(GlobalContext);
    const [postDataList, setPostDataList] = useState([]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle:'',
            headerLeft: () => <HeaderLeftLogo/>,
            headerRight: () => <SearchIcon callback={() => {navigation.navigate(NavigatorType.SEARCH)}}/>,
        });
    }, [navigation]);

    useEffect(() => {
        if (postDataList.length === 0) {
            getDocs(collection(db, DBCollectionType.POSTS)).then((querySnapshot) => {
                let dataList = [];
                querySnapshot.forEach((doc) => {
                    dataList.push(doc.data());
                });
                setPostDataList(dataList);
            }).catch((err) => {
                console.log(err);
            });
        }
    }, []);

/* ------------------
      Components
 -------------------*/
    const ContentView = (
        <Center flex={1} px="0">
            <FlatList
                data={postDataList}
                renderItem={(data) => {
                    return (
                        <View>
                            <View style={{margin: 20}}>
                                <Post onClickHandler={handleContentClick} key={data.id} data={data.item}/>
                            </View>
                            <Divider/>
                        </View>
                    );
                }}
                alwaysBounceVertical={false}
            />
        </Center>
    )

    const MainView = !user ? LoadingView : ContentView

/* ------------------
       Handlers
 -------------------*/
    function handleContentClick() {
        navigation.navigate(NavigatorType.CONTENT_DETAIL)
    }

    function handleCreateButtonClick() {
        navigation.navigate(NavigatorType.POSTING);
    }

/* ------------------
      Render
-------------------*/
    return (
        <Container>
            <ContentArea>
                {MainView}
            </ContentArea>
            <CreateButtonArea>
                <TouchableOpacity
                    onPress={handleCreateButtonClick}
                >
                    <CreateButton>
                        <BasicText>+</BasicText>
                    </CreateButton>
                </TouchableOpacity>
            </CreateButtonArea>
        </Container>
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

const CreateButtonArea = styled.View`
  position: absolute;
  top: ${windowHeight - 250}px;
  left: ${windowWidth - 80}px;
`
const CreateButton = styled.View`
  ${TonicButton};
  border-radius: 100px;
  width: 60px;
  height: 60px;
`;

const ContentArea = styled.View`
  display: flex;
  flex: 1;
  background-color: #fff;
`;

const BasicText = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: 600;
`;
