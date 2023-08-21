import React, {useEffect, useState} from 'react';
import Context from './Context'
import PostStateManager from "./PostStateManager";

export default function ContextWrapper(props) {
    const [user, setUser] = useState(null);

    const [chatroomModelList, setChatroomModelList] = useState([]);
    const [gUserModel, setGUserModel] = useState({
        model: null,
        ready: false,
    })

    const [postStateManager, setPostStateManager] = useState({});

    const [events, setEvents] = useState({
        onContentChange: [],
    });

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

    gUserModel.commit = (model) => {
        setGUserModel({
            model: model.copy(),
            ready: true,
        })
    }

    gUserModel.updateProfile = async (username, profileImageType) => {
        let userModel = gUserModel.model;
        userModel.username = username;
        userModel.profileImageType = profileImageType;
        await userModel.asyncUpdateProfile();

        gUserModel.commit(userModel);
    }

    gUserModel.reportUser = async (targetUserEmail) => {
        let userModel = gUserModel.model;

        userModel.userReports.push(targetUserEmail);
        await userModel.asyncReportUser(targetUserEmail);

        gUserModel.commit(userModel);
    }

    gUserModel.reportPost = async (postModel) => {
        let userModel = gUserModel.model;

        await postModel.asyncReportPost(userModel.email);
        userModel.postReports.push(postModel.ref);

        gUserModel.commit(userModel);
    }

    gUserModel.unblockPost = async (postModel) => {
        let userModel = gUserModel.model;

        await postModel.asyncUnblockPost(userModel.email);
        userModel.postReports = userModel.postReports.filter((ref) => ref?.path !== postModel.ref.path);
        gUserModel.commit(userModel);
    }

    gUserModel.unblockUser = async (targetUserEmail) => {
        let userModel = gUserModel.model;

        await userModel.asyncUnblockUser(targetUserEmail);
        userModel.userReports = userModel.userReports.filter((email) => email !== targetUserEmail);
        gUserModel.commit(userModel);
    }

// ----------------- EVENTS --------------------
    events.addOnContentUpdate = (callback) => {
        setEvents((prev) => ({...prev, onContentChange: [...prev.onContentChange, callback]}));
    }

    events.invokeOnContentUpdate = () => {
        events.invoke(events.onContentChange);
    }

    events.invoke = (callbacks) => {
        callbacks.forEach((func) => func());
    }

    return (
        <Context.Provider value={{user, setUser, gUserModel, events, chatroomModelList}}>
            <PostStateManager postStateManager={postStateManager}/>
            {[props.children]}
        </Context.Provider>
    )
}
