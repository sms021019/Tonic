import {useRecoilState} from "recoil";
import {userAtom, userAuthAtom} from "../recoli/userState";
import UserController from "../typeControllers/UserController";


export default function UserStateManager({userStateManager}) {
    const [userAuth, setUserAuth] = useRecoilState(userAuthAtom);
    const [user, setUser] = useRecoilState(userAtom);

    userStateManager.login = async (userAuth) => {
        setUserAuth(userAuth);

        const userDoc = await UserController.asyncGetUser(userAuth.email);
        if (!userDoc) return false;

        setUser(userDoc);
        return true;
    }

    userStateManager.setUserAuth = (userAuth) => {
        setUserAuth(userAuth);
    }

    userStateManager.isReady = () => {
        return (userAuth && userAuth?.emailVerified && user);
    }

    userStateManager.refreshUser = async (email) => {
        const userDoc = await UserController.asyncGetUser(email);
        if (!userDoc) return false;

        setUser(userDoc);
        return true;
    }
}
