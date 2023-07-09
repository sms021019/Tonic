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
    constructor(ref, imageType, storageUrl, oDownloadUrl, sDownloadUrl) {
        this.collectionType = DBCollectionType.IMAGE;
        this.ref = ref;
        this.imageType = imageType;

        this.storageUrl = storageUrl;
        this.oDownloadUrl = oDownloadUrl;
        this.sDownloadUrl = sDownloadUrl;
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
    setStorageUrl = (storageUrl) => this.storageUrl = storageUrl;
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
        let result = [];
        if (await DBHelper.loadDataByRef(ref, result) === false) {
            return null;
        }
        result = result[0] // Should be only one exists.
        return new ImageModel(result.ref, this.TYPE.LOADED, result.storageUrl, result.oDownloadUrl, result.sDownloadUrl);
    }

    async asyncAddData(userEmail) {
        await this._uploadImageToStorage(userEmail);

        if (this.isReadyToSave() === false) return false;
        let ref = [];
        if (await DBHelper.addDataTemp(this.collectionType, this.getData(), /*OUT*/ ref) === false) return false;

        this.ref = ref[0];

        return true;
    }

    async deleteData() {
        if (this.ref === null) return false;

        return await DBHelper.deleteData(this.ref);
    }

    async _uploadImageToStorage(userEmail) {
        try {
            this.oDownloadUrl = await DBHelper.asyncUploadImageToStorage(/*pickerURL*/ this.oDownloadUrl, userEmail);
            this.sDownloadUrl = await DBHelper.asyncUploadImageToStorage(/*pickerURL*/ this.sDownloadUrl, userEmail);

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
            storageUrl: this.storageUrl,
            oDownloadUrl: this.oDownloadUrl,
            sDownloadUrl: this.sDownloadUrl,
        })
    }

    isEqual(model) {
        return (
            this.ref === model.ref &&
            this.storageUrl === model.storageUrl &&
            this.oDownloadUrl === model.oDownloadUrl &&
            this.sDownloadUrl === model.sDownloadUrl
        )
    }
}