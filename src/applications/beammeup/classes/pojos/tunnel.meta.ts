import {TunnelHttpData} from "./tunnel.http.data";

export interface TunnelPacket {
    meta: TunnelMeta;
    httpData: TunnelHttpData;
    createdAt: Date;
    alias: string;
    first_packet: boolean;
}

export interface TunnelMeta {
    id?: string;
    alias: string;
    clientIp: string;
    token: string;
    protocol: string;
}

export enum TunnelProtocol {
    HTTP = 'http', TCP = 'tcp'
}
