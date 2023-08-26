import {DBCollectionType, LOG_ERROR} from "../utils/utils";
import FirebaseHelper from "../helpers/FirebaseHelper";


export default class UserController {

    static async asyncGetUser(email) {
        return /**@type {UserDoc}*/ await FirebaseHelper.getDocDataById(DBCollectionType.USERS, email);
    }

    /**
     *
     * @param {UserDoc} user
     * @returns {Promise<boolean>}
     */
    static async asyncAddUser(user) {
        try {
            return await FirebaseHelper.addDoc(DBCollectionType.USERS, user.email, user);
        }
        catch (e) {
            console.log("Err: UserController.asyncCreateUser");
            return false;
        }
    }
}
