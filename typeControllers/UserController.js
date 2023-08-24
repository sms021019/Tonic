import {createUserWithEmailAndPassword, updateProfile} from "firebase/auth";
import {auth, db} from "../firebase";
import ImageHelper from "../helpers/ImageHelper";
import DBHelper from "../helpers/DBHelper";
import {DBCollectionType, LOG_ERROR} from "../utils/utils";
import {doc, runTransaction, writeBatch} from "firebase/firestore";
import FirebaseHelper from "../helpers/FirebaseHelper";


export default class UserController {

    static async asyncCreateUser(username, email, password) {
        try {
            const uid = await this.asyncCreateUserAuth(username, email, password);
            if (!uid) return false;

            const /**@type UserDoc*/ user = {
                uid,
                email,
                username,
                myPostIds: [],
                chatrooms: [],
                reportedUserEmails: [],
                reportedPostIds: [],
            }

            if (await FirebaseHelper.addDoc(DBCollectionType.USERS, user.email, user) === false) return false;

            return true;
        }
        catch (e) {
            console.log("Err: UserController.asyncCreateUser");
            return false;
        }
    }

    static async asyncCreateUserAuth(username, email, password) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const userAuth = userCredential.user;
            await updateProfile(userAuth, {displayName: username})

            return userAuth.uid;
        }
        catch (e) {
            console.log("Err: UserController.asyncCreateUserAuth");
            return null;
        }
    }
}
