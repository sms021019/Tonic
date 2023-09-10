// import {DBCollectionType} from "../utils/utils";
// import DBHelper from "../helpers/DBHelper";
// import {auth, db} from "../firebase";
// import {
//     createUserWithEmailAndPassword,
//     sendPasswordResetEmail,
//     updateProfile,
//     signInWithEmailAndPassword,
//     signOut,
//     sendEmailVerification } from "firebase/auth";
// import ProfileImageHelper from "../helpers/ProfileImageHelper";
// import {arrayUnion, collection, doc, writeBatch} from "firebase/firestore";
// import {arrayRemove} from "@firebase/firestore";
//
// /*----------DB COLLECTION STRUCT----------------
// {
//     chatrooms: [ref1, ref2 ...]
//     posts: [ref1, ref2 ...]
//     email: ""
//     uid: ""
//     username: ""
//     userReports: [ref]
//     postReports: [ref]
//     blocked: bool
// }
// ----------------------------------------------*/
//
// export default class UserModel {
//     constructor(doc_id, ref, username, email, password, chatroomRefs, postRefs, profileImageType, userReports, postReports, blocked, reporters, reportCount) {
//         // Document info
//         this.doc_id = doc_id;
//         this.ref = ref;
//         this.collectionType = DBCollectionType.USERS;
//
//         // Field
//         this.username = username;
//         this.email = email;
//         this.chatroomRefs = chatroomRefs;
//         this.postRefs = postRefs;
//         this.profileImageType = profileImageType;
//         this.userReports = userReports;
//         this.postReports = postReports;
//         this.blocked = blocked;
//         this.reporters = reporters;
//         this.reportCount = reportCount;
//
//         // Other
//         this.password = password;
//         this.profileImageUrl = ProfileImageHelper.getProfileImageUrl(this.profileImageType);
//     }
//
//     copy() {
//         return new UserModel(this.doc_id, this.ref, this.username, this.email, this.password, this.chatroomRefs, this.postRefs, this.profileImageType, this.userReports, this.postReports, this.blocked, this.reporters, this.reportCount);
//     }
//
//     static newSignup(username, email, password) {
//         return new UserModel(null, null, username, email, password, [], [], ProfileImageHelper.getRandomProfileImageType(), [], [], false, [], 0);
//     }
//
//     static async loadDataByAuth(auth) {
//         const ref = DBHelper.getRef(DBCollectionType.USERS, auth.email);
//         return this.loadDataByRef(ref);
//     }
//
//     static async loadDataByRef(ref) {
//         let data = []
//         if (await DBHelper.loadDataByRef(ref, data) === false) return null;
//         data = data[0]
//
//         let model = new UserModel(data.doc_id, data.ref, data.username, data.email, null, /*ref[]*/data.chatrooms, data.posts, data.profileImageType, data.userReports, data.postReports, data.blocked, data.reporters, data.reportCount);
//
//         model.asyncUpdateMissingField().then();
//
//         return model;
//     }
//
//     static async loadDataById(userEmail) {
//         const ref = DBHelper.getRef(DBCollectionType.USERS, userEmail);
//         return this.loadDataByRef(ref);
//     }
//
//     async asyncUpdateProfile() {
//         if (await DBHelper.updateData(this.ref, {profileImageType: this.profileImageType}) === false) return false;
//         return true;
//     }
//
//     async asyncUpdateMissingField() {
//         let data = {};
//
//         if (!this.reportCount) {
//             this.reportCount = 0;
//             data["reportCount"] = this.reportCount;
//         }
//
//         if (!this.reporters) {
//             this.reporters = [];
//             data["reporters"] = this.reporters;
//         }
//
//         if (!this.postReports) {
//             this.postReports = [];
//             data["postReports"] = this.postReports;
//         }
//
//         if (!this.userReports) {
//             this.userReports = [];
//             data["userReports"] = this.userReports;
//         }
//
//         if (this.profileImageType === undefined || this.profileImageType === null) {
//             this.profileImageType = ProfileImageHelper.getRandomProfileImageType();
//             data["profileImageType"] = this.profileImageType;
//         }
//         await DBHelper.updateData(this.ref, data);
//     }
//
//     async asyncReportUser(targetUserEmail) {
//         try {
//             let batch = writeBatch(db);
//
//             const targetUserRef = DBHelper.getRef(DBCollectionType.USERS, targetUserEmail);
//             batch.update(targetUserRef, {reporters: arrayUnion(this.ref)})
//             batch.update(this.ref, {userReports: arrayUnion(targetUserEmail)});
//
//             await batch.commit();
//             return true;
//         }
//         catch (err) {
//             return false;
//         }
//     }
//
//     async asyncUnblockUser(targetUserEmail) {
//         try {
//             let batch = writeBatch(db);
//
//             const targetUserRef = DBHelper.getRef(DBCollectionType.USERS, targetUserEmail);
//             batch.update(targetUserRef, {reporters: arrayRemove(this.ref)});
//             batch.update(this.ref, {userReports: arrayRemove(targetUserEmail)});
//
//             await batch.commit();
//             return true;
//         }
//         catch (err) {
//             return false;
//         }
//     }
//
//     async asyncCreateUser() {
//         if (this.isValid() === false) return false;
//         try{
//             createUserWithEmailAndPassword(auth, this.email, this.password)
//             .then(async userCredentials => {
//                 const user = userCredentials.user;
//                 const userData = {
//                     username: this.username,
//                     uid: user.uid,
//                     email: user.email,
//                     posts: [],
//                     profileImageType: ProfileImageHelper.getRandomProfileImageType(),
//                     postReports: [],
//                     userReports: [],
//                     blocked: false,
//                     reportCounts: 0,
//                     reporters: [],
//                 }
//
//                 if(await DBHelper.addData(this.collectionType, userData) === false){
//                     // TO DO
//                     console.log("Couldn't add a document to DB")
//                     return false;
//                 }
//
//                 await updateProfile(user, {displayName: this.username}).catch(
//                     (err) => {
//                         console.log(err);
//                         return false;
//                     }
//                 );
//
//                 console.log('Registered in with: ', user.email);
//                 return true;
//             }).catch((e) => {
//                 console.log(e);
//                 return false;
//             })
//         }catch(e){
//             console.log(e);
//             return false;
//         }
//     }
//
//     static passwordReset(email) {
//         sendPasswordResetEmail(auth, email)
//         .then(() => {
//             // Password reset email sent!
//             return true;
//         })
//         .catch(error => {
//             // TO DO 여기서 에러 메세지를 받음 (error)
//             console.log(error);
//             return false;
//         })
//     }
//
//     static async asyncEmailVerify(user) {
//         const verifyResult = sendEmailVerification(user)
//         .then( () => {
//             return true;
//         })
//         .catch(error => {
//             // TO DO
//             console.log(error);
//             return false;
//         });
//         return verifyResult;
//     }
//
//     static async asyncLogin(email, password) {
//         const loginResult = signInWithEmailAndPassword(auth, email, password)
//             .then(userCredentials => {
//                 const user = userCredentials.user;
//                 console.log('Logged in with: ', user.email);
//
//                 return true;
//             })
//             .catch(error => {
//                 console.log(error);
//                 return false;
//             })
//         return loginResult;
//     }
//
//     static async asyncSignOut() {
//         const signOutResult = signOut(auth)
//         .then(() => {
//             console.log(`logged out`);
//             return true;
//         })
//         .catch(error => {
//             // TO DO
//             console.log(error);
//             return false;
//         })
//         return signOutResult;
//     }
//     isValid() {
//         return true;
//     }
//
//     static isLoadDataValid(data) {
//         if (
//             data.doc_id === null ||
//             data.username === null ||
//             data.email === null ||
//             data.password === null
//         ) {
//             return false;
//         }
//         else {
//             return true;
//         }
//     }
// }
