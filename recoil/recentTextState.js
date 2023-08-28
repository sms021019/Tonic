// import { collection, onSnapshot, query } from "firebase/firestore";
// import { atom, selector } from "recoil";
// import { db } from "../firebase";
// import { DBCollectionType } from "../utils/utils";


// export const recentTextState = atom({
//     key: 'recentTextState',
//     default: selector({
//         key: 'recentTextState/Default',
//         get: async () => {
//             return await asyncGetRecentText();
//         },
//     }),
//     effects: [
//         ({setSelf}) => {

//             const user = get(userAtom); //needs to be updated
//             const chatroomHeaderRef = collection(db, DBCollectionType.USERS, user.email, DBCollectionType.CHATROOMHEADERS);
            
//             const q = query(chatroomHeaderRef);

//             const unsubscribe = onSnapshot(q, (snapshot) => {
//                 snapshot.docChanges().forEach((change) => {
//                     if(change.type === 'added') {
//                         setSelf((prev) => [change.doc.data().id, ...prev]);
//                     }

//                     if(change.type === 'removed') {
//                         setSelf((prev) => prev.filter((elm) => elm !== change.doc.data().id));
//                     }
//                 });
//             });

//             return unsubscribe;

//         }
//     ]
// });

// async function asyncGetRecentText() {
//     const 
// }