export interface TunnelHttpResponse {
    status: number;
    body: any;
    headers: any;
}

export interface TunnelHttpData {
    requestId: string;
    tunnelAlias: string;
    response: TunnelHttpResponse;
}

