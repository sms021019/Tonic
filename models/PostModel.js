import {DBCollectionType} from "../utils/utils";
import DBHelper from "../helpers/DBHelper";

export default class PostModel {
    constructor(imageDownloadUrls, title, price, info, email) {
        this.doc_id = null;
        this.ref = null;
        this.collectionType = DBCollectionType.POSTS;

        this.imageDownloadUrls = imageDownloadUrls;
        this.title = title;
        this.price = Number(price); // Todo : valid check
        this.info = info;
        this.email = email;
    }

    setDocId = (doc_id) => this.doc_id = doc_id;
    setRef = (ref) => this.ref = ref;
    setImageDownloadUrls = (setImageDownloadUrls) => this.setImageDownloadUrls = setImageDownloadUrls;
    setTitle = (title) => this.title = title;
    setPrice = (price) => this.price = price;
    setInfo = (info) => this.info = info;
    setUserEmail = (email) => this.email = email;

    static async loadData(doc) {

    }

    static async loadAllData(dest) {
        let dataList = []
        let loadState = await DBHelper.loadAllData(DBCollectionType.POSTS, /* OUT */ dataList);
        if (loadState === false || dataList.length === 0) {
            return false;3
        }

        for (let i = 0; i < dataList.length; i++) {
            let postModel = this.createModelByDBData(dataList[i]);
            if (postModel === null) return false;

            dest.push(postModel);
        }
        return true;
    }

    static createModelByDBData(data) {
        if (this.isLoadDataValid(data) === false) {
            console.log("Data is not valid");
            return null;
        }

        let postModel = new PostModel(data.imageDownloadUrls, data.title, data.price, data.info, data.email)
        postModel.setDocId(data.doc_id);
        postModel.setRef(data.ref);
        return postModel
    }
    async updateData() {
        if (this.isValid() === false) return false;
        if (this.ref == null) return false;

        return await DBHelper.updateData(this.ref, this.getData());
    }

    async saveData() {
        if (this.isValid() === false) return false;

        return await DBHelper.addData(this.collectionType, this.getData());
    }

    getData() {
        return {
            title: this.title,
            price: Number(this.price),
            info: this.info,
            imageDownloadUrls: this.imageDownloadUrls,
            email: this.email,
        }
    }

    isValid() {
        return true;
    }

    static isLoadDataValid(data) {
        if (
            data.doc_id === null ||
            data.imageDownloadUrls === null ||
            data.title === null ||
            data.price === null ||
            data.info === null ||
            data.email === null
        ) {
            return false;
        }
        else {
            return true;
        }
    }
}
