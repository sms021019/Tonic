import { writeBatch } from "firebase/firestore";
import { DBCollectionType } from "../utils/utils";
import { db } from "../firebase";
import DBHelper from "../helpers/DBHelper";
import ChatroomHeaderController from "./ChatroomHeaderController";



export default class ChatroomController {
    

    static async asyncGetChatroom (id) {
        return /**@type {ChatroomDoc}*/ await FirebaseHelper.getDocDataById(DBCollectionType.CHATROOMS, id);
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

    
}