import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signInWithEmailAndPassword, signOut,
    updateProfile,
    deleteUser, sendPasswordResetEmail,
    reauthenticateWithCredential, EmailAuthProvider,
} from "firebase/auth";
import {auth} from "../firebase";
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
     * @returns {Promise<boolean>}
     */
    static async asyncCreateUserAuth(account) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, account.email, account.password);
            const userAuth = userCredential.user;
            await updateProfile(userAuth, {displayName: account.username})
            account.uid = userAuth.uid;

            return true;
        }
        catch (e) {
            if (e.code === 'auth/email-already-in-use') {
                alert("Already have an account.");
            }
            console.log(e, "Err: UserController.asyncCreateUserAuth");
            return false;
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
            const credential = EmailAuthProvider.credential(userAuth.email, password)
            await reauthenticateWithCredential(auth.currentUser, credential);
            await deleteUser(userAuth);

            return await UserController.asyncDeleteUser(userAuth.email);
        }
        catch (e) {
            console.log(e, "Err: AuthController.asyncDeleteAccount");
            return false;
        }
    }
}
