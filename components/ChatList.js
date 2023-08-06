import {Box, Center, Divider, FlatList} from "native-base";
import {View} from "react-native";
import Chat from "./Chat";
import React, { useEffect, useState } from "react";
import ChatroomModel from "../models/ChatroomModel";

export default function ChatList(props) {

    if (props.modelList === null) return (<></>)
    if (props.modelList.length === 0) {
        
    }

    // const [a, seta] = useState([])

    // useEffect(()=>{
    //     let arr = []
    //     for(let model of props.modelList)
    //     {
    //         arr.push(
    //             <View key={item.doc_id}>
    //                 <View style={{margin: margin}}>
    //                     <Chat onClickHandler={() => handleClick(item.doc_id, index)} key={item.doc_id} model={item} index = {index} modelList = {props.modelList}/>
    //                 </View>
                    
    //             </View>
    //         )
    //         seta(arr);
    //     }
    // },[])

    // SortAscendingOutlined() 
    // {
    //     let ta = a;
    //     ta.sort();
    //     seta(ta);
    // }

    const handleClick = props.handleClick? props.handleClick : null;
    const margin = props.margin? props.margin : 2;
    const refreshing = props.refreshing? props.refreshing : false;
    const handleRefresh = props.handleRefresh? props.handleRefresh : null;




    return (
        <Box flex={1} px="0">
            <FlatList
                data={props.modelList}
                renderItem={({item, index}) => {
                    return (
                        <View key={item.doc_id}>
                            <View style={{margin: margin}}>
                                <Chat onClickHandler={() => handleClick(item.doc_id, index)} key={item.doc_id} model={item} index = {index} modelList = {props.modelList}/>
                            </View>
                            
                        </View>
                    );
                }}
                refreshing={refreshing}
                onRefresh={handleRefresh}
            />
        </Box>
    )
}