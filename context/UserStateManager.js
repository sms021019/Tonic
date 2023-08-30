import {useRecoilState} from "recoil";
import {userAtom, userAuthAtom} from "../recoil/userState";
import UserController from "../typeControllers/UserController";


export default function UserStateManager({userStateManager}) {
    const [userAuth, setUserAuth] = useRecoilState(userAuthAtom);
    const [user, setUser] = useRecoilState(userAtom);

    userStateManager.login = async (userAuth) => {
        setUserAuth(userAuth);

        const userDoc = await UserController.asyncGetUser(userAuth.email);
        if (!userDoc) {
            console.log("Err: UserStateManager.login");
            return false;
        }

        setUser(userDoc);
        return true;
    }


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
