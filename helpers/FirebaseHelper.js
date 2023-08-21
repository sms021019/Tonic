
import {
    collection,
    getDocs,
    runTransaction,
    updateDoc,
    deleteDoc,
    doc,
    arrayUnion,
    getDoc,
    setDoc, query,
} from "firebase/firestore";
import {db, getDownloadURL, storage, uploadBytesResumable} from '../firebase'
import {createURL, LOG_ERROR, StorageDirectoryType} from "../utils/utils";
import TimeHelper from "./TimeHelper";
import {ref} from "firebase/storage";


export default class FirebaseHelper {

    static getNewRef(type) {
        return doc(collection(db, type));
    }

    static getRef(type, docId) {
        return doc(collection(db, type), docId);
    }

    static async getDocIds(collectionType) {
        const cRef = collection(db, collectionType);

        const q = query(cRef);

        const snapshots = await getDocs(q);

        return snapshots.docs.map((doc) => doc.id);
    }

    /**
    * @returns {Promise<Post>} The fetched document data.
    */
    static async getDocDataById(collectionType, id) {
        const dRef = doc(collection(db, collectionType), id);
        const _doc = await getDoc(dRef);
        return /**@type Post*/ (_doc.data());
    }


    static async asyncUploadImageToStorage(uri, userEmail) {
        try {
            const blob = await this._asyncCreateBlobByImageUri(uri);
            if (blob === false) return false;

            const storageUrl = createURL(StorageDirectoryType.POST_IMAGES, userEmail, TimeHelper.getTimeNow());
            const storageRef = ref(storage, storageUrl);

            await uploadBytesResumable(storageRef, blob);

            const downloadUrl = await getDownloadURL(storageRef);

            return {storageUrl: storageUrl, downloadUrl: downloadUrl};
        }
        catch(error) {
            console.log("Error occurs while upload Image to Storage.");
            return null;
        }
    }

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

}
