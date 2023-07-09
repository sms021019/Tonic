import DBHelper from "../helpers/DBHelper";
import {DBCollectionType, ModelStatusType} from "../utils/utils";
import {doc} from "firebase/firestore";
import {db} from "../firebase";


/*----------DB COLLECTION STRUCT----------------
{
    oStorageUrl: "yong@stonybrook.edu/123123123123.png",
    sStorageUrl: "yong@stonybrook.edu/123123123212.png",
    oDownlaodUrl: "...",
    sDownloadUrl: "...",
}
----------------------------------------------*/

export default class ImageModel {
    constructor(_type, ref, oStorageUrl, sStorageUrl, oDownloadUrl, sDownloadUrl) {
        this.collectionType = DBCollectionType.IMAGE;
        this._type = _type;

        this.ref = ref;
        this.oStorageUrl = oStorageUrl;
        this.sStorageUrl = sStorageUrl;
        this.oDownloadUrl = oDownloadUrl;
        this.sDownloadUrl = sDownloadUrl;
    }

    static newModel(oDownloadUrl, sDownloadUrl) {
        return new ImageModel(ModelStatusType.NEW,null, null, null, oDownloadUrl, sDownloadUrl);
    }

    static async refsToModels(refs) {
        let imageModels = [];
        for (let ref of refs) {
            let model = await this.asyncLoadData(ref);
            if (model === null) return null;

            imageModels.push(model);
        }
        return imageModels;
    }

    static async asyncLoadData(ref) {
        let data = [];
        if (await DBHelper.loadDataByRef(ref, data) === false) {
            return null;
        }
        data = data[0] // Should be only one exists.
        return new ImageModel(ModelStatusType.LOADED, data.ref, data.oStorageUrl, data.sStorageUrl, data.oDownloadUrl, data.sDownloadUrl);
    }

    async bAsyncSetData(batch, userEmail) {
        if (await this.asyncUploadImageToStorage(userEmail) === false) return false;
        if (this.isReadyToSave() === false) return false;

        this.ref = DBHelper.getNewRef(this.collectionType);
        batch.set(this.ref, this.getData());

        return true;
    }

    async bAsyncDeleteData(batch) {
        if (this._type === ModelStatusType.NEW) return true; // Nothing to delete.
        if (this.ref === null) return false;

        if(await this.asyncDeleteImageFromStorage() === false) return false;

        batch.delete(this.ref);
    }

    async asyncDeleteImageFromStorage() {
        if (await DBHelper.asyncDeleteImageFromStorage(this.oStorageUrl) === false) return false;
        if (await DBHelper.asyncDeleteImageFromStorage(this.sStorageUrl) === false) return false;
        return true;
    }

    async asyncUploadImageToStorage(userEmail) {
        try {
            const oResult = await DBHelper.asyncUploadImageToStorage(/*pickerURL*/ this.oDownloadUrl, userEmail);
            this.oStorageUrl = oResult.storageUrl;
            this.oDownloadUrl = oResult.downloadUrl;

            const sResult = await DBHelper.asyncUploadImageToStorage(/*pickerURL*/ this.sDownloadUrl, userEmail);
            this.sStorageUrl = sResult.storageUrl;
            this.sDownloadUrl = sResult.downloadUrl;

            return true;
        }
        catch(error) {
            console.log(error);
            return false;
        }
    }
    // ------------- Validation --------------------

    isReadyToSave() {
        return !!(this.oDownloadUrl && this.sDownloadUrl)
    }

    getData() {
        return ({
            oStorageUrl: this.oStorageUrl,
            sStorageUrl: this.sStorageUrl,
            oDownloadUrl: this.oDownloadUrl,
            sDownloadUrl: this.sDownloadUrl,
        })
    }

    isEqual(model) {
        return (
            this.ref === model.ref &&
            this.oStorageUrl === model.oStorageUrl &&
            this.sStorageUrl === model.sStorageUrl &&
            this.oDownloadUrl === model.oDownloadUrl &&
            this.sDownloadUrl === model.sDownloadUrl
        )
    }
}