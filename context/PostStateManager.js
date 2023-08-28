import {useRecoilState, useRecoilValue} from "recoil";
import {postIdsAtom, postAtom} from '../recoli/postState'


export default function PostStateManager({postStateManager}) {
    const [postIds, setPostIds] = useRecoilState(postIdsAtom);

    postStateManager.addId = (id) => {
        setPostIds([...postIds, id]);
    }

    postStateManager.removeId = (id) => {
        setPostIds(postIds.filter((postId) => postId !== id));
    }

    return (<></>)
}
