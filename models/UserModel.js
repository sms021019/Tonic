import {DBCollectionType} from "../utils/utils";
import DBHelper from "../helpers/DBHelper";
import {auth, db} from "../firebase";
import { 
    createUserWithEmailAndPassword, 
    sendPasswordResetEmail, 
    updateProfile, 
    signInWithEmailAndPassword, 
    signOut, 
    sendEmailVerification } from "firebase/auth";
import ImageHelper from "../helpers/ImageHelper";
import {collection, doc} from "firebase/firestore";

/*----------DB COLLECTION STRUCT----------------
{
    chatrooms: [ref1, ref2 ...]
    posts: [ref1, ref2 ...]
    email: ""
    uid: ""
    username: ""
}
----------------------------------------------*/

export default class UserModel {
    constructor(doc_id, ref, username, email, password, postRefs, profileImageType) {
        this.doc_id = doc_id;
        this.ref = ref;
        this.collectionType = DBCollectionType.USERS;

        this.username = username;
        this.email = email;
        this.password = password;
        this.postRefs = postRefs;
        this.profileImageType = profileImageType;
        this.profileImageUrl = ImageHelper.getProfileImageUrl(this.profileImageType);
    }

    copy() {
        return new UserModel(this.doc_id, this.ref, this.username, this.email, this.password, this.postRefs, this.profileImageType);
    }

    static newEmpty() {
        return new UserModel(null, null, null, null, null, [], ImageHelper.getRandomProfileImageType());
    }

    static newSignup(username, email, password) {
        return new UserModel(null, null, username, email, password, [], ImageHelper.getRandomProfileImageType());
    }

    static async loadDataByAuth(auth) {
        const ref = DBHelper.getRef(DBCollectionType.USERS, auth.email);

        let data = []
        if (await DBHelper.loadDataByRef(ref, data) === false) return null;
        data = data[0]

        let model = new UserModel(data.doc_id, data.ref, data.username, data.email, auth.password, /*ref[]*/ data.posts, data.profileImageType);

        console.log(data.profileImageType);
        if (model.profileImageType === undefined || model.profileImageType === null) {
            console.log("Set new pi")
            model.profileImageType = ImageHelper.getRandomProfileImageType();
            model.asyncUpdateProfile().then();
        }
        console.log("loadDataByAuth");
        return model;
    }

    async asyncUpdateProfile() {
        if (await DBHelper.updateData(this.ref, {profileImageType: this.profileImageType}) === false) return false;
        return true;
    }

    async asyncCreateUser() {
        if (this.isValid() === false) return false;
        try{
            createUserWithEmailAndPassword(auth, this.email, this.password)
            .then(async userCredentials => {
                const user = userCredentials.user;
                const userData = {
                    username: this.username,
                    uid: user.uid,
                    email: user.email,
                }
         
                if(await DBHelper.addData(this.collectionType, userData) === false){
                    // TO DO
                    console.log("Couldn't add a document to DB")
                    return false;
                }

                await updateProfile(user, {displayName: this.username}).catch(
                    (err) => {
                        console.log(err);
                        return false;
                    }
                );
                
                console.log('Registered in with: ', user.email);
                return true;
            }).catch((e) => {
                console.log(e);
                return false;
            })
        }catch(e){
            console.log(e);
            return false;
        }
    }

    static passwordReset(email) {
        sendPasswordResetEmail(auth, email)
        .then(() => {
            // Password reset email sent!
            return true;
        })
        .catch(error => {
            // TO DO 여기서 에러 메세지를 받음 (error)
            console.log(error);
            return false;
        })
    }

    static async asyncEmailVerify(user) {
        const verifyResult = sendEmailVerification(user)
        .then( () => {
            return true;
        })
        .catch(error => {
            // TO DO
            console.log(error);
            return false;
        });
        return verifyResult;
    }

    static async asyncLogin(email, password) {
        const loginResult = signInWithEmailAndPassword(auth, email, password)
            .then(userCredentials => {
                const user = userCredentials.user;
                console.log('Logged in with: ', user.email);
                return true;
            })
            .catch(error => {
                console.log(error);
                return false;
            })
        return loginResult;
    }

    static async asyncSignOut() {
        const signOutResult = signOut(auth)
        .then(() => {
            console.log(`logged out`);
            return true;
        })
        .catch(error => {
            // TO DO
            console.log(error);
            return false;
        })
        return signOutResult;
    }

    getData() {
        return {
            username : this.username,
            email : this.email,
            password : this.password,
        }
    }

    isValid() {
        return true;
    }

    static isLoadDataValid(data) {
        if (
            data.doc_id === null ||
            data.username === null ||
            data.email === null ||
            data.password === null
        ) {
            return false;
        }
        else {
            return true;
        }
    }
}
