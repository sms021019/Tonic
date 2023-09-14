import { collection, doc, getDocs, query, where } from "firebase/firestore";
import DBHelper from "../helpers/DBHelper";
import { DBCollectionType } from "../utils/utils";
import FirebaseHelper from "../helpers/FirebaseHelper";
import UserController from "./UserController";
import { db } from "../firebase";


export default class ChatroomHeaderController {

    /**
     *
     * @param batch
     * @param {ChatroomDoc} chatroom
     * @returns {Promise<boolean>}
     */
    static async asyncSetNewChatroomHeader(batch, chatroom) {
        try{
            let /** @type ChatroomHeaderDoc */ newOwnerChatroomHeader = {
                docId: null,
                opponentEmail: chatroom.customerEmail,
                email: chatroom.ownerEmail,
                chatroomId: chatroom.docId,
                postId: chatroom.postId,
                recentText: null,
                recentTextTimeStamp: null,
            }

            let /** @type ChatroomHeaderDoc */ newCustomerChatroomHeader = {
                docId: null,
                opponentEmail: chatroom.ownerEmail,
                email: chatroom.customerEmail,
                chatroomId: chatroom.docId,
                postId: chatroom.postId,
                recentText: null,
                recentTextTimeStamp: null,
            }

            if(await this.asyncSetAddChatroomHeaders(batch, newOwnerChatroomHeader, newCustomerChatroomHeader) === false) return false;

            return true;

        }catch(err) {
            console.log("Err: ChatroomHeaderController.asyncSetNewChatroomHeader");
            return false;
        }
    }

    static async asyncSetAddChatroomHeaders(batch, OwnerChatroomHeader, CustomerChatroomHeader) {
        try{
            const ownerRef = DBHelper.getRef(DBCollectionType.USERS, OwnerChatroomHeader.email);
            const customerRef = DBHelper.getRef(DBCollectionType.USERS, CustomerChatroomHeader.email);

            // ----firebase 함수를 최대한 Helper class에서 총괄할 수 있도록 개편 요함.----
            const ownerChatroomHeaderRef = collection(ownerRef, DBCollectionType.CHATROOMHEADERS);
            const customerChatroomHeaderRef = collection(customerRef, DBCollectionType.CHATROOMHEADERS);

            const newOwnerChatroomHeaderDoc = doc(ownerChatroomHeaderRef);
            const newCustomerChatroomHeaderDoc = doc(customerChatroomHeaderRef);

            OwnerChatroomHeader.docId = newOwnerChatroomHeaderDoc.id;
            CustomerChatroomHeader.docId = newCustomerChatroomHeaderDoc.id;
            // -----------------------------------------------------------------

            batch.set(newOwnerChatroomHeaderDoc, OwnerChatroomHeader);
            batch.set(newCustomerChatroomHeaderDoc, CustomerChatroomHeader);

            return true;
        }catch(err) {
            console.log("Err: ChatroomHeaderController.asyncSetAddChatroomHeaders");
            return false;
        }
    }

    /**
     *
     * @param {string} email
     * @returns {CollectionReference<DocumentData>}
     */
    static getChatroomHeaderRef(email) {
        return collection(db, DBCollectionType.USERS, email, DBCollectionType.CHATROOMHEADERS);
    }

    static async asyncLoadOpponentData(opponentEmail) {
        try{
            const opponentData = await UserController.asyncGetUser(opponentEmail);
            return opponentData;
        }catch(err) {
            console.log("Err: ChatroomHeaderController.asyncLoadOpponentData");
            return null;
        }
    }

    static async asyncGetChatroomHeaderIdsByEmail(email) {
        const chatroomHeaderRef = this.getChatroomHeaderRef(email);
        const userChatroomHeaderIds = await FirebaseHelper.getDocIdsByCollectionRef(chatroomHeaderRef);
        return userChatroomHeaderIds;
    }

    static async asyncGetChatroomHeaderByEmailAndId(props) {
        const chatroomHeaderRef = this.getChatroomHeaderRef(props.email);
        return await FirebaseHelper.getDocDataByCollectionRefAndId(chatroomHeaderRef, props.id);
    }

    /**
     *
     * @param {string} email
     * @param {string} postId
     * @returns {Promise<ChatroomHeaderDoc|null>}
     */
    static async asyncGetChatroomHeaderByEmailAndPostId(email, postId) {
        const cRef = this.getChatroomHeaderRef(email);
        const q = query(cRef, where('postId', '==', postId));
        const snapshots = await getDocs(q);
        if (snapshots.size > 0) {
            return /**@type ChatroomHeaderDoc */snapshots.docs[0]?.data();
        }
        return null;
    }

    static async asyncSetDeleteChatroomHeaders(batch, chatroom) {
        try{
            const ownerChatroomHeaderCollectionRef = this.getChatroomHeaderRef(chatroom.ownerEmail);
            const customerChatroomHeaderCollectionRef = this.getChatroomHeaderRef(chatroom.customerEmail);

            const ownerQuery = query(ownerChatroomHeaderCollectionRef, where('chatroomId', '==', chatroom.docId));
            const customerQuery = query(customerChatroomHeaderCollectionRef, where('chatroomId', '==', chatroom.docId));

            const ownerQuerySnapshot = await getDocs(ownerQuery);
            const customerQuerySnapshot = await getDocs(customerQuery);

            ownerQuerySnapshot.forEach((doc) => {
                batch.delete(doc.ref);
            });
            customerQuerySnapshot.forEach((doc) => {
                batch.delete(doc.ref);
            });
            return true;
        }
        catch(err){
            console.log('Err: ChatroomHeaderController.asyncSetDeleteChatroomHeaders');
            return false;
        }
    }

    static async asyncSetDeleteAllChatroomHeadersActionToBatch(batch, email) {
        const dRefs = await FirebaseHelper.getDocRefsByCollectionPath(DBCollectionType.USERS, email, DBCollectionType.CHATROOMHEADERS);
        if (!dRefs) return false;
        console.log("dRefs", dRefs);
        for (const ref of dRefs) {
            batch.delete(ref);
        }
        return true;
    }
}
