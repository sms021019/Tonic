import { atom, atomFamily, selector, selectorFamily } from "recoil";
import ChatroomController from "../typeControllers/ChatroomController";
import { onSnapshot, orderBy, query } from "firebase/firestore";

export const chatroomAtom = atomFamily({
    key: 'chatroomAtom',
    default: selectorFamily({
        key: 'chatroomSelectorFamily',
        get: (chatroomId) => async() => {
            return await ChatroomController.asyncGetChatroomById(chatroomId);
        }
    }),
});

export const chatroomMessageAtom = atomFamily({
    key: 'chatroomMessageAtomFamily',
    default: selectorFamily({
        key: 'chatroomMessageSelectorFamily',
        get: (chatroomId) => async() => {
            return await ChatroomController.asyncLoadChatroomMessage(chatroomId);
        }
    }),
    effects: (chatroomId) => [
        ({setSelf}) => {
            const chatroomMessageRef = ChatroomController.getChatroomMessageRefById(chatroomId);

            const q = query(chatroomMessageRef, orderBy("createdAt", "desc"));

            const unsubscribe = onSnapshot(q, (snapshot) => {
                let messageDocs = snapshot.docs.map(doc => ({
                    _id : doc.id,
                    createdAt: doc.data().createdAt,
                    text: doc.data().text,
                    user: doc.data().user,
                }));
                messageDocs.push({
                    _id: 0,
                text: 'Please refrain from inappropriate or offensive conversations. You may face membership sanctions.',
                createdAt: new Date().getTime(),
                system: true,
                });

                setSelf(messageDocs);
            });

            return unsubscribe;
        },
    ],
});

