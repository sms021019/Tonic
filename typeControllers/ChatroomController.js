import {collection, query, where, or, writeBatch, getDocs} from "firebase/firestore";
import { DBCollectionType } from "../utils/utils";
import { db } from "../firebase";
import DBHelper from "../helpers/DBHelper";
import ChatroomHeaderController from "./ChatroomHeaderController";
import FirebaseHelper from "../helpers/FirebaseHelper";



export default class ChatroomController {

    static async asyncLoadChatroomMessage(id) {
        const chatroomMessageRef = this.getChatroomMessageRefById(id);
        return await FirebaseHelper.getDocsDataByCollectionRef(chatroomMessageRef);
    }

    static async asyncGetChatroomById (id) {
        return /**@type {ChatroomDoc}*/ await FirebaseHelper.getDocDataById(DBCollectionType.CHATROOMS, id);
    }

    static getChatroomMessageRefById(id) {
        const chatroomMessageRef = collection(db, DBCollectionType.CHATROOMS, id, DBCollectionType.MESSAGES);
        return chatroomMessageRef;
    }

    static async asyncGetChatroomsByEmail(email) {
        const cRef = FirebaseHelper.getCRefByPath(DBCollectionType.CHATROOMS);
        const q = query(
            cRef,
            or(
                where('ownerEmail', '==', email),
                where('customerEmail', '==', email)
            )
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data());
    }

    /**
     * The 'chatroom.docId' will be initialized in here, if succeeded.
     * @param {ChatroomDoc} chatroom
     * @returns {Promise<boolean>}
     */
    static async asyncCreateNewChatroom (chatroom) {
        try{
            if (this.isValidNewChatroom(chatroom) === false) return false;

            let batch = writeBatch(db);

            if (await this.asyncSetNewChatroom(batch, chatroom) === false) return false;
            if (await ChatroomHeaderController.asyncSetNewChatroomHeader(batch, chatroom) === false) return false;

            await batch.commit();
            return true;
        }
        catch(e){
            console.log(e, 'Err: ChatroomController.asyncCreateNewChatroom');
            return false;
        }
    }

    static async asyncSetNewChatroom(batch, chatroom) {
        try {
            let newChatroomRef = DBHelper.getNewRef(DBCollectionType.CHATROOMS);
            chatroom.docId = newChatroomRef.id;
            batch.set(newChatroomRef, chatroom);
            return true;
        }
        catch(err) {
            console.log('Err: ChatroomController.asyncSetNewChatroom');
            return false;
        }
    }

    static async asyncExitChatroom(chatroom) {
        try{
            let batch = writeBatch(db);

            if (await this.asyncBatchDeleteChatroom(batch, chatroom) === false) return false;
            if (await ChatroomHeaderController.asyncSetDeleteChatroomHeaders(batch, chatroom) === false) return false;

            await batch.commit();
            return true;
        }
        catch(e){
            console.log(e, 'Err: ChatroomController.asyncExitChatroom');
            return false;
        }
    }

    /**
     *
     * @param batch
     * @param {ChatroomDoc[]} chatrooms
     * @returns {Promise<boolean>}
     */
    static async asyncBatchExitChatrooms(batch, chatrooms) {
        for (const chatroom of chatrooms) {
            if (await this.asyncBatchExitChatroom(batch, chatroom) === false) return false;
        }
        return true;
    }

    /**
     *
     * @param batch
     * @param {ChatroomDoc}chatroom
     * @returns {Promise<boolean>}
     */
    static async asyncBatchExitChatroom(batch, chatroom) {
        try {
            if (await this.asyncBatchDeleteChatroom(batch, chatroom.docId) === false) return false;
            if (await ChatroomHeaderController.asyncSetDeleteChatroomHeaders(batch, chatroom) === false) return false;
            return true;
        }
        catch(e) {
            console.log(e, 'Err: ChatroomController.asyncExitChatroom');
            return false;
        }
    }

    /**
     *
     * @param batch
     * @param {string} docId
     * @returns {Promise<boolean>}
     */
    static async asyncBatchDeleteChatroom(batch, docId) {
        try {
            // Delete Messages
            const dRefs = await FirebaseHelper.getDocRefsByCollectionPath(DBCollectionType.CHATROOMS, docId, DBCollectionType.MESSAGES);
            for (const ref of dRefs) {
                batch.delete(ref);
            }

            // Delete Chatroom
            const dRef = FirebaseHelper.getRef(DBCollectionType.CHATROOMS, docId);
            batch.delete(dRef);

            return true;
        }
        catch(e) {
            console.log(e, 'Err: ChatroomController.asyncBatchDeleteChatroom');
            return false;
        }
    }

    /**
     *
     * @param {ChatroomDoc} chatroom
     * @return boolean
     */
    static isValidNewChatroom(chatroom) {
        if (!chatroom.customerEmail || !chatroom.ownerEmail || !chatroom.postId) return false;
        if (chatroom.customerEmail === chatroom.ownerEmail) return false;
        return true;
    }
}
