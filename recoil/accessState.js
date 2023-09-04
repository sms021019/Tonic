import {atom} from "recoil";


export const AccessStatus = {
    NO_ACCOUNT: "levelOfAccess_noAccount",
    EMAIL_NOT_VERIFIED: "levelOfAccess_emailNotVerified",
    VALID: "levelOfAccess_valid",
}

export const accessAtom = atom({
    key: 'accessAtom',
    default: AccessStatus.NO_ACCOUNT,
});
