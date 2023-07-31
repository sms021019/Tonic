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
        return new ChatroomModel("", "", "", "", "", "", {empty: true});
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

    // static async asyncListChatrooms()

    static async listChatrooms(gUserModel, chatroomModelList) {
        
        const unsubscribe = onSnapshot(gUserModel.model.ref, (doc) => {
            let tempArr = [];
            if(!doc.data().chatrooms || doc.data().chatrooms.length === 0 ) {
                return;
            }
            let counter = 0;
            doc.data().chatrooms.forEach( async (chatroomRef) => {
                let data = [];
                if (await DBHelper.loadDataByRef(chatroomRef, data) === false) {
                    // TO DO:
                    console.log(`Failed to load chatrooms data!`);
                    return false;
                }

                data = data[0];

                let modelTemp = await this._dataToModel(data);
                await this.setRecentText(modelTemp);
                
                tempArr.push(modelTemp);
                counter++;

                if(counter === doc.data().chatrooms.length){
                    tempArr.sort(function(x,y) {
                        if(x.recentText.empty || y.recentText.empty) return -1;
                        return (y.recentText?.timestamp.toDate() - x.recentText?.timestamp.toDate());
                    })
                    console.log("sort end");
                    chatroomModelList.set(tempArr);
                }
            });
        
        });

        return () => unsubscribe();
    }



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
            if(await this.setRecentText(modelTemp) === false) return false;
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

   
    static async setRecentText(chatroomModel){
        let recentText = [];
        const q = query(collection(chatroomModel.ref, DBCollectionType.MESSAGES), orderBy("createdAt", "desc"), limit(1));

        if(await DBHelper.loadDataByQuery(q, recentText) === false){
            //TODO
            console.log("쿼리 읽다가 난 에러")
            return false;
        }
        recentText = recentText[0];
        if(recentText){
            recentText = {
                empty: false,
                text: recentText.text,
                timestamp: recentText.createdAt,
            }
        }else{
            recentText = {
                empty: true
            }
        }
    
        
        chatroomModel.setRecentText(recentText);
        return true;
    }



    static async getRecentText(chatroomModel, setRecentText, index, chatroomModelList) {
        const q = query(collection(chatroomModel.ref, DBCollectionType.MESSAGES), orderBy("createdAt", "desc"), limit(1));
        const unsubscribe = onSnapshot(q, 
                (snapshot) => {
                console.log(`getRecentText onSnapshot callback function[${index}]`);
        
                let tempText = snapshot.docs[0]?.data().text;
                let tempTime = snapshot.docs[0]?.data().createdAt;
                        if(setRecentText){
                            setRecentText(snapshot.docs[0]?.data());
                        }
        
                        let recentText = {
                            empty: false,
                            text: tempText,
                            timestamp: tempTime,
                        }
                        chatroomModel.setRecentText(recentText);
                        // chatroomModelList.liftChatroom(index);

                    }
                );

        return () => unsubscribe();

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

    static async asyncExitChatroom(chatModel, user) {
        // TO DO
        try{
            await runTransaction(db, async (transaction) => {
                const currentUserRef = doc(collection(db, DBCollectionType.USERS), user?.email);
                const currentUserDoc = await transaction.get(currentUserRef);
                
                const chatroomDoc = await transaction.get(ref);
                const currentUserEmail = currentUserDoc.data().email;
    
                if(!currentUserDoc.exists()){
                    throw "User document does not exist!";
                }
    
                
                let copyOfUserChatrooms = currentUserDoc.data().chatrooms;
                let index = -1;
                for(let i = 0; i < copyOfUserChatrooms.length; i++){
                    if(ref.id === copyOfUserChatrooms[i].id){
                        index = i;
                    }
                }
                console.log(index);
        
                if(index > -1) {
                    copyOfUserChatrooms.splice(index, 1);
                    transaction.update(currentUserRef, {
                        chatrooms: copyOfUserChatrooms,
                    })
                }else{
                    return Promise.reject("Sorry! Chatroom reference doesn't exist");
                }
    
                if(!chatroomDoc.exists()){
                    throw "Chatroom document does not exist!";
                }
    
                let leftParticipants = chatroomDoc.data().participants.length;
                if( leftParticipants === 1){
                    console.log("You are the last one in chatroom...\nTherefore, deleting this chatroom...");
                    transaction.delete(ref);
                }else if( leftParticipants > 1){
                    let copyOfParticipants = chatroomDoc.data().participants;
                    let temp = copyOfParticipants.indexOf(currentUserEmail);
                    console.log(temp);
                    if( temp > -1) {
                        copyOfParticipants.splice(temp, 1);
                        transaction.update(ref, {
                            participants: copyOfParticipants,
                        })
                    }else{
                        return Promise.reject("Sorry! User reference doesn't exist");
                    }
                }else{
                    throw "Please check number of participants"
                }
                
    
            });
    
            console.log("Transaction successfully committed!");
            return true;
        }catch(error){
            console.error(error);
            return false;
        }

        if(await DBHelper.deleteChatroom(chatModel, user) === false){
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