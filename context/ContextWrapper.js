import React, {useState} from 'react';
import Context from './Context'
import {db} from '../firebase'
import DBHelper from "../helpers/DBHelper";

export default function ContextWrapper(props) {
    const [user, setUser] = useState(null);
    const [events, setEvents] = useState({
        onContentChange: [],
    });

    const [chatroomModelList, setChatroomModelList] = useState([]);
    const [postModelList, setPostModelList] = useState([]);
    const [status, setStatus] = useState({
        postModelList: false,
    })

    chatroomModelList.set = (list) => {
        setChatroomModelList(list);
    }

    chatroomModelList.addOne = (model) => {
        if (model === null) return;
        setChatroomModelList((prev) => ([...prev, model]));
    }

    chatroomModelList.getOneByDocId = (id) => {
        return chatroomModelList.find((model) => model.doc_id === id);
    }


    events.addOnContentUpdate = (callback) => {
        setEvents((prev) => ({...prev, onContentChange: [...prev.onContentChange, callback]}));
    }

    events.invokeOnContentUpdate = () => {
        events.onContentChange.forEach((func) => func());
    }

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

    return (
        <Context.Provider value={{user, setUser, events, postModelList, status, chatroomModelList}}>
            {[props.children]}
        </Context.Provider>
    )
}