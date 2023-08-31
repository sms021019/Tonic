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
        get: (props) => async () => {
            return await ChatroomHeaderController.asyncGetChatroomHeaderByEmailAndId(props);
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
    effects: (userEmail) => [
        ({setSelf}) => {

            const chatroomHeaderRef = ChatroomHeaderController.getChatroomHeaderRef(userEmail);
            
            const q = query(chatroomHeaderRef);

            const unsubscribe = onSnapshot(q, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if(change.type === 'added') {
                        console.log('adding');
                        setSelf((prev) => {
                            console.log("prev", prev);
                            if (prev instanceof Array) {
                                console.log("1");
                                console.log(change.doc.id);
                                return [change.doc.id, ...prev];
                            }
                            else {
                                console.log("2");
                                console.log(change.doc.id);
                                return [change.doc.id];
                            }
                        });
                    }

                    if(change.type === 'removed') { 
                        console.log("removing");
                        setSelf((prev) => {
                            console.log('prev', prev);
                            prev.filter((elm) => elm !== change.doc.id);
                        });
                    }
                });
            });
      
            return unsubscribe;
        },
    ],
});

export const getOpponentUserData = atomFamily({
    key: 'chatroomHeaderAtomFamily/opponentData',
    default: selectorFamily({
        key: 'chatroomHeaderSelectorFamily/opponentData',
        get: (userEmail) => async () => {
            return await ChatroomHeaderController.asyncLoadOpponentData(userEmail);
        }
    })
})

// export const getRecnetText = atomFamily({
//     key: 'chatroomHeaderAtomFamily/recentText',
//     default: selectorFamily({
//         key: 'chatroomHea'
//     })
// })



