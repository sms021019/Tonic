import { arrayUnion } from "firebase/firestore";
import DBHelper from "../helpers/DBHelper";
import { DBCollectionType } from "../utils/utils";


export default class ChatroomHeaderController {

    static async asyncSetNewChatroomHeader(batch, chatroom) {

        let /** @type {ChatroomHeaderDOc} */ newOwnerChatroomHeader = {
            docId: null,
            opponentEmail: chatroom.customerEmail,
            email: chatroom.ownerEmail,
            chatroomId: chatroom.docId,
            recentText: null,
            recentTextTimeStamp: null,
        }

        let /** @type {ChatroomHeaderDOc} */ newCustomerChatroomHeader = {
            docId: null,
            opponentEmail: chatroom.ownerEmail,
            email: chatroom.customerEmail,
            chatroomId: chatroom.docId,
            recentText: null,
            recentTextTimeStamp: null,
        }
        
        try{
            if(await asyncSetAddChatroomHeaders(batch, newOwnerChatroomHeader, newCustomerChatroomHeader) === false) return false;
    
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

            batch.update(ownerRef, {chatrooms: arrayUnion(OwnerChatroomHeader)});
            batch.update(customerRef, {chatrooms: arrayUnion(CustomerChatroomHeader)});

            return true;
        }catch(err) {
            console.log("Err: ChatroomHeaderController.asyncSetAddChatroomHeaders");
            return false;
        }
    }
    
}