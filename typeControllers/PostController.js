import DBHelper from "../helpers/DBHelper";
import {DBCollectionType, ModelStatusType} from "../utils/utils";
import UserModel from "../models/UserModel";
import {arrayUnion, writeBatch} from "firebase/firestore";
import {db} from "../firebase";
import {arrayRemove} from "@firebase/firestore";
import TimeHelper from "../helpers/TimeHelper";
import ImageModel from "../models/ImageModel";
import FirebaseHelper from "../helpers/FirebaseHelper";

export default class PostController {
    static async asyncAdd(post, ownerEmail) {
        if (!this.isValid(post)) return -1;

        try {
            let batch = writeBatch(db);

            let postId = await this.asyncAddPostActionToBatch(batch, post, ownerEmail);
            if (postId === -1) return -1;

            await batch.commit();
            return postId;
        }
        catch (err) {
            return -1;
        }
    }

    async asyncDelete() {
        // try {
        //     let batch = writeBatch(db);
        //     if (await this._bAsyncDeleteData(batch) === false) return false;
        //
        //     await batch.commit();
        //     return true;
        // }
        // catch (err) {
        //     return false;
        // }
    }

// -------------- BATCH POST --------------------
    static async asyncAddPostActionToBatch(batch, post, ownerEmail) {

        if (await this.asyncUploadPostImage(post.postImages, ownerEmail) === false) return -1;


        let dRef = FirebaseHelper.getNewRef(DBCollectionType.POSTS);
        console.log(post);
        batch.set(dRef, post);

        const userRef = FirebaseHelper.getRef(DBCollectionType.USERS, ownerEmail)
        batch.update(userRef, {posts: arrayUnion(dRef)});

        return dRef.id;
    }

    static async asyncUploadPostImage(postImages, ownerEmail) {
        try {
            for (let postImage of postImages) {
                const resultLow = await FirebaseHelper.asyncUploadImageToStorage(postImage.downloadUrlLow, ownerEmail);
                const resultMid = await FirebaseHelper.asyncUploadImageToStorage(postImage.downloadUrlMid, ownerEmail);
                postImage.downloadUrlLow = resultLow.downloadUrl;
                postImage.downloadUrlMid = resultMid.downloadUrl;
                postImage.storageUrlLow = resultLow.storageUrl;
                postImage.storageUrlMid = resultMid.storageUrl;
            }
            return true
        }
        catch(err) {
            return false
        }
    }

    // async _bAsyncUpdateData(batch) {
    //     if (this.isContentReady() === false) return false;
    //     if (this.ref === null) return false;
    //
    //     if (await this._bAsyncSetImageModels(batch, this.newImageModels) === false) return false;
    //     if (await this._bAsyncRemoveImageModels(batch, this.removedImageModels) === false) return false;
    //
    //     batch.update(this.ref, this.getData());
    //
    //     return true;
    // }
    //
    // async _bAsyncDeleteData(batch) {
    //     if (this.ref === null) return false;
    //
    //     if (await this._bAsyncRemoveImageModels(batch, this.imageModels) === false) return false;
    //
    //     batch.delete(this.ref);
    //
    //     const userRef = DBHelper.getRef(DBCollectionType.USERS, this.email)
    //     batch.update(userRef, {posts: arrayRemove(this.ref)});
    //
    //     return true;
    // }

    static isValid(post) {
        if (!post) return false;
        if (!post.title || !post.price || !post.info || !post.postImages) return false;
        if (post.title === "" || post.price < 0 || post.info === "") return false;

        return true;
    }

    static postToJson(post) {
        return {
            title: post.title,
            price: post.price,
            info: post.info,
            postTime: post.postTime,
            postImages: this.postImagesToJson(post.postImages)
        }
    }

    static postImagesToJson(postImages) {
        let result = []
        for (let postImage of postImages) {
            result.push({
                downloadUrlLow: postImage.downloadUrlLow,
                downloadUrlMid: postImage.downloadUrlMid,
                storageUrlLow: postImage.storageUrlLow,
                storageUrlMid: postImage.storageUrlMid
            })
        }
        return result;
    }
}
