import {useRecoilRefresher_UNSTABLE, useRecoilState, useRecoilValue} from "recoil";
import {thisUser, userAuthAtom} from "../recoil/userState";
import UserController from "../typeControllers/UserController";


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

    userStateManager.refreshUser = async () => {
        refreshUser();
    }

    userStateManager.refreshUserAuth = async () => {
        refreshUserAuth();
    }

    userStateManager.resetAll = () => {
        setUserAuth(null);
    }
}
