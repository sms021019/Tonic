import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signInWithEmailAndPassword, signOut,
    updateProfile
} from "firebase/auth";
import {auth} from "../firebase";


export default class AuthController {

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
            console.log("Err: UserController.asyncCreateUserAuth");
            return false;
        }
    }

    static async asyncLogin(email, password) {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return true;
        }
        catch (e) {
            console.log(e, "Err: AuthController.asyncSignIn");
            return false;
        }
    }

    static async asyncVerifyEmail(userAuth) {
        try {
            await sendEmailVerification(userAuth)
            return true;
        }
        catch (e) {
            if (e.code === 'auth/too-many-requests') {
                alert("Too many requests. Try again after few minutes.")
            }
            console.log(e, "AuthController.asyncVerifyEmail");
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
}
