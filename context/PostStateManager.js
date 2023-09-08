import {useRecoilRefresher_UNSTABLE, useRecoilState, useRecoilValue} from "recoil";
import {postIdsAtom, postAtom} from '../recoil/postState'
import PostController from "../typeControllers/PostController";


export default function PostStateManager({postStateManager}) {
    const [postIds, setPostIds] = useRecoilState(postIdsAtom);
    const refreshPostIds = useRecoilRefresher_UNSTABLE(postIdsAtom);

    postStateManager.addId = (id) => {
        setPostIds([...postIds, id]);
    }

    postStateManager.removeId = (id) => {
        setPostIds(postIds.filter((postId) => postId !== id));
    }

    postStateManager.refreshPostIds = async () => {
        const newPostIds = await PostController.asyncGetPostIds();
        if (!newPostIds) return false;

        setPostIds(await PostController.asyncGetPostIds());
        return true;
    }

    return (<></>)
}
