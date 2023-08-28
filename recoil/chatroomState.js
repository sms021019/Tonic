import { atom, selector } from "recoil";
import ChatroomController from "../typeControllers/ChatroomController";

export const chatroomListAtom = atom({
    key: 'chatroomListAtom',
    default: [],
})

export const opponentUserIdState = atom({
    key: 'opponentUserIdState',
    default: 0,
});

export const oppponentUserDataState = selector({
    key: 'opponentUserDataState',
    get: async () => {
        return await ChatroomController.asyncGetPostIds();
    }
})

