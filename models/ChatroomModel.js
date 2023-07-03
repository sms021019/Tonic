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

    static async loadAllData() {
        let dest = []
        let result = await DBHelper.loadAllData(DBCollectionType.CHATROOMS, dest);
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
            opponentRef: this.opponentRef,
            user: this.user,
        }
    }
}