import {DBCollectionType, ModelStatusType} from "../utils/utils";
import DBHelper from "../helpers/DBHelper";
import {doc} from "firebase/firestore";
import {db} from "../firebase";
import ImageModel from './ImageModel';
import TimeHelper from "../helpers/TimeHelper";
import { writeBatch } from "firebase/firestore";

/*----------DB COLLECTION STRUCT----------------
{
    imageRefs: [ref1, ref2, ... ]
    email: "email@stonybrook,edu"
    title: ""
    price: ""
    info: ""
    postTime: Time
}
----------------------------------------------*/

export default class PostModel {
    constructor(_type, doc_id, ref, imageRefs, imageModels, title, price, info, email, postTime) {
        this.collectionType = DBCollectionType.POSTS;
        this._type = _type;

        this.doc_id = doc_id;
        this.ref = ref;
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
        return new PostModel(ModelStatusType.NEW, "", "", [], [], "", "", "", "", 0);
    }

    // ---------------- Get / Set --------------------
    setDocId = (doc_id) => this.doc_id = doc_id;
    setRef = (ref) => this.ref = ref;
    setImageModels = (imageModels) => this.imageModels = imageModels;
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

        return new PostModel(ModelStatusType.LOADED, data.doc_id, data.ref, data.imageRefs, imageModels, data.title, data.price, data.info, data.email, data.postTime)
    }

// -------------- BATCH POST --------------------
    async bAsyncSetData(batch) {
        if (this.isContentReady() === false) return false;

        if (await this.bAsyncSetImageModels(batch, this.newImageModels) === false) return false;

        this.ref = DBHelper.getNewRef(this.collectionType);
        this.postTime = TimeHelper.getTimeNow();

        batch.set(this.ref, this.getData());
        return true;
    }

    async bAsyncUpdateData(batch) {
        if (this.isContentReady() === false) return false;
        if (this.ref === null) return false;

        if (await this.bAsyncSetImageModels(batch, this.newImageModels) === false) return false;
        if (await this.bAsyncRemoveImageModels(batch, this.removedImageModels) === false) return false;

        batch.update(this.ref, this.getData());
        return true;
    }

// -------------- BATCH IMAGES --------------------
    async bAsyncSetImageModels(batch, imageModels) {
        for (let model of imageModels) {
            if (await model.bAsyncSetData(batch, this.email) === false) return false;
            this.imageRefs.push(model.ref);
        }
        return true;
    }

    async bAsyncRemoveImageModels(batch, imageModels) {
        for (let model of imageModels) {
            if (await model.bAsyncDeleteData(batch) === false) return false;

        }
        return true;
    }

// ---------------- Task -------------------------
    async asyncSave() {
        this._preprocessImageModels();

        try {
            let batch = writeBatch(db);

            if (this._type === ModelStatusType.NEW) {
                if (await this.bAsyncSetData(batch) === false) return false;
            }
            else {
                if (await this.bAsyncUpdateData(batch) === false) return false;
            }

            await batch.commit();
        }
        catch (err) {
            return false;
        }
    }

    async asyncDelete() {
        // if (this.ref === null) return false;
        //
        // if (await this._asyncRemoveImageModels(this.imageModels) === false) return false;
        //
        // // TODO: remove post ref from the user.
        // return await DBHelper.deleteData(this.ref);
    }

// ------------------------------------------------
    _preprocessImageModels() {
        this.newImageModels = this.imageModels.filter((model) => model._type === ModelStatusType.NEW)
        this.removedImageModels = this.prevImageModels.filter((_model) => {
            for (let model of this.imageModels) {
                if (_model.isEqual(model))
                    return false;
            }
            return true;
        })

        let loadedImageModels = this.imageModels.filter((model) => model._type === ModelStatusType.LOADED)
        this.imageRefs = loadedImageModels.map((model) => model.ref);
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
