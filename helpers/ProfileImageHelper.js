import {ProfileImageType} from "../utils/utils";


export default class ProfileImageHelper {

    static getProfileImageUrl(type) {
        switch (type) {
            case ProfileImageType.A : return require("../assets/profileImages/pi1.jpg");
            case ProfileImageType.B : return require("../assets/profileImages/pi2.jpg");
            case ProfileImageType.C : return require("../assets/profileImages/pi3.jpg");
            case ProfileImageType.D : return require("../assets/profileImages/pi4.jpg");
            case ProfileImageType.E : return require("../assets/profileImages/pi5.jpg");
            case ProfileImageType.F : return require("../assets/profileImages/pi6.jpg");
            case ProfileImageType.G : return require("../assets/profileImages/pi7.jpg");
            case ProfileImageType.H : return require("../assets/profileImages/pi8.jpg");
            default: return require("../assets/profileImages/pi1.jpg");
        }
    }

    static getRandomProfileImageType() {
        const types = Object.values(ProfileImageType);
        const randomIndex = Math.floor(Math.random() * types.length);
        return types[randomIndex];
    }
}
