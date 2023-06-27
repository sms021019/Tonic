import React, {useState} from 'react';
import Context from './Context'
import {db} from '../firebase'
import DBHelper from "../helpers/DBHelper";

export default function ContextWrapper(props) {
    const [user, setUser] = useState(null);

    return (
        <Context.Provider value={{user, setUser}}>
            {[props.children]}
        </Context.Provider>
    )
}