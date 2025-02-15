import DBHelper from "../helpers/DBHelper";
import {DBCollectionType} from "../utils/utils";
import {arrayUnion, writeBatch} from "firebase/firestore";
import {db} from "../firebase";
import {arrayRemove} from "@firebase/firestore";
import FirebaseHelper from "../helpers/FirebaseHelper";

export default class PostController {
    static async asyncGetPostIds() {
        return await FirebaseHelper.getDocIds(DBCollectionType.POSTS);
    }

    static async asyncGetPost(id) {
        return /**@type {PostDoc}*/ await FirebaseHelper.getDocDataById(DBCollectionType.POSTS, id);
    }

    /**
     *
     * @param {PostDoc} post
     * @returns {Promise<boolean>}
     */
    static async asyncAdd(post) {
        if (!this.isValid(post)) return false;

        try {
            let batch = writeBatch(db);

            if (await this.asyncBatchAddPost(batch, post) === false) return false;

            await batch.commit();
            return true;
        }
        catch (e) {
            console.log(e, "Err: PostController.asyncAdd")
            return false;
        }
    }

    /**
     *
     * @param {PostDoc} oldPost
     * @param {PostDoc} newPost
     * @returns {Promise<boolean>}
     */
    static async asyncUpdate(oldPost, newPost) {
        if (!this.isValid(newPost)) return false;

        try {
            let batch = writeBatch(db);

            if (await this.asyncBatchUpdatePost(batch, oldPost, newPost) === false) return false;

            await batch.commit();
            return true;
        }
        catch (e) {
            console.log(e, "Err: PostController.asyncUpdate")
            return false;
        }
    }

    /**
     *
     * @param {PostDoc} post
     * @returns {Promise<boolean>}
     */
    static async asyncDelete(post) {
        try {
            let batch = writeBatch(db);
            if (await this.asyncBatchDeletePost(batch, post) === false) return false;
            await batch.commit();

            if (await this.asyncDeletePostImagesFromStorage(post.postImages) === false) return false;
            console.log("Done: PostController.asyncDelete.")
            return true;
        }
        catch (e) {
            console.log(e, "Err: PostController.asyncDelete")
            return false;
        }
    }

    /**
     * @param batch
     * @param {PostDoc} post
     * @returns {Promise<boolean>}
     *
     * This function will create and set new 'docId' to the post.
     */
    static async asyncBatchAddPost(batch, post) {
        try {
            if (await this.asyncUploadPostImagesToStorage(post.postImages, post.ownerEmail) === false) return false;

            const postRef = FirebaseHelper.getNewRef(DBCollectionType.POSTS);
            post.docId = postRef.id
            batch.set(postRef, post);

            const userRef = FirebaseHelper.getRef(DBCollectionType.USERS, post.ownerEmail)
            batch.update(userRef, {myPostIds: arrayUnion(post.docId)});

            return true;
        }
        catch(e) {
            console.log(e, "Err: PostController.asyncBatchAddPost")
            return false;
        }
    }

    /**
     * @param batch
     * @param {PostDoc} oldPost
     * @param {PostDoc} newPost
     * @returns {Promise<boolean>}
     */
    static async asyncBatchUpdatePost(batch, oldPost, newPost) {
        try {
            let result = this.getNewAndRemovedPostImages(oldPost.postImages, newPost.postImages);
            let newPostImages = result.newPostImages;
            let removedPostImages = result.removedPostImages;

            if (await this.asyncUploadPostImagesToStorage(newPostImages, newPost.ownerEmail) === false) return false;
            if (await this.asyncDeletePostImagesFromStorage(removedPostImages) === false) return false;

            const dRef = FirebaseHelper.getRef(DBCollectionType.POSTS, newPost.docId);
            batch.update(dRef, newPost);

            return true;
        }
        catch (e) {
            console.log(e, "Err: PostController.asyncBatchUpdatePost")
            return false;
        }
    }

    /**
     * @param batch
     * @param {PostDoc} post
     * @returns {Promise<boolean>}
     */
    static async asyncBatchDeletePost(batch, post) {
        try {
            const postDRef = FirebaseHelper.getRef(DBCollectionType.POSTS, post.docId);
            const userDRef = FirebaseHelper.getRef(DBCollectionType.USERS, post.ownerEmail)

            batch.update(userDRef, {myPostIds: arrayRemove(post.docId)});
            batch.delete(postDRef);

            return true;
        }
        catch(e) {
            console.log(e, "Err: PostController.asyncBatchDeletePost")
            return false;
        }
    }

    /**
     * @param {PostImage[]} postImages
     * @param ownerEmail
     * @returns {Promise<boolean>}
     */
    static async asyncUploadPostImagesToStorage(postImages, ownerEmail) {
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
        catch(e) {
            console.log(e, "Err: PostController.asyncUploadPostImagesToStorage")
            return false
        }
    }

    /**
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
            console.log(e, "Err: PostController.asyncDeletePostImagesFromStorage")
            return false;
        }
    }

    /**
     *
     * @param {PostImage[]} postImagesBefore
     * @param {PostImage[]} postImagesAfter
     */
    static getNewAndRemovedPostImages(postImagesBefore, postImagesAfter) {
        const removedPostImages = postImagesBefore.filter(before => !postImagesAfter.some((after) => this.isPostImageEqual(before, after)))
        const newPostImages =  postImagesAfter.filter(after => !postImagesBefore.some((before) => this.isPostImageEqual(before, after)))
        return {
            removedPostImages,
            newPostImages,
        }
    }

    /**
     *
     * @param {PostDoc} post
     * @returns {boolean}
     */
    static isValid(post) {
        if (!post) return false;
        if (!post.title || !post.price || !post.info || !post.postImages) return false;
        if (post.title === "" || post.price < 0 || post.info === "") return false;

        return true;
    }

    /**
     *
     * @param {PostImage} imageA
     * @param {PostImage} imageB
     * @returns {*}
     */
    static isPostImageEqual(imageA, imageB) {
        return (
            imageA.storageUrlMid === imageB.storageUrlMid &&
            imageA.storageUrlLow === imageB.storageUrlLow &&
            imageA.downloadUrlMid === imageB.downloadUrlMid &&
            imageA.downloadUrlLow === imageB.downloadUrlLow
        )
    }

    static async isPostExist(postId) {
        const postData = await FirebaseHelper.getDocDataById(DBCollectionType.POSTS, postId);
        return !!(postData)
    }
}
