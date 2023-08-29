import {DBCollectionType, LOG_ERROR} from "../utils/utils";
import FirebaseHelper from "../helpers/FirebaseHelper";
import {arrayUnion, writeBatch} from "firebase/firestore";
import {db} from "../firebase";
import {arrayRemove} from "@firebase/firestore";
import DBHelper from "../helpers/DBHelper";


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

    /**
     *
     * @param {string} reporterEmail
     * @param {string} targetPostId
     * @returns {Promise<boolean>}
     */
    static async asyncUnblockPost(reporterEmail, targetPostId) {
        if (false === await FirebaseHelper.updateDoc(DBCollectionType.USERS, reporterEmail, {reportedPostIds: arrayRemove(targetPostId)})) {
            console.log("Err: UserController.asyncUnblockPost");
            return false;
        }
        return true;
    }

    /**
     *
     * @param {string} reporterEmail
     * @param {string} targetUserEmail
     * @returns {Promise<boolean>}
     */
    static async asyncReportUser(reporterEmail, targetUserEmail) {
        if (false === await FirebaseHelper.updateDoc(DBCollectionType.USERS, reporterEmail, {reportedUserEmails: arrayUnion(targetUserEmail)})) {
            console.log("Err: UserController.asyncReportUser");
            return false;
        }
        return true;
    }

    /**
     *
     * @param {string} reporterEmail
     * @param {string} targetUserEmail
     * @returns {Promise<boolean>}
     */
    static async asyncUnblockUser(reporterEmail, targetUserEmail) {
        if (false === await FirebaseHelper.updateDoc(DBCollectionType.USERS, reporterEmail, {reportedUserEmails: arrayRemove(targetUserEmail)})) {
            console.log("Err: UserController.asyncUnblockUser");
            return false;
        }
        return true;
    }

    /**
     *
     * @param {UserDoc} user
     * @param {PostDoc} post
     * @returns {boolean}
     */
    static isPostBlockedByUser(user, post) {
        return (user.reportedPostIds.includes(post.docId) || user.reportedUserEmails.includes(post.ownerEmail))
    }

    /**
     *
     * @param {string} email
     * @param {string} profileImageType
     * @returns {Promise<boolean>}
     */
    static async asyncUpdateProfile(email, profileImageType) {
        if (await FirebaseHelper.updateDoc(DBCollectionType.USERS, email,{profileImageType: profileImageType}) === false) {
            console.log("Err: UserController.asyncUpdateProfile");
            return false;
        }
        return true;
    }

    static async asyncUpdateUsername(email, username) {
        if (await FirebaseHelper.updateDoc(DBCollectionType.USERS, email,{username: username}) === false) {
            console.log("Err: UserController.asyncUpdateUsername");
            return false;
        }
        return true;
    }
}
