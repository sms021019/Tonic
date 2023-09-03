import {atom, atomFamily, selector, selectorFamily} from "recoil";
import PostController from "../typeControllers/PostController";
import UserController from "../typeControllers/UserController";


export const userAuthAtom = atom({
    key: "userAuthAtom",
    default: /**@type {User}*/ null,
})

export const thisUser = selector({
    key: 'thisUser',
    get: async ({get, set}) => {
        const userAuth = get(userAuthAtom);
        if (!userAuth) return null;

        console.log("thisUser-Updated.")
        return /**@type {UserDoc}*/ await UserController.asyncGetUser(userAuth.email);
    },
})


export const userAtomByEmail = atomFamily({
    key: 'userAtomFamily',
    default: selectorFamily({
        key: 'postAtom/Default',
        get: (email) => async () => {
            return /**@type {UserDoc}*/ await UserController.asyncGetUser(email);
        },
    })
})
