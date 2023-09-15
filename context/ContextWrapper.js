import React, {useState} from 'react';
import Context from './Context'
import PostStateManager from "./PostStateManager";
import UserStateManager from "./UserStateManager";

export default function ContextWrapper(props) {
    const [postStateManager] = useState({});
    const [userStateManager] = useState({});


    return (
        <Context.Provider value={{postStateManager, userStateManager}}>
            <UserStateManager userStateManager={userStateManager}/>
            <PostStateManager postStateManager={postStateManager}/>
            {[props.children]}
        </Context.Provider>
    )
}
