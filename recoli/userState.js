import {atom, selector} from "recoil";


export const userAtom = atom({
    key: 'userAtom',
    default: selector({
        key: 'userAtom/Default',
        get: async () => {
            return await getUser();
        }
    })
})


async function getUser() {

}
