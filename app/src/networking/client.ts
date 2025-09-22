class Client {
    private ws: WebSocket;

    constructor(url: string) {
        this.ws = new WebSocket(url);
        this.ws.onopen = this.onOpen.bind(this);
        this.ws.onmessage = this.onMessage.bind(this);
    }

    private onOpen(ev: Event) {
        console.log("ws open", ev);
    }

    private onMessage(ev: Event) {
        console.log("ws message", ev);
    }
}

export { Client };
