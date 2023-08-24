import DBHelper from "../helpers/DBHelper";
import {DBCollectionType, ModelStatusType} from "../utils/utils";
import UserModel from "../models/UserModel";
import {arrayUnion, writeBatch} from "firebase/firestore";
import {db} from "../firebase";
import {arrayRemove} from "@firebase/firestore";
import FirebaseHelper from "../helpers/FirebaseHelper";

export default class PostController {
    static async asyncAdd(post) {
        if (!this.isValid(post)) return -1;

        try {
            let batch = writeBatch(db);

            if (await this.asyncSetAddPostActionToBatch(batch, post) === false) return false;

            await batch.commit();
            return true;
        }
        catch (err) {
            return false;
        }
    }

    static async asyncDelete(post) {
        try {
            let batch = writeBatch(db);
            if (await this.asyncSetDeletePostActionToBatch(batch, post) === false) return false;
            await batch.commit();

            if (await this.asyncDeletePostImagesFromStorage(post.postImages) === false) return false;
            console.log("Done: PostController.asyncDelete.")
            return true;
        }
        catch (err) {
            console.log("Err: PostController.asyncDelete")
            return false;
        }
    }

// -------------- BATCH POST --------------------
    /**
     *
     * @param batch
     * @param {Post }post
     * @returns {Promise<boolean>}
     *
     * This function will create and set new 'docId' to the post.
     */
    static async asyncSetAddPostActionToBatch(batch, post) {
        try {
            if (await this.asyncUploadPostImage(post.postImages, post.ownerEmail) === false) return false;

            let dRef = FirebaseHelper.getNewRef(DBCollectionType.POSTS);
            post.docId = dRef.id
            batch.set(dRef, post);

            const userRef = FirebaseHelper.getRef(DBCollectionType.USERS, post.ownerEmail)
            batch.update(userRef, {posts: arrayUnion(dRef)});

            return true;
        }
        catch(err) {
            return false;
        }
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

    /**
     *
     * @param batch
     * @param {Post} post
     * @returns {Promise<boolean>}
     */
    static async asyncSetDeletePostActionToBatch(batch, post) {
        try {
            const postRef = FirebaseHelper.getRef(DBCollectionType.POSTS, post.docId);
            batch.delete(postRef);

            const userRef = DBHelper.getRef(DBCollectionType.USERS, post.ownerEmail)
            batch.update(userRef, {posts: arrayRemove(postRef)});
            return true;
        }
        catch(e) {
            console.log("Err: PostController.asyncSetDeletePostActionToBatch")
            return false;
        }
    }

    /**
     *
     * @param {PostImage[]} postImages
     * @returns {Promise<boolean>}
     */
    static async asyncDeletePostImagesFromStorage(postImages) {
        try {
            for (let postImage of postImages) {
                if (await FirebaseHelper.asyncDeleteImageFromStorage(postImage.storageUrlMid) === false) return false;
                if (await FirebaseHelper.asyncDeleteImageFromStorage(postImage.storageUrlLow) === false) return false;
            }
            return true;
        }
        catch(e) {
            console.log("Err: PostController.asyncDeletePostImagesFromStorage")
            return false;
        }
    }

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
