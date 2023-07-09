import {createURL, DBCollectionType, LOG_ERROR, PageMode, StorageDirectoryType} from "../utils/utils";
import DBHelper from "../helpers/DBHelper";
import {runTransaction} from "firebase/firestore";
import {db, storage} from "../firebase";
import ImageModel from './ImageModel';

/*----------DB COLLECTION STRUCT----------------
{
    imageRefs: [ref1, ref2, ... ]
    email: "email@stonybrook,edu"
    title: ""
    price: ""
    info: ""
}
----------------------------------------------*/

export default class PostModel {
    constructor(doc_id, ref, imageRefs, imageModels, title, price, info, email) {
        this.doc_id = doc_id;
        this.ref = ref;
        this.collectionType = DBCollectionType.POSTS;

        this.imageRefs = imageRefs;
        this.imageModels = imageModels;
        this.newImageModels = [];         // Added in the runtime.
        this.removedImageModels = [];     // Added in the runtime.
        this.title = title;
        this.price = price
        this.info = info;
        this.email = email;
    }

    static newEmpty() {
        return new PostModel([], "", [], [], "", "", "", "");
    }

    static newModel(imageModels, title, price, info, email) {
        return new PostModel(imageModels, title, price, info, email)
    }

    // ---------------- Get / Set --------------------
    setDocId = (doc_id) => this.doc_id = doc_id;
    setRef = (ref) => this.ref = ref;
    setImageRefs = (refs) => this.imageRefs = refs;
    setTitle = (title) => this.title = title;
    setPrice = (price) => this.price = price;
    setInfo = (info) => this.info = info;
    setEmail = (email) => this.email = email;

    // ------------------------------------------------

    static async loadData(doc) {

    }

    static async loadAllData(dest) {
        let dataList = []
        if (await DBHelper.loadAllData(DBCollectionType.POSTS, /* OUT */ dataList) === false) return false;

        for (let data of dataList) {
            let postModel = await this._dataToModel(data);
            if (postModel === null) return false;

            dest.push(postModel);
        }
        return true;
    }

    static async loadAllPostsByUser(currentUserRef, dest) {
        let userData = []
        if (await DBHelper.loadDataByRef(currentUserRef, /* OUT */ userData) === false) {
            // TO DO:
            return false;
        }
        userData = userData[0];

        if (userData.posts.length === 0) {
            console.log("No chatrooms")
            return true;
        }

        for (let i = 0; i < userData.posts.length; i++) {
            let data = [];
            if (await DBHelper.loadDataByRef(userData.posts[i], data) === false) {
                // TO DO:
                return false;
            }
            dest.push(data[0]);
        }
        return true;
    }

    static async _dataToModel(data) {
        if (this._isLoadDataValid(data) === false) {
            return null;
        }

        let imageModels = await ImageModel.refsToModels(data.imageRefs);
        if (imageModels === null) return null;

        return new PostModel(data.doc_id, data.ref, data.imageRefs, imageModels, data.title, data.price, data.info, data.email)
    }

    async updateData() {
        if (this.isContentReady() === false) return false;
        if (this.ref === null) return false;

        return await DBHelper.updateData(this.ref, this.getData());
    }

    // handleDeletedImages() {
    //     const removeImages = this.prevDownloadUrls.filter((pi) => {
    //         for (let ni in this.imageRefs) {
    //             if (this.isImageSame(pi, ni)) {
    //                 return false;
    //             }
    //         }
    //         return true;
    //     })
    //
    //     let dir = createURL(StorageDirectoryType.POST_IMAGES, this.email);
    //     let ref = ref(storage, dir);
    //     ref.getReferenceFromUrl(url);
    //     storageRef.getReferenceFromUrl(url)
    // }

    async addData() {
        if (this.isContentReady() === false) return false;

        return await DBHelper.addData(this.collectionType, this.getData());
    }

    async deleteData() {
        if (this.ref === null) return false;

        return await DBHelper.deleteData(this.ref);
    }


    async tSavePost(imageModels) {
        try {
            this.preprocessImageModels(imageModels);

            if (await this._uploadImagesToStorage() === false)  return false;

            if (this.ref) return await this.updateData()

            else return await this.addData();
        }
        catch (err) {
            return false;
        }
    }

    preprocessImageModels(imageModels) {
        this.newImageModels = imageModels.filter((model) => model.imageType === ImageModel.TYPE.NEW)

        this.removedImageModels = this.imageModels.filter((_model) => {
            for (let model of imageModels) {
                if (_model.isEqual(model))
                    return false;
            }
            return true;
        })

        this.imageRefs = this.imageRefs.filter((ref) => {
            for (let model of this.removedImageModels) {
                if (ref === model.ref) {
                    return false;
                }
            }
            return true;
        })
    }

    async _uploadImagesToStorage() {
        if (this.email === null) return false;

        for (let imageModel of this.newImageModels) {
            if (await imageModel.asyncAddData(this.email) === false) return false; // Upload image to Storage.
            this.imageRefs.push(imageModel.ref);
        }
        return true;
    }

    getData() {
        return {
            title: this.title,
            price: this.price,
            info: this.info,
            imageRefs: this.imageRefs,
            email: this.email,
        }
    }

    isContentReady() {
        return (
            this.imageRefs !== null &&
            this.title !== null &&
            this.price !== null &&
            this.info !== null
        );
    }

    static _isLoadDataValid(data) {
        return !!(data.doc_id && data.imageRefs && data.title && data.price && data.info && data.email);
    }
}
