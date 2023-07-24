import React, {useState} from 'react';
import Context from './Context'
import {db} from '../firebase'
import DBHelper from "../helpers/DBHelper";
import UserModel from "../models/UserModel";

export default function ContextWrapper(props) {
    const [user, setUser] = useState(null);

    const [chatroomModelList, setChatroomModelList] = useState([]);

    const [gUserModel, setGUserModel] = useState({
        model: null,
        ready: false,
    })

    const [postModelList, setPostModelList] = useState([]);
    const [status, setStatus] = useState({
        postModelList: false,
    })
    const [events, setEvents] = useState({
        onContentChange: [],
    });


    chatroomModelList.set = (list) => {
        
        list.sort(function (x,y){
            x = x.recentText?.timestamp.toDate();
            y = y.recentText?.timestamp.toDate();
            let result = y - x;
            return result;
        })
        setChatroomModelList(list);
    }

    chatroomModelList.addOne = (model) => {
        if (model === null) return;
        setChatroomModelList((prev) => ([...prev, model]));
    }

    chatroomModelList.getOneByDocId = (id) => {
        return chatroomModelList.find((model) => model.doc_id === id);
    }

    chatroomModelList.liftChatroom = (index) => {
        let arrCopy = chatroomModelList;
        arrCopy.unshift(chatroomModelList.splice(index,1)[0]);
        setChatroomModelList(arrCopy);

    }

    chatroomModelList.sortByRecentText = () => {
        const sorted = chatroomModelList.sort(function async (x,y){
            let result = y.recentText.timestamp.toDate() - x.recentText.timestamp.toDate();
            console.log(result);
            return result;
        })
        console.log(sorted);
        setChatroomModelList(sorted);
    }


// ----------------- CURRENT USER MODEL --------------------
    gUserModel.set = (model) => {
        setGUserModel({
            model: model,
            ready: true,
        });

    }
// ----------------- POST MODEL LIST --------------------
    postModelList.set = (list) => {
        setPostModelList(list);
    }

    postModelList.addOne = (model) => {
        if (model === null) return;
        setPostModelList((prev) => ([...prev, model]));
    }

    postModelList.getOneByDocId = (id) => {
        return postModelList.find((model) => model.doc_id === id);
    }

// ----------------- EVENTS --------------------
    events.addOnContentUpdate = (callback) => {
        setEvents((prev) => ({...prev, onContentChange: [...prev.onContentChange, callback]}));
    }

    events.invokeOnContentUpdate = () => {
        events.onContentChange.forEach((func) => func());
    }

    return (
        <Context.Provider value={{user, setUser, gUserModel, events, postModelList, status, chatroomModelList}}>

            {[props.children]}
        </Context.Provider>
    )
}