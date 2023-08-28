import {DBCollectionType, LOG_ERROR} from "../utils/utils";
import FirebaseHelper from "../helpers/FirebaseHelper";
import {arrayUnion, writeBatch} from "firebase/firestore";
import {db} from "../firebase";


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
        if (await FirebaseHelper.addDoc(DBCollectionType.USERS, user.email, user) === false) {
            console.log("Err: UserController.asyncAddUser");
            return false;
        }
        return true;
    }

    /**
     *
     * @param {string} reporterEmail
     * @param {string} targetPostId
     * @returns {Promise<boolean>}
     */
    static async asyncReportPost(reporterEmail, targetPostId) {
        if (false === await FirebaseHelper.updateDoc(DBCollectionType.USERS, reporterEmail, {reportedPostIds: arrayUnion(targetPostId)})) {
            console.log("Err: UserController.asyncReportPost");
            return false;
        }
        return true;
    }
}
