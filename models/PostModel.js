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
        this._doc_id = doc_id;
        this._ref = ref;
        this._collectionType = DBCollectionType.POSTS;

        this._imageRefs = imageRefs;
        this._imageModels = imageModels;
        this._newImageModels = [];         // Added in the runtime.
        this._removedImageModels = [];     // Added in the runtime.
        this._title = title;
        this._price = price
        this._info = info;
        this._email = email;

    }
    static newEmpty() {
        return new PostModel([], "", [], [], "", "", "", "");
    }

    static newModel(imageModels, title, price, info, email) {
        return new PostModel(imageModels, title, price, info, email)
    }

    // ---------------- Get / Set --------------------
    setDocId = (_doc_id) => this._doc_id = _doc_id;
    setRef = (ref) => this._ref = ref;
    setImageRefs = (refs) => this._imageRefs = refs;
    setTitle = (title) => this._title = title;
    setPrice = (price) => this._price = price;
    setInfo = (info) => this._info = info;
    setEmail = (email) => this._email = email;

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
        if (this._ref === null) return false;

        return await DBHelper.updateData(this._ref, this.getData());
    }

    // handleDeletedImages() {
    //     const removeImages = this.prevDownloadUrls.filter((pi) => {
    //         for (let ni in this._imageRefs) {
    //             if (this.isImageSame(pi, ni)) {
    //                 return false;
    //             }
    //         }
    //         return true;
    //     })
    //
    //     let dir = createURL(StorageDirectoryType.POST_IMAGES, this._email);
    //     let ref = ref(storage, dir);
    //     ref.getReferenceFromUrl(url);
    //     storageRef.getReferenceFromUrl(url)
    // }

    async addData() {
        if (this.isContentReady() === false) return false;

        return await DBHelper.addData(this._collectionType, this.getData());
    }

    async deleteData() {
        if (this._ref === null) return false;

        return await DBHelper.deleteData(this._ref);
    }


    async tSavePost(imageModels) {
        try {
            console.log("A")
            this.preprocessImageModels(imageModels);

            console.log("B")
            if (await this._uploadImagesToStorage() === false)  return false;

            console.log("C")
            if (this._ref) return await this.updateData()

            else return await this.addData();
        }
        catch (err) {
            return false;
        }
    }

    preprocessImageModels(imageModels) {
        this._newImageModels = imageModels.filter((model) => model._imageType === ImageModel.TYPE.NEW)

        this._removedImageModels = this._imageModels.filter((_model) => {
            for (let model of imageModels) {
                if (_model.isEqual(model))
                    return false;
            }
            return true;
        })

        this._imageRefs = this._imageRefs.filter((ref) => {
            for (let model of this._removedImageModels) {
                if (ref === model._ref) {
                    return false;
                }
            }
            return true;
        })
    }

    async _uploadImagesToStorage() {
        console.log("e")
        if (this._email === null) return false;
        console.log("f")
        for (let imageModel of this._newImageModels) {
            console.log("g")
            if (await imageModel.addData(this._email) === false) return false; // Upload image to Storage.
            this._imageRefs.push(imageModel._ref);
        }
        console.log("h")

        return true;
    }


    getData() {
        return {
            title: this._title,
            price: this._price,
            info: this._info,
            imageRefs: this._imageRefs,
            email: this._email,
        }
    }

    isContentReady() {
        return (
            this._imageRefs !== null &&
            this._title !== null &&
            this._price !== null &&
            this._info !== null
        );
    }

    static _isLoadDataValid(data) {
        return !!(data.doc_id && data.imageRefs && data.title && data.price && data.info && data.email);
    }
}
