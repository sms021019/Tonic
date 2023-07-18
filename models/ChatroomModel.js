import {DBCollectionType} from "../utils/utils";
import DBHelper from "../helpers/DBHelper";
import { collection, query, orderBy, onSnapshot, runTransaction, writeBatch, limit, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { arrayUnion } from "firebase/firestore";
import { useCallback } from "react";

/*----------DB COLLECTION STRUCT----------------
{
    customer: {
        email: "hghj@stonybrook.edu",
        uid: "",
        username: "",
    }
    displayName: "RoomName",
    owner: {
        email: "asdf@stonybrook.edu",
        uid: "",
        username: "",
    }
    postModelId: "sdnsdfsagahl",
}
----------------------------------------------*/

export default class ChatroomModel {
    constructor(doc_id, ref, user, owner, postModelId, displayName, recentText ) {
        this.doc_id = doc_id;
        this.ref = ref;
        this.collectionType = DBCollectionType.CHATROOMS;

        this.customer = user;
        this.owner = owner;
        this.postModelId = postModelId;
        this.displayName = displayName;

        this.recentText = recentText

    }

    static newEmpty() {
        return new ChatroomModel("", "", "", "", "", "");
    }

    // ---------------- Get / Set --------------------
    setDocId = (doc_id) => this.doc_id = doc_id;
    setRef = (ref) => this.ref = ref;
    setOwner = (owner) => this.owner = owner;
    setCustomer = (customer) => this.customer = customer;
    setPostModelId = (postModelId) => this.postModelId = postModelId;
    setDisplayName = (displayName) => this.displayName = displayName;
    setRecentText = (recentText) => this.recentText = recentText;
    
    // setRecentText = useCallback((recentText = {}) => {
    //     this.recentText = recentText;
    // })

    // ---------------- Task -------------------------


    static async loadAllData(currentUserRef, dest) {

        //---Reading user's DB document---
        let userData = []
        if (await DBHelper.loadDataByRef(currentUserRef, /* OUT */ userData) === false) {
            // TO DO:
            console.log("Failed to load the data of current user!");
            return false;
        }
        else {
            userData = userData[0];
        }

        //---Checking is there a chatroom---
        if(userData.chatrooms?.length === 0 || !(userData.chatrooms)){
            console.log("No chatrooms")
            return true;
        }

        //---Reading all chatrooms that are in user's db document one by one---
        for (let i = 0; i < userData.chatrooms.length; i++) {
            let data = [];
            if (await DBHelper.loadDataByRef(userData.chatrooms[i], data) === false) {
                // TO DO:
                console.log(`Failed to load chatrooms[${i}] data!`);
                return false;
            }
            data = data[0];

            let modelTemp = await this._dataToModel(data);
            this.getRecentText(modelTemp);
            // await this.findRecentText(modelTemp);
            dest.push(modelTemp);
        }

        // this.sortByNewestChat(modelTemp);

        return true;
    }

    
    async asyncSaveData() {
        if (this.isContentReady() === false) return false;

        try{
            let batch = writeBatch(db);

            this.ref = DBHelper.getNewRef(this.collectionType);
            this.doc_id = this.ref.id;
            batch.set(this.ref, this.getData());

            const customerRef = DBHelper.getRef(DBCollectionType.USERS, this.customer.email);
            const ownerRef = DBHelper.getRef(DBCollectionType.USERS, this.owner.email);
            batch.update(customerRef, {chatrooms: arrayUnion(this.ref)});
            batch.update(ownerRef, {chatrooms: arrayUnion(this.ref)});


            await batch.commit();

            return true;

        }catch(e){
            console.log(e);
            return false;
        }


        // return (await DBHelper.addData(this.collectionType, this.getData()));
    }


    async asyncSetNewChatroomData(displayName, postModelId, owner, user) {
        this.setDisplayName(displayName);
        this.setPostModelId(postModelId);
        let ownerData = {
            email: owner.email,
            uid: owner.uid,
            username: owner.username
        }
        this.setOwner(ownerData);

        let customerData = [];
        if( await DBHelper.loadDataByRef(DBHelper.getRef(DBCollectionType.USERS, user.email), customerData) === false) return false;
        customerData = customerData[0];
        customerData = {
            email: customerData.email,
            uid: customerData.uid,
            username: customerData.username
        }
        this.setCustomer(customerData);
        return true;
    }

    // async asyncFindUsersData(userIds, dest) {
    //     for(let index = 0; index < userIds.length; index++){
    //         let tempUserData = [];
    //         if(await DBHelper.loadDataByRef(DBHelper.getRef(DBCollectionType.USERS, userIds[index]), tempUserDoc) === false){
    //             // TO DO
    //             console.log("Couldn't find user");
    //             return false;
    //         }
    //         dest.push(tempUserData[0]);
    //     }
    //     return true;
    // }

    // static isCollectionEmpty(ref, collectionType){
    //     const snap = query(collection(ref, collectionType), limit(1));
    //     return (snap.empty);
    // }

    // static async findRecentText(model) {
    //     const q = query(collection(model.ref, DBCollectionType.MESSAGES), orderBy("createdAt", "desc"), limit(1));
        
    //     const querySnapshot = await getDocs(q);
    //     querySnapshot.forEach((doc) => {
    //         model.setRecentText({
    //             text: doc.data().text,
    //             timestamp: doc.data().createdAt,
    //         })
    //     })

    // }



    static getRecentText(chatroomModel, setRecentText, setTimestamp) {
        try{
            let recentText = {};
            const q = query(collection(chatroomModel.ref, DBCollectionType.MESSAGES), orderBy("createdAt", "desc"), limit(1));
           
            onSnapshot(q, 
                (snapshot) => {
                if(setRecentText && setTimestamp){
                    setRecentText(snapshot.docs[0]?.data().text);
                    setTimestamp(snapshot.docs[0]?.data().createdAt);
                }
                recentText = {
                    text: snapshot.docs[0]?.data().text,
                    timestamp: snapshot.docs[0]?.data().createdAt
                }
                chatroomModel.setRecentText(recentText);
            },
                (error) => {
                    console.log(error);
                    return false;
                }
            )

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

    static async _dataToModel(data) {// prob
        if (this._isLoadDataValid(data) === false) {
            console.log("returning null")
            return null;
        }
        return new ChatroomModel(data.doc_id, data.ref, data.customer, data.owner, data.postModelId, data.displayName);
    }

    isContentReady() {
        return (
            this.customer !== null &&
            this.owner !== null &&
            this.postModelId !== null &&
            this.displayName !== null 
        );
    }


    getData() {
        return {
            owner: this.owner,
            customer: this.customer,
            displayName : this.displayName,
            postModelId : this.postModelId,
        }
    }

    static _isLoadDataValid(data) {
        return !!(data.doc_id && data.ref && data.owner && data.customer && data.postModelId && data.displayName);
    }
}