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
        UPLOADED: "uploadedImageType",
    }
    constructor(ref, imageType, storageUrl, oDownloadUrl, sDownloadUrl) {
        this._collectionType = DBCollectionType.IMAGE;
        this._ref = ref;
        this._imageType = imageType;

        this._storageUrl = storageUrl;
        this._oDownloadUrl = oDownloadUrl;
        this._sDownloadUrl = sDownloadUrl;
    }

    static newModel(oDownloadUrl, sDownloadUrl) {
        return new ImageModel(null, ImageModel.TYPE.NEW, null, oDownloadUrl, sDownloadUrl);
    }

    static newModelByData(data) {
        try {
            return new ImageModel(data.ref, data.storageUrl, data.oDownloadUrl, data.sDownloadUrl);
        }
        catch {
            return null;
        }
    }

    // ------------- Get / Set ---------------
    setStorageUrl = (storageUrl) => this._storageUrl = storageUrl;
    setODownloadUrl = (oDownloadUrl) => this._oDownloadUrl = oDownloadUrl;
    setSDownloadUrl = (sDownloadUrl) => this._sDownloadUrl = sDownloadUrl;

    // ----------------------------------------

    static async refsToModels(refs) {
        let imageModels = [];
        for (let ref of refs) {
            let model = this.loadData(ref);
            if (model === null) return null;

            imageModels.push(model);
        }
        return imageModels;
    }

    static async loadData(ref) {
        let result = [];
        if (await DBHelper.loadDataByRef(ref, result) === false) {
            return null;
        }
        result = result[0] // Should be only one exists.
        return new ImageModel(result.ref, result.storageUrl, result.oDownloadUrl, result.sDownloadUrl);
    }

    async addData(userEmail) {
        await this._uploadImageToStorage(userEmail);

        if (this.isReadyToSave() === false) return false;
        let ref = [];
        if (await DBHelper.addDataTemp(this._collectionType, this.getData(), /*OUT*/ ref) === false) return false;

        this._ref = ref[0];

        return true;
    }

    async deleteData() {
        if (this._ref === null) return false;

        return await DBHelper.deleteData(this._ref);
    }

    async _uploadImageToStorage(userEmail) {
        try {
            this._oDownloadUrl = await DBHelper.asyncUploadImageToStorage(/*pickerURL*/ this._sDownloadUrl, userEmail);
            this._sDownloadUrl = await DBHelper.asyncUploadImageToStorage(/*pickerURL*/ this._sDownloadUrl, userEmail);

            return true;
        }
        catch(error) {
            console.log(error);
            return false;
        }
    }

    // ------------- Validation --------------------

    isReadyToSave() {
        return !!(this._oDownloadUrl && this._sDownloadUrl)
    }

    getData() {
        return ({
            storageUrl: this._storageUrl,
            oDownloadUrl: this._oDownloadUrl,
            sDownloadUrl: this._sDownloadUrl,
        })
    }

    isEqual(model) {
        return (
            this._ref === model._ref &&
            this._storageUrl === model._storageUrl &&
            this._oDownloadUrl === model._oDownloadUrl &&
            this._sDownloadUrl === model._sDownloadUrl
        )
    }
}