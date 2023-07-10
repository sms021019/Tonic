import {
    Transaction,
    addDoc,
    collection,
    getDocs,
    runTransaction,
    updateDoc,
    deleteDoc,
    doc,
    arrayUnion,
    getDoc,
    setDoc,
} from "firebase/firestore";
import {createURL, DBCollectionType, LOG_ERROR, StorageDirectoryType} from "../utils/utils";
import {db, getDownloadURL, storage, uploadBytesResumable} from "../firebase";
import {ref, deleteObject} from "firebase/storage";
import TimeHelper from "./TimeHelper";
export default class DBHelper {
    constructor() {
    }

    static async getCollectionRefByName(name, dest) {
        try {
            if(name) {
                let ref = collection(db, name);
                dest.push(ref);
                return true
            }
            else return false
        }
        catch(error) {
            LOG_ERROR(name , `Error occurs while getting ${name} collection reference from the DB.`);
            return false
        }
    }

    static async getDocRefById(collectionName, id, dest) {
        try {
            if(collectionName && id) {
                let collectionRef = [];
                if(this.getCollectionRefByName(collectionName, /* OUT */ collectionRef) === false){
                    // TO DO
                    console.log("Can't find collection ref!")
                    return false;
                }else{
                    collectionRef = collectionRef[0];
                }

                let ref = doc(collectionRef, id);
                dest.push(ref);
                return true
            }
            else return false
        }
        catch(error) {
            LOG_ERROR(id , `Error occurs while getting ${id} document reference from the given collection ref.`);
            return false
        }
    }

    static async loadDataByRef(ref, dest) {
        try {
            if (ref) {
                const snapshot = await getDoc(ref);
                if (snapshot.exists()) {
                    let data = snapshot.data();
                    data["doc_id"] = snapshot.id;
                    data["ref"] = snapshot.ref;
                    dest.push(data);
                    return true;
                }
                else return false;
            }
            return false
        }
        catch(error) {
            LOG_ERROR(ref?.id , "Error occurs while loading data from the DB.");
            return false
        }
    }

    static async loadAllData(collectionType, dest = []) {
        try {
            let snapshot = await getDocs(collection(db, collectionType));
            snapshot.forEach((doc) => {
                let data = doc.data();
                data["doc_id"] = doc.id;
                data["ref"] = doc.ref;
                dest.push(data);
            });
            return true;
        }
        catch(error) {
            return false;
        }
    }

    static async addDataTemp(collectionType, data, /*OUT*/ ref = []) {
        try {
            let _ref = doc(collection(db, collectionType));
            await setDoc(_ref, data);
            ref.push(_ref);
        }
        catch(error) {
            LOG_ERROR(collectionType, "Error occurs while adding data to DB.");
            return false;
        }
    }

    static async addData(collectionType, data) {
        try {
            if(collectionType === DBCollectionType.CHATROOMS){
                console.log("Creating a new chatroom...");
                const transactionResult = await runTransaction(db, async(transaction) => {
                    const oppUserDoc = await transaction.get(data.opponentRef);
                    if(!oppUserDoc.exists()){
                        throw "Opponent does not exist!";
                    }
                    if(oppUserDoc.data().email === data.user.email){
                        throw "Can\'t make room by yourself!";
                    }
                    
                    const chatroomsCol = collection(db, DBCollectionType.CHATROOMS);
                    const chatroomRef = doc(chatroomsCol);
                    // const chatroomId = chatroomRef.id;
                    const chatroom = {
                        ref: chatroomRef,
                        participants: [oppUserDoc.data().email, data.user.email]
                    }
    
                    transaction.set(chatroomRef, chatroom);
    
                    transaction.update(data.opponentRef, {
                        chatrooms: arrayUnion(chatroomRef)
                    });
    
                    transaction.update(doc(collection(db, DBCollectionType.USERS), data.user.email), {
                        chatrooms: arrayUnion(chatroomRef)
                    });
    
                    console.log("Transaction successfully committed!");
                    return chatroomRef;
                });
                return transactionResult;
            }else if(collectionType === DBCollectionType.USERS){
                console.log("Creating a new user...");
                const transactionResult = await runTransaction(db, async (transaction) => {
                    let usersCollectionRef = [];
                    if(this.getCollectionRefByName(collectionType, usersCollectionRef) === false){
                        //TO DO
                        LOG_ERROR(collectionType, "Error occurs while finding reference of collection from DB.");
                        return false;
                    }
                    else {
                        usersCollectionRef = usersCollectionRef[0];
                    }
                    
                    transaction.set(doc(usersCollectionRef, data.email), data);

                    console.log("Transaction successfully committed!")
                    return true;

                });
                return transactionResult;
            }

        }
        catch(error) {
            LOG_ERROR(collectionType, "Error occurs while adding data to DB.");
            return false;
        }
    }

    static async updateData(ref, data) {
        console.log("updating document...")
        try {
            await updateDoc(ref, data);
            console.log("updated success!")
            return true;
        }
        catch(error) {
            LOG_ERROR(ref, "Error occurs while updating data to DB.");
            return false;
        }
    }

    static async deleteData(ref) {
        try {
            await deleteDoc(ref);
            return true;
        }
        catch (error) {
            LOG_ERROR(ref, "Error occurs while delete data.");
            return false;
        }
    }

    static async deleteChatroom(ref, user) {
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
    }

/*----------------------
    POSTING-RELATED
-----------------------*/
    static async _asyncCreateBlobByImageUri(imageUri) {
        return await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function () {
                reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', imageUri, true);
            xhr.send(null);
            return true;
        }).catch((e) => {
            LOG_ERROR(e, "Fail to convert imageURI into Blob.");
            return false;
        });
    }

    static async asyncUploadImageToStorage(uri, userEmail) {
        try {
            const blob = await this._asyncCreateBlobByImageUri(uri);
            if (blob === false) return false;

            const storageUrl = createURL(StorageDirectoryType.POST_IMAGES, userEmail, TimeHelper.getTimeNow());

            const storageRef = ref(storage, storageUrl);
            if (storageRef === null) return false;

            await uploadBytesResumable(storageRef, blob);

            const downloadUrl = await getDownloadURL(storageRef);

            return {storageUrl: storageUrl, downloadUrl: downloadUrl};
        }
        catch(error) {
            console.log("Error occurs while upload Image to Storage.");
            return null;
        }
    }

    static async asyncDeleteImageFromStorage(url) {
        try {
            let _ref = ref(storage, url);
            await deleteObject(_ref);
            return true;
        }
        catch(error) {
            console.log("Error occurs while delete image from Storage.");
            return false;
        }
    }

    static getNewRef(type) {
        return doc(collection(db, type));
    }

    static getRef(type, docId) {
        return doc(collection(db, type), docId);
    }
}