import {atom, atomFamily, selector, selectorFamily} from "recoil";
import UserController from "../typeControllers/UserController";

export const userAuthAtom = atom({
    key: "userAuthAtom",
    default: /**@type {User}*/ null,
})

export const thisUserUpdater = atom({
    key: "thisUserUpdater",
    default: 0,
})

export const thisUser = selector({
    key: 'thisUser',
    get: async ({get}) => {
        get(thisUserUpdater);

        const userAuth = get(userAuthAtom);
        if (!userAuth) return null;

        const user = await UserController.asyncGetUser(userAuth.email);
        if (!user) {
            console.log("Err: userState.thisUser");
        }
        return /**@type {UserDoc}*/ user;
    },
})


export const userAtomByEmail = atomFamily({
    key: 'userAtomFamily',
    default: selectorFamily({
        key: 'userAtom/Default',
        get: (email) => async () => {
            return /**@type {UserDoc}*/ await UserController.asyncGetUser(email);
        },
    })
})

