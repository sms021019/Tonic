import { arrayUnion, collection } from "firebase/firestore";
import DBHelper from "../helpers/DBHelper";
import { DBCollectionType } from "../utils/utils";
import FirebaseHelper from "../helpers/FirebaseHelper";
import UserController from "./UserController";
import { userAtom } from "../recoil/userState";
import { useRecoilValue } from "recoil";
import { db } from "../firebase";


export default class ChatroomHeaderController {

    static async asyncSetNewChatroomHeader(batch, chatroom) {

        let /** @type {ChatroomHeaderDoc} */ newOwnerChatroomHeader = {
            docId: null,
            opponentEmail: chatroom.customerEmail,
            email: chatroom.ownerEmail,
            chatroomId: chatroom.docId,
            recentText: null,
            recentTextTimeStamp: null,
        }

        let /** @type {ChatroomHeaderDoc} */ newCustomerChatroomHeader = {
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

    static async asyncLoadOpponentData(chatroomHeaderIds) {
        try{
            chatroomHeaderIds.map( async (chatroomHeaderId) => {
                const opponentData = await UserController.asyncGetUser(chatroomHeaderId.opponentEmail);
                chatroomHeaderId['opponentData'] = opponentData;
                return chatroomHeaderId;
            });

        }catch(err) {
            console.log("Err: ChatroomHeaderController.asyncLoadOpponentData");
            return false;
        }

        return true;
    }

    
    static async asyncGetChatroomHeaderIds() {
        const chatroomHeaderRef = this.getChatroomHeaderRef();
        const userChatroomHeaderIds = await FirebaseHelper.getDocIdsByCollectionRef(chatroomHeaderRef);
        return userChatroomHeaderIds;
    }
    
    static async asyncGetChatroomHeader(id) {
        const chatroomHeaderRef = this.getChatroomHeaderRef();
        return /** @type {PostDoc} */ await FirebaseHelper.getDocDataById(chatroomHeaderRef, id);
    }

    static getChatroomHeaderRef() {
        const user = useRecoilValue(userAtom);
        return collection(db, DBCollectionType.USERS, user.email, DBCollectionType.CHATROOMHEADERS);
    }


}