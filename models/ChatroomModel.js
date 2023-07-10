import {DBCollectionType} from "../utils/utils";
import DBHelper from "../helpers/DBHelper";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

export default class ChatroomModel {
    constructor(opponentRef, user) {
        this.id = null;
        this.ref = null;
        this.collectionType = DBCollectionType.CHATROOMS;

        this.opponentRef = opponentRef;
        this.user = user;
    }
    setRef(ref) {
        this.ref = ref;
    }

    isValid() {
        return true;
    }
    
    static async loadData(currentUserRef) {
        await DBHelper.loadData({ref: currentUserRef}).then((data) => {

        })

    }

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

    static async exitChatroom(ref, user) {
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

    async saveData() {
        if (this.isValid() === false) return false;

        return (await DBHelper.addData(this.collectionType, this.getData()));
    }

    getData() {
        return {
            opponentRef: this.opponentRef,
            user: this.user,
        }
    }
}