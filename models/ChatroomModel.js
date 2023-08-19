import {DBCollectionType} from "../utils/utils";
import DBHelper from "../helpers/DBHelper";
import { collection, query, orderBy, onSnapshot, runTransaction, writeBatch, limit, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { arrayUnion, arrayRemove } from "firebase/firestore";
import { useCallback } from "react";
import ImageHelper from "../helpers/ImageHelper";

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
        this.amountOfUsers = 2;

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
    setAmountOfUsers = (amountOfUsers) => this.amountOfUsers = amountOfUsers;
    setRecentText = (recentText) => this.recentText = recentText;
    
    setCurrentEmail = (userEmail) => this.currentEmail = userEmail;
    
    // setRecentText = useCallback((recentText = {}) => {
    //     this.recentText = recentText;
    // })

    // ---------------- Task -------------------------

    static async onSnapshotGetUserChatroomRefs(gUserModel, setChatroomRefs) {
        const unsubscribe = onSnapshot(gUserModel.model.ref, (userDoc) => {
            if(!userDoc.data().chatrooms || userDoc.data().chatrooms.length === 0 ) {
                console.log("No Chatrooms");
                setChatroomRefs([]);
            }else{
                setChatroomRefs(userDoc.data().chatrooms);
            }
        })
        return () => unsubscribe();
    }

    static async asyncChatroomRefsToModel(chatroomRefs){
        let tempArr = [];
        for(let i = 0; i < chatroomRefs.length; i++){
            let tempData = [];
            if(await DBHelper.loadDataByRef(chatroomRefs[i], tempData) === false) {
                console.log('Failed to load chatroom data!');
                return false;
            }
            tempData = tempData[0]

            let modelTemp = await this._dataToModel(tempData);
            await this.setRecentText(modelTemp);
            tempArr.push(modelTemp);
        }
        return tempArr;
    }

    static sortChatroomModelsByRecentText(chatroomModels) {
        chatroomModels.sort(function(x,y) {
            if(x.recentText.empty || y.recentText.empty) return -1;
            return (y.recentText?.timestamp.toDate() - x.recentText?.timestamp.toDate());
        })
        return chatroomModels;
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

    }


    async asyncSetNewChatroomData(displayName, postModelId, owner, user) {
        this.setDisplayName(displayName);
        this.setPostModelId(postModelId);
        let ownerData = {
            email: owner.email,
            uid: owner.uid,
            username: owner.username,
            profileImageType: owner.profileImageType
        }
        this.setOwner(ownerData);

        let customerData = [];
        if( await DBHelper.loadDataByRef(DBHelper.getRef(DBCollectionType.USERS, user.email), customerData) === false) return false;
        customerData = customerData[0];
        customerData = {
            email: customerData.email,
            uid: customerData.uid,
            username: customerData.username,
            profileImageType: customerData.profileImageType
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



    getRecentText(setRecentText, index) {
        const q = query(collection(this.ref, DBCollectionType.MESSAGES), orderBy("createdAt", "desc"), limit(1));
        const unsubscribe = onSnapshot(q, 
                (snapshot) => {
                //     snapshot.docChanges().forEach((change) => {
                //         if (change.type === "added") {
                //             console.log("New chat: ", change.doc.data());
                //         }
                //         if (change.type === "modified") {
                //             console.log("Modified chat: ", change.doc.data());
                //         }
                //         if (change.type === "removed") {
                //             console.log("Removed chat: ", change.doc.data());
                //         }
                //     });
                // console.log(`\ngetRecentText onSnapshot callback function[${index}]`);
                // console.log("LISTENER FIRING!!!!!!!!!")
                // console.log(`from cache: ${snapshot?.metadata.fromCache}`)
                // console.log(`pending writes: ${snapshot?.metadata.hasPendingWrites}`)
                // console.log(`number of records: ${snapshot?.docs.length}\n`)
        
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
                        this.setRecentText(recentText);
                        // chatroomModelList.liftChatroom(index);

                    }
                );

        return () => unsubscribe();

    }

    // static async asyncGetDisplayName(opponentId, setDisplayName) {
    //     let dest = [];
    //     if(await DBHelper.getDocRefById(DBCollectionType.USERS, opponentId, dest) === false){
    //         // TO DO
    //         return false;
    //     }
    //     dest = dest[0];
    //     let data = [];
    //     if(await DBHelper.loadDataByRef(dest, data) === false){
    //         //TO DO
    //         return false;
    //     }
    //     data = data[0];

    //     setDisplayName(data.username);
    //     return true;
    // }

    async asyncExitChatroom(userEmail) {
        console.log("Entered asyncExitChatroom")
        this.setCurrentEmail(userEmail);
        
        if(this.amountOfUsers < 2){
            return this.asyncDeleteData();
        }else{
            return this.asyncRemoveChatroomFromList();
        }
    }

    async asyncDeleteData(){
        console.log("Entered asyncDeleteData")
        try {
            let batch = writeBatch(db);
            if (await this._bAsyncDeleteData(batch) === false) return false;

            await batch.commit();
            this.setAmountOfUsers(this.amountOfUsers - 1);
            return true;
        }
        catch (err) {
            return false;
        }
    }

    async _bAsyncDeleteData(batch) {
        console.log("Entered _bAsyncDeleteData")
        if(this.ref === null) return false;

        batch.delete(this.ref);

        const userRef = DBHelper.getRef(DBCollectionType.USERS, this.currentEmail)
        batch.update(userRef, {chatrooms: arrayRemove(this.ref)});

        return true;
    }

    async asyncRemoveChatroomFromList() {
        console.log("Entered asyncRemoveChatroomFromList")
        try {
            let batch = writeBatch(db);

            const userRef = DBHelper.getRef(DBCollectionType.USERS, this.currentEmail)
            batch.update(userRef, {chatrooms: arrayRemove(this.ref)});

            await batch.commit();
            this.setAmountOfUsers(this.amountOfUsers - 1);
            return true;
        }
        catch (err) {
            return false;
        }
    }

    // static async asyncExitChatroom(chatModel, user) {
    //     // TO DO
    //     try{
    //         await runTransaction(db, async (transaction) => {
    //             const currentUserRef = doc(collection(db, DBCollectionType.USERS), user?.email);
    //             const currentUserDoc = await transaction.get(currentUserRef);
                
    //             const chatroomDoc = await transaction.get(ref);
    //             const currentUserEmail = currentUserDoc.data().email;
    
    //             if(!currentUserDoc.exists()){
    //                 throw "User document does not exist!";
    //             }
    
                
    //             let copyOfUserChatrooms = currentUserDoc.data().chatrooms;
    //             let index = -1;
    //             for(let i = 0; i < copyOfUserChatrooms.length; i++){
    //                 if(ref.id === copyOfUserChatrooms[i].id){
    //                     index = i;
    //                 }
    //             }
    //             console.log(index);
        
    //             if(index > -1) {
    //                 copyOfUserChatrooms.splice(index, 1);
    //                 transaction.update(currentUserRef, {
    //                     chatrooms: copyOfUserChatrooms,
    //                 })
    //             }else{
    //                 return Promise.reject("Sorry! Chatroom reference doesn't exist");
    //             }
    
    //             if(!chatroomDoc.exists()){
    //                 throw "Chatroom document does not exist!";
    //             }
    
    //             let leftParticipants = chatroomDoc.data().participants.length;
    //             if( leftParticipants === 1){
    //                 console.log("You are the last one in chatroom...\nTherefore, deleting this chatroom...");
    //                 transaction.delete(ref);
    //             }else if( leftParticipants > 1){
    //                 let copyOfParticipants = chatroomDoc.data().participants;
    //                 let temp = copyOfParticipants.indexOf(currentUserEmail);
    //                 console.log(temp);
    //                 if( temp > -1) {
    //                     copyOfParticipants.splice(temp, 1);
    //                     transaction.update(ref, {
    //                         participants: copyOfParticipants,
    //                     })
    //                 }else{
    //                     return Promise.reject("Sorry! User reference doesn't exist");
    //                 }
    //             }else{
    //                 throw "Please check number of participants"
    //             }
                
    
    //         });
    
    //         console.log("Transaction successfully committed!");
    //         return true;
    //     }catch(error){
    //         console.error(error);
    //         return false;
    //     }

    //     if(await DBHelper.deleteChatroom(chatModel, user) === false){
    //         // TO DO:
    //         return false;
    //     }
    //     return true;
    // }

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