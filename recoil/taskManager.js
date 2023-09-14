import {atom} from "recoil";


export const authTaskManagerAtom = atom({
    key: "authTaskManagerAtom",
    default: {
        async deleteUserAccount(password){}
    }
})
