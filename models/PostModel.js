import {DBCollectionType} from "../utils/utils";
import DBHelper from "../helpers/DBHelper";

export default class PostModel {
    constructor(imageDownloadUrls, title, price, info, user, email) {
        this.ref = null;
        this.collectionType = DBCollectionType.POSTS;

        this.imageDownloadUrls = imageDownloadUrls;
        this.title = title;
        this.price = price;
        this.info = info;
        this.user = user;
        this.email = email;
    }
    setRef(ref) {
        this.ref = ref;
    }

    isValid() {
        return true;
    }
    static loadData(doc) {

    }

    async updateData() {
        if (this.isValid() === false) return false;
        if (this.ref == null) return false;

        let result = await DBHelper.updateData(this.ref, this.getData());
        return result;
    }

    async saveData() {
        if (this.isValid() === false) return false;

        let result = await DBHelper.addData(this.collectionType, this.getData());
        return result;
    }

    getData() {
        return {
            title: this.title,
            price: Number(this.price),
            info: this.info,
            imageDownloadUrls: this.imageDownloadUrls,
            user: this.user,
            email: this.email,
        }
    }
}