import React, {useContext, useEffect, useLayoutEffect, useState} from 'react'
import {Text, TouchableOpacity, View, Button} from 'react-native'
import {Center, FlatList, Input, Icon, Divider} from "native-base";
import styled from "styled-components/native";
// util
import {flexCenter, TonicButton} from "../utils/styleComponents";
import {DBCollectionType, NavigatorType, PageMode, windowHeight, windowWidth} from "../utils/utils";
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
    const [refreshing, setRefreshing] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle:'',
            headerLeft: () => <HeaderLeftLogo/>,
            headerRight: () => <SearchIcon callback={() => {navigation.navigate(NavigatorType.SEARCH)}}/>,
        });
    }, [navigation]);

    useEffect(() => {
        if (postDataList.length === 0) {
            LoadAndSetAllPostDataFromDB();
        }
    }, []);


/* ------------------
       Handlers
 -------------------*/
    function handleContentClick(data) {
        navigation.navigate(NavigatorType.CONTENT_DETAIL, {data: data})
    }

    function handleCreateButtonClick() {
        navigation.navigate(NavigatorType.POSTING, {mode: PageMode.CREATE});
    }

    function handleRefresh() {
        setRefreshing(true)
        LoadAndSetAllPostDataFromDB();
    }

    function LoadAndSetAllPostDataFromDB() {
        getDocs(collection(db, DBCollectionType.POSTS)).then((querySnapshot) => {
            let dataList = [];
            querySnapshot.forEach((doc) => {
                let data = doc.data();
                data["docId"] = doc.id;
                console.log(data);
                dataList.push(data);
            });
            setPostDataList(dataList);
            setRefreshing(false);
        }).catch((err) => {
            console.log(err);
        });
    }

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
                                <Post onClickHandler={() => handleContentClick(data.item)} key={data.id} data={data.item}/>
                            </View>
                            <Divider/>
                        </View>
                    );
                }}
                refreshing={refreshing}
                onRefresh={handleRefresh}
            />
        </Center>
    )

    const MainView = !user ? LoadingView : ContentView

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
