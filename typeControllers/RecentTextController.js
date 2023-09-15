import { getDocs, limit, orderBy, query } from "firebase/firestore";
import ChatroomController from "./ChatroomController";

export default class recentTextController {
    static async asyncGetRecentText(chatroomId) {
        try{
            const messageRef = ChatroomController.getChatroomMessageRefById(chatroomId); // collection ref
            const q = query(messageRef, orderBy("createdAt", "desc"), limit(1));
            const snapshots = await getDocs(q); //읽히면 firebaseHelper로 바꾸기

            const _doc = snapshots.docs[0]; //읽히면 firebaseHelper로 바꾸기

            console.log(_doc ? `recentText Data: ${_doc.data()}` : 'no recentText');

            const recentText = _doc ? _doc.data() : null;

            return recentText;



        }catch(err){
            console.log('Err: recentTextController.asyncGetRecentText');
            return null;
        }
    }
}
