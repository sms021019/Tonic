import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { atom, atomFamily, selector, selectorFamily } from "recoil";
import { db } from "../firebase";
import { DBCollectionType } from "../utils/utils";
import recentTextController from "../typeControllers/RecentTextController";
import ChatroomController from "../typeControllers/ChatroomController";


export const recentTextState = atomFamily({
    key: 'recentTextState',
    default: selectorFamily({
        key: 'recentTextState/Default',
        get: (chatroomId) => async () => {
            return await recentTextController.asyncGetRecentText(chatroomId);
        },
    }),
    effects: (chatroomId) => [
        ({setSelf}) => {
            // const user = get(thisUser); //needs to be updated
            // const chatroomHeaderRef = collection(db, DBCollectionType.USERS, user.email, DBCollectionType.CHATROOMHEADERS);
            const messageRef = ChatroomController.getChatroomMessageRefById(chatroomId);

            const q = query(messageRef, orderBy("createdAt", "desc"), limit(1));

            const unsubscribe = onSnapshot(q, (snapshot) => {
                console.log("Callback called")
                snapshot.docChanges().forEach((change) => {
                    if(change.type === 'added') {
                        console.log('changing state')
                        setSelf(change.doc.data());
                    }
                });
            });

            return unsubscribe;

        }
    ]
});

