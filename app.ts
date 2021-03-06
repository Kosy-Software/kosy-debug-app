/// <reference path="messages.d.ts" />

module Kozy {
    class StartupParameters {
        "integration-url": string
    }

    export class KozyDebugger {
        private clients: Array<{ identifier: string; window: HTMLIFrameElement }>
        private clientClick: HTMLButtonElement;
        private clientDiv: HTMLElement;

        public sendOutgoingMessage (message: ServerToClientMessage, clientIdentifier: string) {
            let matchingClient = this.clients.find(client => client.identifier = clientIdentifier);
            if (matchingClient) {
                matchingClient.window.contentWindow.postMessage(message, "*");
            }
        }

        public receiveIncomingMessage (message: ClientToServerMessage) {
            switch (message.type) {
                case "ReadyAndListening":
                    alert("Ready and listening.");
                    break;
                case "RelayToAllClients":
                    alert("Relay to all hosts.");
                    break;
                case "RelayToHost":
                    alert("Relay to host");
                    break;
            }
        }

        constructor () {
            this.clientClick = document.getElementById("add-client") as HTMLButtonElement;
            this.clientDiv = document.getElementById("clients");
        }

        public start (params: StartupParameters): void {
            window.addEventListener("message", (event: MessageEvent<ClientToServerMessage>) => {
                this.receiveIncomingMessage(event.data);
            });
            this.clientClick.onclick = event => {
                let iframe = document.createElement("iframe");
                iframe.src = params["integration-url"];
                this.clientDiv.appendChild(iframe);
            }
        }
    }
}

window.onload = () => {
    fetch("settings.json")
    .then(response => response.json())
    .then(json => new Kozy.KozyDebugger().start(json));
};