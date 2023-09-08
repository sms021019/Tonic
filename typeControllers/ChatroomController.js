import { collection, writeBatch } from "firebase/firestore";
import { DBCollectionType } from "../utils/utils";
import { db } from "../firebase";
import DBHelper from "../helpers/DBHelper";
import ChatroomHeaderController from "./ChatroomHeaderController";
import FirebaseHelper from "../helpers/FirebaseHelper";



export default class ChatroomController {
    

    static async asyncGetChatroomById (id) {
        return /**@type {ChatroomDoc}*/ await FirebaseHelper.getDocDataById(DBCollectionType.CHATROOMS, id);
    }

    static async asyncLoadChatroomMessage(id) {
        const chatroomMessageRef = this.getChatroomMessageRefById(id);
        return await FirebaseHelper.getDocsDataByCollectionRef(chatroomMessageRef);
    }

    static getChatroomMessageRefById(id) {
        const chatroomMessageRef = collection(db, DBCollectionType.CHATROOMS, id, DBCollectionType.MESSAGES);
        return chatroomMessageRef;
    }

    static async asyncCreateNewChatroom (chatroom) {
        try{
            let batch = writeBatch(db);
            
            if(await this.asyncSetNewChatroom(batch, chatroom) === false) return false;
            if(await ChatroomHeaderController.asyncSetNewChatroomHeader(batch, chatroom) === false) return false;

            await batch.commit();
            return true;

        }catch(err){
            console.log('Err: ChatroomController.asyncCreateNewChatroom');
            return false;
        }
    }


    static async asyncSetNewChatroom(batch, chatroom) {
        try{
            let newChatroomRef = DBHelper.getNewRef(DBCollectionType.CHATROOMS);
            chatroom.docId = newChatroomRef.id;
            batch.set(newChatroomRef,chatroom);
    
            return true;

        }catch(err){
            console.log('Err: ChatroomController.asyncSetNewChatroom');
            return false;
        }

    }

    static async asyncExitChatroom(chatroom) {
        try{
            let batch = writeBatch(db);

            if(await this.asyncSetDeleteChatroom(batch, chatroom) === false) return false;
            if(await ChatroomHeaderController.asyncSetDeleteChatroomHeaders(batch, chatroom) === false) return false;

            await batch.commit();
            return true;


        }catch(err){
            console.log('Err: ChatroomController.asyncExitChatroom');
            return false;
        }
    }

    static async asyncSetDeleteChatroom(batch,chatroom) {
        try{
            const chatroomRef = FirebaseHelper.getRef(DBCollectionType.CHATROOMS, chatroom.docId);
            batch.delete(chatroomRef);
            return true;
        }catch(err){
            console.log('Err: ChatroomController.asyncSetDeleteChatroom');
            return false;
        }
    }

    
}