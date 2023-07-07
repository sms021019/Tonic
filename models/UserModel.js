import {DBCollectionType} from "../utils/utils";
import DBHelper from "../helpers/DBHelper";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";


export default class UserModel {
    constructor(username, email, password) {
        this.doc_id = null;
        this.ref = null;
        this.collectionType = DBCollectionType.USERS;

        this.username = username;
        this.email = email;
        this.password = password;
    }

    setDocId = (doc_id) => this.doc_id = doc_id;
    setRef = (ref) => this.ref = ref;
    setUsername = (username) => this.username = username;
    setPassword = (password) => this.password = password;
    setUserEmail = (email) => this.email = email;

    static async loadData(doc) {

    }

    static async loadAllData(dest) {
        let dataList = []
        let loadState = await DBHelper.loadAllData(DBCollectionType.POSTS, /* OUT */ dataList);
        if (loadState === false || dataList.length === 0) {
            return false;
        }

        for (let i = 0; i < dataList.length; i++) {
            let postModel = this.createModelByDBData(dataList[i]);
            if (postModel === null) return false;

            dest.push(postModel);
        }
        return true;
    }

    static async loadAllPostsByUser(currentUserRef, dest){
        let userData = []
        if (await DBHelper.loadDataByRef(currentUserRef, /* OUT */ userData) === false) {
            // TO DO:
            return false;
        }
        else {
            userData = userData[0];
        }

        if(userData.posts.length === 0){
            console.log("No chatrooms")
            return true;
        }

        for (let i = 0; i < userData.posts.length; i++) {
            let data = [];
            if (await DBHelper.loadDataByRef(userData.posts[i], data) === false) {
                // TO DO:
                return false;
            }
            dest.push(data[0]);
        }
        return true;


    }

    static createModelByDBData(data) {
        if (this.isLoadDataValid(data) === false) {
            console.log("Data is not valid");
            return null;
        }

        let postModel = new PostModel(data.imageDownloadUrls, data.title, data.price, data.info, data.email)
        postModel.setDocId(data.doc_id);
        postModel.setRef(data.ref);
        return postModel
    }
    async updateData() {
        if (this.isValid() === false) return false;
        if (this.ref == null) return false;

        return await DBHelper.updateData(this.ref, this.getData());
    }

    async saveData() {
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

                // const userRef = [];
                // if(await DBHelper.getCollectionRefByName(user.email, userRef) === false){
                //     // TO DO
                //     return false;
                // }else{
                //     userRef = userRef[0];
                // }

                // if(await DBHelper.updateData(userRef, {displayName: this.username}) === false){
                //     // TO DO
                //     console.log("Couldn't update a document to DB")
                //     return false;
                // }

                await updateProfile(user, {displayName: this.username}).catch(
                    (err) => {
                        console.log(err);
                        return false;
                    }
                );
                
                // await setDoc(doc(usersCollectionRef, user.email), {
                //     username: username,
                //     uid: user.uid,
                //     email: user.email,
                // });

                // const userCollection = await getDocs(collection(db, DBCollectionType.USERS));
                // userCollection.forEach((doc) => {
                //     if (doc.data().uid === user.uid) {
                //         console.log(doc.data().username)
                //     }
                // });
                console.log('Registered in with: ', user.email);
                return true;
            }).catch((e) => {
                console.log(e);
                return false;
            })
        }catch(e){
            return false;
        }

        return await DBHelper.addData(this.collectionType, this.getData());
    }

    getData() {
        return {
            title: this.title,
            price: Number(this.price),
            info: this.info,
            imageDownloadUrls: this.imageDownloadUrls,
            email: this.email,
        }
    }

    isValid() {
        return true;
    }

    static isLoadDataValid(data) {
        if (
            data.doc_id === null ||
            data.imageDownloadUrls === null ||
            data.title === null ||
            data.price === null ||
            data.info === null ||
            data.email === null
        ) {
            return false;
        }
        else {
            return true;
        }
    }
}
