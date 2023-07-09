import {createURL, DBCollectionType, LOG_ERROR, PageMode, StorageDirectoryType} from "../utils/utils";
import DBHelper from "../helpers/DBHelper";
import {runTransaction} from "firebase/firestore";
import {db, storage} from "../firebase";
import ImageModel from './ImageModel';
import TimeHelper from "../helpers/TimeHelper";

/*----------DB COLLECTION STRUCT----------------
{
    imageRefs: [ref1, ref2, ... ]
    postTime: Time
    email: "email@stonybrook,edu"
    title: ""
    price: ""
    info: ""
}
----------------------------------------------*/

export default class PostModel {
    constructor(doc_id, ref, imageRefs, imageModels, title, price, info, email, postTime) {
        this.doc_id = doc_id;
        this.ref = ref;
        this.collectionType = DBCollectionType.POSTS;

        this.imageRefs = imageRefs;
        this.prevImageModels = [...imageModels];
        this.imageModels = imageModels;
        this.newImageModels = [];         // Added in the runtime.
        this.removedImageModels = [];     // Added in the runtime.
        this.title = title;
        this.price = price
        this.info = info;
        this.email = email;
        this.postTime = postTime;
    }

    static newEmpty() {
        return new PostModel("", "", [], [], "", "", "", "", 0);
    }

    static newModel(imageModels, title, price, info, email) {
        return new PostModel("", "", [], imageModels, title, price, info, email, 0)
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

        return new PostModel(data.doc_id, data.ref, data.imageRefs, imageModels, data.title, data.price, data.info, data.email, data.postTime)
    }

    async updateData() {
        if (this.isContentReady() === false) return false;
        if (this.ref === null) return false;

        return await DBHelper.updateData(this.ref, this.getData());
    }

    async addData() {
        if (this.isContentReady() === false) return false;
        this.postTime = TimeHelper.getTimeNow();
        return await DBHelper.addData(this.collectionType, this.getData());
    }

    async deleteData() {
        if (this.ref === null) return false;

        return await DBHelper.deleteData(this.ref);
    }

    // ---------------- Task -------------------------
    async tSavePost(imageModels) {
        try {
            this._preprocessImageModels(imageModels);

            if (await this._uploadImagesToStorage() === false)  return false;

            if (this.ref) return await this.updateData()

            else return await this.addData();
        }
        catch (err) {
            return false;
        }
    }
    // ------------------------------------------------
    _preprocessImageModels(imageModels) {
        this.newImageModels = imageModels.filter((model) => model.imageType === ImageModel.TYPE.NEW)
        let loadedImageModels = imageModels.filter((model) => model.imageType === ImageModel.TYPE.LOADED)
        this.removedImageModels = this.prevImageModels.filter((_model) => {
            for (let model of imageModels) {
                if (_model.isEqual(model))
                    return false;
            }
            return true;
        })

        this.imageRefs = loadedImageModels.map((model) => model.ref);
    }

    async _uploadImagesToStorage() {
        if (this.email === null) return false;

        for (let imageModel of this.newImageModels) {
            if (await imageModel.asyncAddData(this.email) === false) return false; // Upload image to Storage.
            this.imageRefs.push(imageModel.ref);
        }
        return true;
    }

    getElapsedString() {
        return TimeHelper.getTopElapsedStringUntilNow(this.postTime);
    }

    getData() {
        return {
            title: this.title,
            price: this.price,
            info: this.info,
            imageRefs: this.imageRefs,
            email: this.email,
            postTime: this.postTime,
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
        return !!(data.doc_id && data.imageRefs && data.title && data.price && data.info && data.email && data.postTime);
    }
}
