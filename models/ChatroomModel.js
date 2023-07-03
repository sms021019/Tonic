import {DBCollectionType} from "../utils/utils";
import DBHelper from "../helpers/DBHelper";

export default class ChatroomModel {
    constructor(opponentRef, user) {
        this.id = null;
        this.ref = null;
        this.collectionType = DBCollectionType.CHATROOMS;

        this.opponentRef = opponentRef;
        this.user = user;
    }
    setRef(ref) {
        this.ref = ref;
    }

    isValid() {
        return true;
    }
    
    static async loadData(currentUserRef) {
        await DBHelper.loadData({ref: currentUserRef}).then((data) => {

        })

    }

    static async loadAllData(currentUserRef, dest) {

        let userData = []
        if (await DBHelper.loadDataByRef(currentUserRef, /* OUT */ userData) === false) {
            // TO DO:
            return false;
        }
        else {
            userData = userData[0];
        }

        if(userData.chatrooms.length === 0){
            console.log("No chatrooms")
            return true;
        }

        for (let i = 0; i < userData.chatrooms.length; i++) {
            let data = [];
            if (await DBHelper.loadDataByRef(userData.chatrooms[i], data) === false) {
                // TO DO:
                return false;
            }
            dest.push(data[0]);
        }
        return true;

        // let loadState = await DBHelper.loadAllData(DBCollectionType.CHATROOMS, /* OUT */ dataList);
        // if (loadState === false || dataList.length === 0) {
        //     return false;
        // }

        // for (let i = 0; i < dataList.length; i++) {
        //     let postModel = this.convertLoadDataIntoModel(dataList[i]);
        //     if (postModel === null) return false;

        //     dest.push(postModel);
        // }
        // return true;
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
            opponentRef: this.opponentRef,
            user: this.user,
        }
    }
}