
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
import {deleteObject, ref} from "firebase/storage";


export default class FirebaseHelper {

    static getNewRef(type) {
        return doc(collection(db, type));
    }

    static getRef(type, docId) {
        return doc(collection(db, type), docId);
    }

    static async addDoc(type, docId, data) {
        try {
            let dRef = doc(collection(db, type), docId);
            await setDoc(dRef, data);
            return true;
        }
        catch(error) {
            console.log("Err: FirebaseHelper.addDocByRef");
            return false;
        }
    }

    static async getDocIds(collectionType) {
        const cRef = collection(db, collectionType);

        const q = query(cRef);

        const snapshots = await getDocs(q);

        return snapshots.docs.map((doc) => doc.id);
    }

    static async getDocIdsByCollectionRef(collectionRef) {
        const q = query(collectionRef);
        
        const snapshots = await getDocs(q);

        return snapshots.docs.map((doc) => doc.id);
    }

    /**
     *
     * @param collectionType
     * @param id
     * @returns {Promise<DocumentData|null>}
     */
    static async getDocDataById(collectionType, id) {
        try {
            const dRef = doc(collection(db, collectionType), id);
            const _doc = await getDoc(dRef);
            if (!_doc.data()) return null;
            return _doc.data();
        }
        catch (e) {
            console.log("Err: FirebaseHelper.getDocDataById");
            return null
        }
    }
    
    // chatroomHeader 콜랙션에서 문서 읽기 위해서 임시로 만든 함수
    static async getDocDataByCollectionRefAndId(collectionRef, id) {
        try{
            const dRef = doc(collectionRef, id);
            const _doc = await getDoc(dRef);
            if(!_doc.data()) return null;
            return _doc.data();
        }catch (e) {
            console.log("Err FirebaseHelper.getDocDataByCollectionRefAndId");
            return null
        }
    }

    static async updateDoc(collectionType, id, data) {
        try {
            console.log(collectionType, id, data);
            const dRef = this.getRef(collectionType, id);
            await updateDoc(dRef, data);
            return true;
        }
        catch (e) {
            console.log(e, "Err: FirebaseHelper.updateDoc");
            return false;
        }
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
}
