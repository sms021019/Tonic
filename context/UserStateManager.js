import {useRecoilState} from "recoil";
import {userAtom, userAuthAtom} from "../recoli/userState";
import UserController from "../typeControllers/UserController";


export default function UserStateManager({userStateManager}) {
    const [userAuth, setUserAuth] = useRecoilState(userAuthAtom);
    const [user, setUser] = useRecoilState(userAtom);

    userStateManager.login = async (userAuth) => {
        setUserAuth(userAuth);

        const user = await UserController.asyncGetUser(userAuth.email);
        if (!user) return false;

        setUser(user);
        return true;
    }

    userStateManager.setUserAuth = (userAuth) => {
        setUserAuth(userAuth);
    }
}
