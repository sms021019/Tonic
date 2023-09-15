import { onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { atomFamily, selectorFamily } from "recoil";
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
            const messageRef = ChatroomController.getChatroomMessageRefById(chatroomId);

            const q = query(messageRef, orderBy("createdAt", "desc"), limit(1));

            const unsubscribe = onSnapshot(q, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if(change.type === 'added') {
                        setSelf(change.doc.data());
                    }
                });
            });

            return unsubscribe;

        }
    ]
});

