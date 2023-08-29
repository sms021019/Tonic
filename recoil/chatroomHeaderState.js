import { collection, onSnapshot, query } from "firebase/firestore";
import { atom, atomFamily, selector, selectorFamily } from "recoil";
import { db } from "../firebase";
import { DBCollectionType } from "../utils/utils";
import DBHelper from "../helpers/DBHelper";
import { userAtom } from "./userState";
import FirebaseHelper from "../helpers/FirebaseHelper";
import ChatroomHeaderController from "../typeControllers/ChatroomHeaderController";





export const chatroomHeaderAtom = atomFamily({
    key: 'chatroomHeaderAtom',
    default: selectorFamily({
        key: 'chatroomHeaderAtom/Default',
        get: (email, id) => async () => {
            return await ChatroomHeaderController.asyncGetChatroomHeaderByEmailAndId(email, id);
        }
    }),
});

// export const chatroomHeaderAtom = atom({
//     key: 'chatroomHeaderAtom',
//     default: /**@type {ChatroomHeaderDoc} */ null,
// })

export const chatroomHeaderIdsAtomByEmail = atomFamily({
    key: 'chatroomHeaderAtomFamily',
    default: selectorFamily({
        key: 'chatroomHeaderIdsSelectorFamily/email',
        get: (userEmail) => async () => {
            return await ChatroomHeaderController.asyncGetChatroomHeaderIdsByEmail(userEmail);
        }
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
})




