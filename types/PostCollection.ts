
export interface PostDoc {
    docId: string;
    ownerEmail: string;
    title: string;
    price: number;
    info: string;
    postTime: number;
    postImages: PostImage[]
}

export interface PostImage {
    downloadUrlLow: string
    downloadUrlMid: string
    storageUrlLow: string
    storageUrlMid: string
}
