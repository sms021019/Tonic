import {addDoc, collection, getDocs, updateDoc} from "firebase/firestore";
import {DBCollectionType, LOG_ERROR} from "../utils/utils";
import {db} from "../firebase";
export default class DBHelper {
    constructor() {
    }

    static async loadData(collectionType, id) {

    }

    static async loadAllData(collectionType, dest = []) {
        try {
            let snapshot = await getDocs(collection(db, DBCollectionType.POSTS));

            snapshot.forEach((doc) => {
                let data = doc.data();
                data["docId"] = doc.id;
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
            await addDoc(collection(db, collectionType), data);
            return true;
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