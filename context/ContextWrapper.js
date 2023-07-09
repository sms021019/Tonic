import React, {useState} from 'react';
import Context from './Context'
import {db} from '../firebase'
import DBHelper from "../helpers/DBHelper";

export default function ContextWrapper(props) {
    const [user, setUser] = useState(null);
    const [events, setEvents] = useState({
        onContentChange: [],
    });

    const [postModelList, setPostModelList] = useState([]);
    const [status, setStatus] = useState({
        postModelList: false,
    })


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
        <Context.Provider value={{user, setUser, events, postModelList, status}}>
            {[props.children]}
        </Context.Provider>
    )
}