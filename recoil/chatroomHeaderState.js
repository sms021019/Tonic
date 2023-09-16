import {onSnapshot, query} from "firebase/firestore";
import {atomFamily, selectorFamily} from "recoil";
import ChatroomHeaderController from "../typeControllers/ChatroomHeaderController";
import {thisUser} from "./userState";
import UserController from "../typeControllers/UserController";


export const chatroomHeaderAtom = atomFamily({
    key: 'chatroomHeaderAtom',
    default: selectorFamily({
        key: 'chatroomHeaderAtom/Default',
        get: ({email, id}) => async () => {
            return await ChatroomHeaderController.asyncGetChatroomHeaderByEmailAndId(email, id);
        }
    }),
});

export const chatroomHeadersAtomByEmail = atomFamily({
    key: 'chatroomHeaderAtomFamily',
    default: selectorFamily({
        key: 'chatroomHeaderIdsSelectorFamily/email',
        get: (userEmail) => async () => {
            return await ChatroomHeaderController.asyncGetChatroomHeadersByEmail(userEmail);
        }
    }),
    effects: (userEmail) => [
        ({setSelf}) => {
            const chatroomHeaderRef = ChatroomHeaderController.getChatroomHeaderRef(userEmail);
            const q = query(chatroomHeaderRef);

            const unsubscribe = onSnapshot(q, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if(change.type === 'added') {
                        setSelf((prev) => {
                            if (prev instanceof Array)
                                return [change.doc.data(), ...prev];
                            else
                                return [change.doc.data()];
                        });
                    }

                    if(change.type === 'removed') {
                        setSelf((prev) => {
                            return prev.filter((elm) => elm !== change.doc.data());
                        });
                    }
                });
            });
            return unsubscribe;
        },
    ],
})


export const safeChatroomHeaderIdsSelector = selectorFamily({
    key: "safeChatroomHeaderIdsSelector",
    get: (email) => async ({get}) => {
        const /**@type UserDoc*/ user = get(thisUser)
        if (!user) return [];

        const /**@type ChatroomHeaderDoc[]*/ chatroomHeaders = get(chatroomHeadersAtomByEmail(email));
        if (!chatroomHeaders) return [];

        const filteredHeaders = chatroomHeaders.filter((header) => UserController.isBlockedUser(user, header.opponentEmail) === false);
        if (!filteredHeaders) return [];

        return filteredHeaders.map((header) => header.docId);
    }
})

export const getOpponentUserData = atomFamily({
    key: 'chatroomHeaderAtomFamily/opponentData',
    default: selectorFamily({
        key: 'chatroomHeaderSelectorFamily/opponentData',
        get: (userEmail) => async () => {
            return await ChatroomHeaderController.asyncLoadOpponentData(userEmail);
        }
    })
})


