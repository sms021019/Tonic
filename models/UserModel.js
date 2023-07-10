import {DBCollectionType} from "../utils/utils";
import DBHelper from "../helpers/DBHelper";
import { auth } from "../firebase";
import { 
    createUserWithEmailAndPassword, 
    sendPasswordResetEmail, 
    updateProfile, 
    signInWithEmailAndPassword, 
    signOut, 
    sendEmailVerification } from "firebase/auth";

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
    constructor(doc_id, ref, username, email, password, postRefs) {
        this.doc_id = doc_id;
        this.ref = ref;
        this.collectionType = DBCollectionType.USERS;

        this.username = username;
        this.email = email;
        this.password = password;
        this.postRefs = postRefs;
    }

    setDocId = (doc_id) => this.doc_id = doc_id;
    setRef = (ref) => this.ref = ref;
    setUsername = (username) => this.username = username;
    setPassword = (password) => this.password = password;
    setUserEmail = (email) => this.email = email;
    setPostRefs = (refs) => this.postRefs = refs;

    static newEmpty() {
        return new UserModel(null, null, null, null, null, []);
    }

    static newSignup(username, email, password) {
        return new UserModel(null, null, username, email, password, []);
    }

    static async loadDataByAuth(auth) {
        const ref = DBHelper.getRef(DBCollectionType.USERS, auth.email);

        let data = []
        if (await DBHelper.loadDataByRef(ref, data) === false) return null;
        data = data[0]

        return new UserModel(data.doc_id, data.ref, data.username, data.email, auth.password, /*ref[]*/ data.posts);
    }

    // static async loadAllData(dest) {
    //     let dataList = []
    //     let loadState = await DBHelper.loadAllData(DBCollectionType.POSTS, /* OUT */ dataList);
    //     if (loadState === false || dataList.length === 0) {
    //         return false;
    //     }

    //     for (let i = 0; i < dataList.length; i++) {
    //         let postModel = this.createModelByDBData(dataList[i]);
    //         if (postModel === null) return false;

    //         dest.push(postModel);
    //     }
    //     return true;
    // }

    // static async loadAllPostsByUser(currentUserRef, dest){
    //     let userData = []
    //     if (await DBHelper.loadDataByRef(currentUserRef, /* OUT */ userData) === false) {
    //         // TO DO:
    //         return false;
    //     }
    //     else {
    //         userData = userData[0];
    //     }

    //     if(userData.posts.length === 0){
    //         console.log("No chatrooms")
    //         return true;
    //     }

    //     for (let i = 0; i < userData.posts.length; i++) {
    //         let data = [];
    //         if (await DBHelper.loadDataByRef(userData.posts[i], data) === false) {
    //             // TO DO:
    //             return false;
    //         }
    //         dest.push(data[0]);
    //     }
    //     return true;


    // }

    // static createModelByDBData(data) {
    //     if (this.isLoadDataValid(data) === false) {
    //         console.log("Data is not valid");
    //         return null;
    //     }

    //     let postModel = new PostModel(data.imageDownloadUrls, data.title, data.price, data.info, data.email)
    //     postModel.setDocId(data.doc_id);
    //     postModel.setRef(data.ref);
    //     return postModel
    // }

    // async updateData() {
    //     if (this.isValid() === false) return false;
    //     if (this.ref == null) return false;

    //     return await DBHelper.updateData(this.ref, this.getData());
    // }

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
