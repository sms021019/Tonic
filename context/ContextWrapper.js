import React, {useState} from 'react';
import Context from './Context'

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
        setChatroomModelList(list);
    }

    chatroomModelList.addOne = (model) => {
        if (model === null) return;
        setChatroomModelList((prev) => ([...prev, model]));
    }

    chatroomModelList.getOneByDocId = (id) => {
        return chatroomModelList.find((model) => model.doc_id === id);
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
        console.log(userModel.postReports);
        gUserModel.commit(userModel);
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
        events.invoke(events.onContentChange);
    }

    events.invoke = (callbacks) => {
        callbacks.forEach((func) => func());
    }

    return (
        <Context.Provider value={{user, setUser, gUserModel, events, postModelList, status, chatroomModelList}}>
            {[props.children]}
        </Context.Provider>
    )
}