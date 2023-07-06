import React, {useState} from 'react';
import Context from './Context'
import {db} from '../firebase'
import DBHelper from "../helpers/DBHelper";

export default function ContextWrapper(props) {
    const [user, setUser] = useState(null);

    const [events, setEvents] = useState({
        onContentChange: [],
    });

    events.addOnContentUpdate = (callback) => {
        setEvents((prev) => ({...prev, onContentChange: [...prev.onContentChange, callback]}));
    }

    events.invokeOnContentUpdate = () => {
        events.onContentChange.forEach((func) => func());
    }

    return (
        <Context.Provider value={{user, setUser, events}}>
            {[props.children]}
        </Context.Provider>
    )
}