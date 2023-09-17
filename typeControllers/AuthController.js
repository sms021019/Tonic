import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signInWithEmailAndPassword, signOut,
    updateProfile,
    deleteUser, sendPasswordResetEmail,
    reauthenticateWithCredential, EmailAuthProvider,
} from "firebase/auth";
import {auth} from "../firebase";
import FirebaseHelper from "../helpers/FirebaseHelper";
import ChatroomController from "./ChatroomController";
import UserController from "./UserController";
export default class AuthController {

    static ErrorCode = {
        TOO_MANY_REQUEST: "tooManyRequest",
        WRONG_PASSWORD: "wrongPassword",
    }
    /**
     * It will create auth and set 'uid' to the input account.
     *
     * @param {Account} account
     */
    static async asyncCreateUserAuth(account) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, account.email, account.password);
            const userAuth = userCredential.user;
            await updateProfile(userAuth, {displayName: account.username})
            account.uid = userAuth.uid;
            return userAuth;
        }
        catch (e) {
            if (e.code === 'auth/email-already-in-use') {
                alert("Already have an account.");
            }
            console.log(e, "Err: UserController.asyncCreateUserAuth");
            return null;
        }
    }

    static async asyncLogin(email, password) {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return {status: true};
        }
        catch (e) {
            console.log(e, "Err: AuthController.asyncSignIn");
            return {status: false, errorCode: e.code};
        }
    }

    static async asyncVerifyEmail(userAuth) {
        try {
            await sendEmailVerification(userAuth)
            return true;
        }
        catch (e) {
            if (e.code === 'auth/too-many-requests') {
                alert("Too many requests. Try again later.")
            }
            console.log(e, "AuthController.asyncVerifyEmail");
            return false;
        }
    }

    static async passwordReset(email) {
        try {
            await sendPasswordResetEmail(auth, email)
            return true;
        }
        catch (e) {
            console.log(e, "Err: AuthController.passwordReset");
            return false;
        }
    }

    static async asyncSignOut() {
        try {
            await signOut(auth);
            return true;
        }
        catch (e) {
            console.log(e, "Err: AuthController.asyncSignOut");
            return false;
        }
    }

    static async asyncDeleteAccount(userAuth, password) {
        try {
            if (await this.asyncDeleteUserAuth(userAuth, password) === false) return false;

            const batch = FirebaseHelper.createBatch();

            const /**@type ChatroomDoc[] */ chatrooms = await ChatroomController.asyncGetChatroomsByEmail(userAuth.email);
            if (await ChatroomController.asyncBatchExitChatrooms(batch, chatrooms) === false) return false;
            if (await UserController.asyncBatchDeleteUser(batch, userAuth.email) === false) return false;

            await batch.commit();
            return true;
        }
        catch (e) {
        }
    }

    static async asyncDeleteUserAuth(userAuth, password) {
        try {
            const credential = EmailAuthProvider.credential(userAuth.email, password)
            await reauthenticateWithCredential(auth.currentUser, credential);
            await deleteUser(userAuth);
            return true;
        }
        catch (e) {
            if (e.code === "auth/wrong-password") {
                alert("Password is not correct.");
            }
            console.log(e, "Err: AuthController.asyncDeleteAccount");
            return false;
        }
    }


}
