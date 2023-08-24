import {atom, atomFamily, selector, selectorFamily} from "recoil";
import FirebaseHelper from '../helpers/FirebaseHelper';
import {DBCollectionType} from "../utils/utils";

/* ---------------
   RECOIL STATES
 ----------------*/

export const postIdsAtom = atom({
    key: 'postIdsAtom',
    default: selector({
        key: 'postIdsAtom/Default',
        get: async () => {
            return await getPostIds();
        }
    })
})

export const postAtom = atomFamily({
    key: 'postAtom',
    default: selectorFamily({
        key: 'postAtom/Default',
        get: (id) => async () => {
            return await getPost(id);
        },
    })
});


/* ---------------
    FUNCTIONS
 ----------------*/

async function getPostIds() {
    return await FirebaseHelper.getDocIds(DBCollectionType.POSTS);
}

async function getPost(id) {
    return await FirebaseHelper.getDocDataById(DBCollectionType.POSTS, id);
}


