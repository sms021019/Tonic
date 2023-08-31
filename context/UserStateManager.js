import {useRecoilState, useRecoilValue} from "recoil";
import {thisUser, userAuthAtom} from "../recoil/userState";
import UserController from "../typeControllers/UserController";


export default function UserStateManager({userStateManager}) {
    const [userAuth, setUserAuth] = useRecoilState(userAuthAtom);
    const user = useRecoilValue(thisUser);

    userStateManager.setUserAuth = (userAuth) => {
        setUserAuth(userAuth);
    }

    userStateManager.isReady = () => {
        return (userAuth && userAuth?.emailVerified && user);
    }

    userStateManager.refreshUser = async () => {
        if (!user) {
            console.log("Err: UserStateManager.refreshUser (1)");
            return false;
        }

        const userDoc = await UserController.asyncGetUser(user.email);
        if (!userDoc) {
            console.log("Err: UserStateManager.refreshUser (2)");
            return false;
        }

        setUser(userDoc);
        return true;
    }

    userStateManager.resetAll = () => {
        setUser(null);
        setUserAuth(null);
    }
}
