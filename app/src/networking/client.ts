import { ErrorCode, type ServerError } from "../models/error";
import type { ErrorPayload, JoinPayload, Payload } from "../models/payload";
import { useIPAddress } from "../store/useIPAddress";
import { useJoinStatus } from "../store/useJoinStatus";
import { usePlayer } from "../store/usePlayer";

class Client {
    private ws: WebSocket | null = null;

    constructor() {
        
    }

    public connect(address: { ip: string, port: number }): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const url = `ws://${address.ip}:${address.port}`;
            this.ws = new WebSocket(url);
            this.ws.onmessage = this.onMessage.bind(this);
            this.ws.onopen = () => {
                useIPAddress.getState().setAddress(address);
                resolve(true);
            }
            this.ws.onerror = () => {
                reject();
            }
        })
    }

    private handleError(error: ServerError) {
        if (error.code === ErrorCode.JOIN_FAILURE) {
            useJoinStatus.getState().setStatus("failure", error);
        }
    }

    private onMessage(ev: MessageEvent) {
        const data = JSON.parse(ev.data) as Payload;
        console.log(`Received: ${ev.data}`);
        if ("error" in data) {
            const payload = data as ErrorPayload;
            this.handleError(payload.error);
            console.error(payload.error.message);
        }
        else if ("join" in data) {
            const payload = data as JoinPayload;
            usePlayer.getState().setPlayer(payload.join.player);
        }
    }
}

const client = new Client();
export default client;
