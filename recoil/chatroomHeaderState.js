import { collection, onSnapshot, query } from "firebase/firestore";
import { atom, atomFamily, selector, selectorFamily } from "recoil";
import { db } from "../firebase";
import { DBCollectionType } from "../utils/utils";
import DBHelper from "../helpers/DBHelper";
import { userAtom } from "./userState";
import FirebaseHelper from "../helpers/FirebaseHelper";
import ChatroomHeaderController from "../typeControllers/ChatroomHeaderController";



export const chatroomHeaderIdsState = atom({
    key: 'chatroomHeaderIdsState',
    default: selector({
        key: 'chatroomHeaderIdsState/Default',
        get: async () => {
            return await ChatroomHeaderController.asyncGetChatroomHeaderIds();
        },
    }),
    // effects: [
    //     ({setSelf}) => {

    //         const chatroomHeaderRef = ChatroomHeaderController.getChatroomHeaderRef;
            
    //         const q = query(chatroomHeaderRef);

    //         const unsubscribe = onSnapshot(q, (snapshot) => {
    //             snapshot.docChanges().forEach((change) => {
    //                 if(change.type === 'added') {
    //                     setSelf((prev) => [change.doc.data().id, ...prev]);
    //                 }

    //                 if(change.type === 'removed') {
    //                     setSelf((prev) => prev.filter((elm) => elm !== change.doc.data().id));
    //                 }
    //             });
    //         });
      
    //         return unsubscribe;
    //     },
    // ],
});

export const chatroomHeaderAtom = atomFamily({
    key: 'chatroomHeaderAtom',
    default: selectorFamily({
        key: 'chatroomHeaderAtom/Default',
        get: (id) => async () => {
            return await ChatroomHeaderController.asyncGetChatroomHeader(id);
        }
    })
})




