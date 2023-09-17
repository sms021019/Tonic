import {useRecoilRefresher_UNSTABLE, useRecoilState, useRecoilValue} from "recoil";
import {thisUser, userAuthAtom} from "../recoil/userState";
import UserController from "../typeControllers/UserController";
import AuthController from "../typeControllers/AuthController";
import FirebaseHelper from "../helpers/FirebaseHelper";
import ChatroomController from "../typeControllers/ChatroomController";


export default function UserStateManager({userStateManager}) {
    const [userAuth, setUserAuth] = useRecoilState(userAuthAtom);
    const refreshUserAuth = useRecoilRefresher_UNSTABLE(userAuthAtom);
    const user = useRecoilValue(thisUser);
    const refreshUser = useRecoilRefresher_UNSTABLE(thisUser);

    userStateManager.setUserAuth = (userAuth) => {
        setUserAuth(userAuth);
    }

    userStateManager.isReady = () => {
        return (userAuth && userAuth?.emailVerified && user);
    }

    userStateManager.refreshUser = () => {
        refreshUser();
    }

    userStateManager.refreshUserAuth = (userAuth) => {
        setUserAuth(userAuth);
    }

    userStateManager.resetAll = () => {
        setUserAuth(null);
    }

    // userStateManager.deleteUserAccount = async (password) => {
    //     if (await AuthController.asyncDeleteAccount(userAuth, password) === false) return false;
    //
    //     const batch = FirebaseHelper.createBatch();
    //
    //     const /**@type ChatroomDoc[] */ chatrooms = await ChatroomController.asyncGetChatroomsByEmail(userAuth.email);
    //     if (await ChatroomController.asyncBatchExitChatrooms(batch, chatrooms) === false) return false;
    //     if (await UserController.asyncBatchDeleteUser(batch, userAuth.email) === false) return false;
    //
    //     await batch.commit();
    //     return true;
    // }
}
