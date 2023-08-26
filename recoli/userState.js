import {atom, selector} from "recoil";


export const userAuthAtom = atom({
    key: "userAuthAtom",
    default: /**@type {User}*/ null,
})

export const userAtom = atom({
    key: 'userAtom',
    default: /**@type {UserDoc}*/ null,
})

export const userAuthEmailVerified = atom({
    key: "userAuthEmailVerified",
    default: false,
})
