import {atom, atomFamily, selector, selectorFamily} from "recoil";
import PostController from "../typeControllers/PostController";
import {userAtom} from "./userState";



/* ---------------
   RECOIL STATES
 ----------------*/

export const postIdsAtom = atom({
    key: 'postIdsAtom',
    default: selector({
        key: 'postIdsAtom/Default',
        get: async () => {
            return await PostController.asyncGetPostIds();
        }
    })
})

export const postAtom = atomFamily({
    key: 'postAtom',
    default: selectorFamily({
        key: 'postAtom/Default',
        get: (id) => async () => {
            return await PostController.asyncGetPost(id);
        },
    })
});
