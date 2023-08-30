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

export const userState = selector({
    key: 'userState',
    get: async ({get}) => {
        console.log("us _1");
        const userAuth = get(userAuthAtom);
        if (!userAuth) return null;

        console.log("us _2");
        return await UserController.asyncGetUser(userAuth.email);
    }
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
