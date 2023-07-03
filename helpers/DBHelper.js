import {Transaction, addDoc, collection, getDocs, runTransaction, updateDoc, doc, arrayUnion, getDoc} from "firebase/firestore";
import {DBCollectionType, LOG_ERROR} from "../utils/utils";
import {db} from "../firebase";
export default class DBHelper {
    constructor() {
    }

    static async loadData() {

    }

    static async loadDataByRef(ref, dest) {
        try {
            if(ref) {
                const snapshot = await getDoc(ref);
                if(snapshot.exists()){
                    dest.push(snapshot.data());
                    return true;
                }
                else {
                    return false;
                }
            }
            else return false
        }
        catch(error) {
            // TO DO : handle error
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

    static async addData(collectionType, data) {
        try {
            if(collectionType === DBCollectionType.POSTS){
                console.log("Creating a new post...");
                //당장 계시물 추가하려면 사진이 있어야만 가능함
                const transactionResult = await runTransaction(db, async(transaction) => {
                    const newPostRef = doc(collection(db, collectionType));
                    transaction.set(newPostRef, data);
                
                    // transaction.update(doc(db, `/users/${data.email}`), {
                    transaction.update(doc(collection(db, DBCollectionType.USERS), data.email), {
                        posts: arrayUnion(newPostRef)
                    });

                    console.log("Transaction successfully committed!");
                    return true;
                });
                return transactionResult;

            }else if(collectionType === DBCollectionType.CHATROOMS){
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
            }
        }
        catch(error) {
            LOG_ERROR(collectionType, "Error occurs while adding data to DB.");
            return true;
        }
    }

    static async updateData(ref, data) {
        try {
            await updateDoc(ref, data);
            return true;
        }
        catch(error) {
            LOG_ERROR(ref, "Error occurs while updating data to DB.");
            return false;
        }
    }

    static async deleteData() {

    }
}