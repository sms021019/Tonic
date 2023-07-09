import DBHelper from "../helpers/DBHelper";
import {DBCollectionType} from "../utils/utils";



/*----------DB COLLECTION STRUCT----------------
{
    storageUrl: "yong@stonybrook.edu/123123123123.png",
    oDownlaodUrl: "...",
    sDownloadUrl: "...",
}
----------------------------------------------*/

export default class ImageModel {
    static TYPE = {
        NEW: "newImageType",
        LOADED: "loadedImageType",
    }
    constructor(ref, imageType, oStorageUrl, sStorageUrl, oDownloadUrl, sDownloadUrl) {
        this.collectionType = DBCollectionType.IMAGE;
        this.ref = ref;
        this.imageType = imageType;

        this.oStorageUrl = oStorageUrl;
        this.sStorageUrl = sStorageUrl;
        this.oDownloadUrl = oDownloadUrl;
        this.sDownloadUrl = sDownloadUrl;
    }

    static newModel(oDownloadUrl, sDownloadUrl) {
        return new ImageModel(null, ImageModel.TYPE.NEW, null, null, oDownloadUrl, sDownloadUrl);
    }

    static newModelByData(data) {
        try {
            return new ImageModel(data.ref, this.TYPE.LOADED, data.oStorageUrl, data.sStorageUrl, data.oDownloadUrl, data.sDownloadUrl);
        }
        catch {
            return null;
        }
    }

    // ------------- Get / Set ---------------
    setOStorageUrl = (oStorageUrl) => this.oStorageUrl = oStorageUrl;
    setSStorageUrl = (sStorageUrl) => this.sStorageUrl = sStorageUrl;
    setODownloadUrl = (oDownloadUrl) => this.oDownloadUrl = oDownloadUrl;
    setSDownloadUrl = (sDownloadUrl) => this.sDownloadUrl = sDownloadUrl;

    // ----------------------------------------

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
        return new ImageModel(data.ref, this.TYPE.LOADED, data.oStorageUrl, data.sStorageUrl, data.oDownloadUrl, data.sDownloadUrl);
    }

    async asyncAddData(userEmail) {
        await this._asyncUploadImageToStorage(userEmail);

        if (this.isReadyToSave() === false) return false;
        let ref = [];
        if (await DBHelper.addDataTemp(this.collectionType, this.getData(), /*OUT*/ ref) === false) return false;

        this.ref = ref[0];

        return true;
    }

    async asyncDeleteData() {
        if (this.imageType === ImageModel.TYPE.NEW) return true; // Nothing to delete.
        if (this.ref === null) return false;

        if(await this._asyncDeleteImageFromStorage() === false) return false;

        return await DBHelper.deleteData(this.ref);
    }

    async _asyncDeleteImageFromStorage() {
        if (await DBHelper.asyncDeleteImageFromStorage(this.oStorageUrl) === false) return false;
        if (await DBHelper.asyncDeleteImageFromStorage(this.sStorageUrl) === false) return false;
        return true;
    }

    async _asyncUploadImageToStorage(userEmail) {
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