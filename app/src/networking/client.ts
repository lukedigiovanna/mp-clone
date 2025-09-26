class Client {
    private ws: WebSocket | null = null;

    constructor() {
        
    }

    public connect(address: { ip: string, port: number }): Promise<boolean> {
        return new Promise<boolean>((resolve, ) => {
            console.log(this);
            try {
                const url = `ws://${address.ip}:${address.port}`;
                this.ws = new WebSocket(url);
                this.ws.onmessage = this.onMessage.bind(this);
                this.ws.onopen = () => {
                    resolve(true);
                }
                this.ws.onerror = () => {
                    resolve(false);
                }
            }
            catch {
                resolve(false);
            }
        })
    }

    private onMessage(ev: MessageEvent) {
        console.log("ws message", JSON.parse(ev.data));
    }
}

const client = new Client();
export default client;
