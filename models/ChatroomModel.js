import {DBCollectionType} from "../utils/utils";
import DBHelper from "../helpers/DBHelper";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

export default class ChatroomModel {
    constructor(doc_id, ref, opponentRef, user, recentText, displayName ) {
        this.id = doc_id;
        this.ref = ref;
        this.collectionType = DBCollectionType.CHATROOMS;

        this.opponentRef = opponentRef;
        this.user = user;
        this.recentText = recentText;
        this.displayName = displayName;

    }

    static newEmpty() {
        return new ChatroomModel("", "", "", "", "", "");
    }

    // ---------------- Get / Set --------------------
    setDocId = (doc_id) => this.doc_id = doc_id;
    setRef = (ref) => this.ref = ref;
    setOpponentRef = (opponentRef) => this.opponentRef = opponentRef;
    setUser = (user) => this.user = user;
    setRecentText = (recentText) => this.recentText = recentText;
    setDisplayName = (displayName) => this.displayName = displayName;


    // ---------------- Task -------------------------


    static async loadAllData(currentUserRef, dest) {

        let userData = []
        if (await DBHelper.loadDataByRef(currentUserRef, /* OUT */ userData) === false) {
            // TO DO:
            console.log("Failed to load the data of current user!");
            return false;
        }
        else {
            userData = userData[0];
        }

        if(userData.chatrooms?.length === 0 || !(userData.chatrooms)){
            console.log("No chatrooms")
            return true;
        }

        for (let i = 0; i < userData.chatrooms.length; i++) {
            let data = [];
            if (await DBHelper.loadDataByRef(userData.chatrooms[i], data) === false) {
                // TO DO:
                console.log(`Failed to load chatrooms[${i}] data!`);
                return false;
            }
            data = data[0];
            

            
            dest.push(data);
        }
        return true;
    }
    
    async asyncSaveData() {
        if (this.isValid() === false) return false;

        return (await DBHelper.addData(this.collectionType, this.getData()));
    }


    static getRecentText(chatroomRef, setRecentText, setTimestamp) {
        try{
            const q = query(collection(chatroomRef, DBCollectionType.MESSAGES), orderBy("createdAt", "desc"));
            onSnapshot(q, (snapshot) => {
                setRecentText(snapshot.docs[0].data().text);
                setTimestamp(snapshot.docs[0].data().createdAt);
            })
            return true;
        }catch(e){
            //TO DO
            console.log(e);
            return false;
        }
    }

    static async asyncGetDisplayName(opponentId, setDisplayName) {
        let dest = [];
        if(await DBHelper.getDocRefById(DBCollectionType.USERS, opponentId, dest) === false){
            // TO DO
            return false;
        }
        dest = dest[0];
        let data = [];
        if(await DBHelper.loadDataByRef(dest, data) === false){
            //TO DO
            return false;
        }
        data = data[0];

        setDisplayName(data.username);
        return true;
    }

    static async asyncExitChatroom(ref, user) {
        if(await DBHelper.deleteChatroom(ref, user) === false){
            // TO DO:
            return false;
        }
        return true;
    }

    async updateData() {
        if (this.isValid() === false) return false;
        if (this.ref == null) return false;

        return await DBHelper.updateData(this.ref, this.getData());
    }

    static async _dataToModel(data) {
        if (this.isValid(data) === false) {
            return null;
        }


        return new ChatroomModel(data.doc_id, data.ref, data.opponentRef, data.user, data.displayName);
    }

    static isValid(data) {
        return !!(data.doc_id && data.ref && data.opponentRef && data.user && data.displayName);
    }


    getData() {
        return {
            opponentRef: this.opponentRef,
            user: this.user,
        }
    }
}