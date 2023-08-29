import {atom, atomFamily, selector, selectorFamily} from "recoil";
import PostController from "../typeControllers/PostController";
import UserController from "../typeControllers/UserController";


export const userAuthAtom = atom({
    key: "userAuthAtom",
    default: /**@type {User}*/ null,
})

export const userAtom = atom({
    key: 'userAtom',
    default: /**@type {UserDoc}*/ null,
})

export const userAtomByEmail = atomFamily({
    key: 'userAtomFamily',
    default: selectorFamily({
        key: 'userAtom/Default',
        get: (email) => async () => {
            return await UserController.asyncGetUser(email);
        },
    })
})
