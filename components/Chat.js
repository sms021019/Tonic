import React, {useContext, useEffect, useLayoutEffect, useState} from "react";
import GlobalContext from "../context/Context";
import {
    Pressable,
    Text,
    Box,
    HStack,
    Spacer,
    Flex,
    Badge,
    Center,
    NativeBaseProvider,
    VStack,
    Image,
    Divider,
    Avatar
} from "native-base";
import {windowWidth} from "../utils/utils";
import theme from '../utils/theme'
import {TouchableOpacity, View} from "react-native";
import ChatroomModel from "../models/ChatroomModel";
import TimeHelper from "../helpers/TimeHelper";
import DBHelper from "../helpers/DBHelper";

export default function Chat(props) {
    const { user, gUserModel } = useContext(GlobalContext);
    const [recentText, setRecentText] = useState(null);
    const [photoURL, setPhotoURL] = useState(null);
    
    const [opponentUsername, setOpponentUsername] = useState();

    if (props.model === null) {
        return (
            <View> no model data </View>
        )
    }


    const chatroomModel = props.model;
    const index = props.index;
    const chatroomModelList = props.modelList;

    useEffect(() => {
        if( ChatroomModel.getRecentText(chatroomModel, setRecentText, index, chatroomModelList) === false){
            //TO DO
            console.log("Error when getting a recent text")
            return;
        }            
        
        setOpponentUsername((user.email === chatroomModel.owner.email ? chatroomModel.customer.username : chatroomModel.owner.username));
    },[])

    // useEffect(() => {
    //     if(!opponentUsername) return;
    //     if(DBHelper.)
    // })


    function handlePostClick() {
        props.onClickHandler();
    }

    return (
        <Box>
            <TouchableOpacity onPress={handlePostClick}>
                <Box borderBottomWidth="1" _dark={{
                        borderColor: "muted.50"
                    }} borderColor="muted.800" pl={["0", "4"]} pr={["0", "5"]} py="2" m='2'>
                        <HStack space={[2, 3]} justifyContent="space-between">
                            <Avatar size="48px" source={gUserModel.model.profileImageUrl} />
                            <VStack>
                                <Text _dark={{
                                    color: "warmGray.50"
                                }} color="coolGray.800" bold>
                                    {opponentUsername}
                                </Text>
                                <Text color="coolGray.600" _dark={{
                                    color: "warmGray.200"
                                }}>
                                    {recentText?.text.length >= 16 ? recentText?.text.substr(0,16)+"..." : recentText?.text}
                                </Text>
                            </VStack>
                            <Spacer />
                            <Text fontSize="xs" _dark={{
                                color: "warmGray.50"
                            }} color="coolGray.800" alignSelf="flex-start">
                                {recentText ? `${TimeHelper.getTopElapsedStringUntilNow(recentText.createdAt?.toDate())} ago` : ``}
                            </Text>
                        </HStack>
                    </Box>
            </TouchableOpacity>
        </Box>
    );
}