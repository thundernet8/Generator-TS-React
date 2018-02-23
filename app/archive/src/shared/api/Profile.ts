import WebApi from "./WebApi";
export interface FetchProfileReq {
    username: string;
}

export interface FetchProfileResp {}

export function FetchProfile(playload: FetchProfileReq) {
    return WebApi.Get<FetchProfileResp>(`profile/${playload.username}`, {});
}
