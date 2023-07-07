import React, {useContext, useEffect, useLayoutEffect, useState} from 'react'
import {View, Text, TouchableOpacity, Button, StyleSheet} from 'react-native'
import styled from "styled-components/native";
import {Feather} from "@expo/vector-icons";
import {flexCenter} from "../utils/styleComponents";
import {auth, db} from '../firebase';
import { signOut } from 'firebase/auth';
import errorHandler from '../errors';
import GlobalContext from '../context/Context';
import {DBCollectionType, NavigatorType, PageMode, windowWidth} from "../utils/utils";
import {Box, Center, Divider, ScrollView} from "native-base";
import theme from "../utils/theme";
import Post from "../components/Post";
import {collection, getDocs, getDoc, doc} from "firebase/firestore";
import DBHelper from '../helpers/DBHelper';
import PostModel from '../models/PostModel';


export default function MyPage({navigation, events}) {
    const { user } = useContext(GlobalContext);
    const [postDataList, setPostDataList] = useState([]);

    const currentUserRef = doc(collection(db, DBCollectionType.USERS), user?.email);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () =>
                <TouchableOpacity onPress={() => navigation.navigate(NavigatorType.SETTING)}>
                    <Feather name={"settings"} size={24} marginRight={14} />
                </TouchableOpacity>
        });
    }, [navigation]);

    useEffect(() => {
        if (postDataList.length === 0) {
            LoadAndSetAllPostDataFromDB();
        }
    }, []);

    async function LoadAndSetAllPostDataFromDB() {
        // let counter = 0;
        // getDoc(currentUserRef).then((querySnapshot) => {
        //     let dataList = [];
        //     querySnapshot.data().posts.forEach(async (ref) => {
        //         const tempPost = await DBHelper.loadData({ref: ref});
        //         let data = tempPost;
                
        //         data["docId"] = ref.id;
        //         dataList.push(data);
        //         counter++;

                
        //         if(querySnapshot.data().posts.length === counter){
        //             setPostDataList(dataList);
        //         }
        //     });
            
        // }).catch((err) => {
        //     console.log(err);
        // });
        let postData = [];
        if (await PostModel.loadAllPostsByUser(currentUserRef, /* OUT */ postData) === false) {
            // TO DO
            return;
        }

        setPostDataList(postData);
    }

/* ------------------
       Handlers
 -------------------*/
    function handleContentClick(postModel) {
        navigation.navigate(NavigatorType.CONTENT_DETAIL, {postModel: postModel});
    }

    function handleEditProfileClick() {
        signOut(auth).then(() => {
            console.log('signed out')
        }).catch((error) => {
            console.log(error);
        })
        // navigation.navigate(NavigatorType.EDIT_PROFILE);
    }

    return (
        <Container>
            <ScrollView>
                <View>
                    <Center style={styles.profileImageBox}>
                        <Box style={styles.profileImageArea}/>

                    </Center>
                    <Center style={styles.infoBox}>
                        <Text style={styles.nameText}>
                            UserName
                        </Text>
                        <Text style={styles.emailText}>
                            {user?.email}
                        </Text>
                        <TouchableOpacity onPress={handleEditProfileClick}>
                            <Text style={styles.editText}>
                                Edit Profile
                            </Text>
                        </TouchableOpacity>
                    </Center>
                </View>
                <View style={styles.myPostView}>
                    <Box>
                        <Text style={styles.myPostHeader}>
                            My Posts
                        </Text>
                    </Box>
                    <Center>
                        {postDataList.map((data) =>
                                <View key={data.doc_id}>
                                    <View style={{margin: 20}}>
                                        {/* <Post onClickHandler={() => handleContentClick(data)}  data={data}/> */}
                                        <Post onClickHandler={() => handleContentClick(data)}  model={data}/>
                                    </View>
                                    <Divider/>
                                </View>)
                        }
                    </Center>
                </View>
            </ScrollView>
        </Container>
    )
}

/* ---------------
     Styles
 ----------------*/
const styles = StyleSheet.create({
    profileImageBox: {
        width: windowWidth,
        height: 150,
    },
    profileImageArea: {
        width: 120,
        height: 120,
        borderRadius: 100,
        backgroundColor: 'gray',
    },
    nameBox: {
        width: windowWidth,
        height: 30,
    },
    infoBox: {
        width: windowWidth,
        height: 100,
        marginBottom: 20,
    },

    nameText: {
        fontWeight: '700',
        fontSize: 20,
        margin: 7,
    },
    emailText: {
        fontWeight: '400',
        fontSize: 16,
        margin: 7,
    },
    editText: {
        fontWeight: '400',
        fontSize: 16,
        margin: 7,
        color: theme.colors.primary,
    },

    myPostView: {
        shadowColor: 'black',
        shadowRadius: 7,
        shadowOpacity: 0.04,
        shadowOffset: {width: 0, height: -7},
        backgroundColor: 'white',
    },

    myPostHeader: {
        fontWeight: '600',
        fontSize: 20,
        marginTop: 20,
        marginLeft: 20,
        marginBottom: 10,
    }
})


const Container = styled.View`
    ${flexCenter};
    background-color: #fff;
    align-items: center;
    justify-content: center;
`;
