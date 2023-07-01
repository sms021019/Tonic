import {DBCollectionType} from "../utils/utils";
import DBHelper from "../helpers/DBHelper";

export default class PostModel {
    constructor(imageDownloadUrls, title, price, info, email) {
        this.id = null;
        this.ref = null;
        this.collectionType = DBCollectionType.POSTS;

        this.imageDownloadUrls = imageDownloadUrls;
        this.title = title;
        this.price = Number(price); // Todo : valid check
        this.info = info;
        this.userEmail = email;
    }
    setRef(ref) {
        this.ref = ref;
    }

    isValid() {
        return true;
    }
    static loadData(doc) {

    }

    static async loadAllData() {
        let dest = []
        let result = await DBHelper.loadAllData(DBCollectionType.POSTS, dest);
        console.log(dest);
        return result;
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
            email: this.userEmail,
        }
    }
}