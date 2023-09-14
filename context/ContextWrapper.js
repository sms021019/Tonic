import React, {useEffect, useState} from 'react';
import Context from './Context'
import PostStateManager from "./PostStateManager";
import UserStateManager from "./UserStateManager";
import {atomTest, globalFunctionTest} from "../recoil/userState";
import {useRecoilState, useSetRecoilState} from "recoil";
import {authTaskManagerAtom} from "../recoil/taskManager";
import AuthController from "../typeControllers/AuthController";

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
