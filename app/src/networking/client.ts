import { useIPAddress } from "../store/useIPAddress";

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

    private onMessage(ev: MessageEvent) {
        console.log("ws message", JSON.parse(ev.data));
    }
}

const client = new Client();
export default client;
