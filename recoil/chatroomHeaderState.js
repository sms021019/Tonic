import { collection, onSnapshot, query } from "firebase/firestore";
import { atom, selector } from "recoil";
import { db } from "../firebase";
import { DBCollectionType } from "../utils/utils";
import DBHelper from "../helpers/DBHelper";


export const chatroomHeaderIdsState = atom({
    key: 'chatroomHeaderIdsState',
    default: selector({
        key: 'chatroomHeaderIdsState/Default',
        get: async () => {
            return await asyncGetChatroomHeaderIds();
        },
    }),
    effects: [
        ({setSelf}) => {

            const user = get(userAtom); //needs to be updated
            const chatroomHeaderRef = collection(db, DBCollectionType.USERS, user.email, DBCollectionType.CHATROOMHEADERS);
            
            const q = query(chatroomHeaderRef);

            const unsubscribe = onSnapshot(q, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if(change.type === 'added') {
                        setSelf((prev) => [change.doc.data().id, ...prev]);
                    }

                    if(change.type === 'removed') {
                        setSelf((prev) => prev.filter((elm) => elm !== change.doc.data().id));
                    }
                });
            });

            return unsubscribe;

        }
    ]
});

async function asyncGetChatroomHeaderIds() {
    const user = get(userAtom) // need to be updated
    const chatroomHeaderRef = collection(db, DBCollectionType.USERS, user.email, DBCollectionType.CHATROOMHEADERS);
    const userChatroomHeaderIds = await DBHelper.loadDataByQuery(chatroomHeaderRef);
    return userChatroomHeaderIds;
}