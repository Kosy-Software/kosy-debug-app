/// <reference path="messages.d.ts" />

module Kozy {
    class StartupParameters {
        "integration-url": string
    }

    export class KozyDebugger {
        private clients: Array<{ identifier: string; iframe: HTMLIFrameElement; makeHostButton: HTMLButtonElement }> = [];
        private hostClientIdentifier: string;
        private addClientButton: HTMLButtonElement;
        private clientDiv: HTMLElement;

        public sendOutgoingMessage (message: ServerToClientMessage, clientIdentifier: string) {
            let matchingClient = this.clients.find(client => client.identifier = clientIdentifier);
            if (matchingClient) {
                matchingClient.iframe.contentWindow.postMessage(message, "*");
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
            this.addClientButton = document.getElementById("add-client") as HTMLButtonElement;
            this.clientDiv = document.getElementById("clients");
        }

        private addNewClient (url: string): void {
            let iframeContainer = document.createElement("div");
            iframeContainer.style.display = "inline-grid";
            let iframe = document.createElement("iframe");
            iframe.src = url;            
            let identifier = Date.now().toString();
            if (!this.clients) {
                this.hostClientIdentifier = identifier;
            }
            iframeContainer.appendChild(iframe);

            let makeHostButton = document.createElement("button");
            makeHostButton.innerHTML = "Make kozy host";
            makeHostButton.onclick = event => {
                this.hostClientIdentifier = identifier;
                this.clients.forEach(client => {
                    this.sendOutgoingMessage({ type: "HostHasChanged", payload: {} }, identifier);
                });
            };
            iframeContainer.appendChild(makeHostButton);
            this.clientDiv.appendChild(iframeContainer);

            this.clients.push({ identifier, iframe, makeHostButton });
        }

        public start (params: StartupParameters): void {
            window.addEventListener("message", (event: MessageEvent<ClientToServerMessage>) => {
                this.receiveIncomingMessage(event.data);
            });
            this.addClientButton.onclick = event => {
                this.addNewClient (params["integration-url"]);
            }
        }
    }
}

window.onload = () => {
    fetch("settings.json")
    .then(response => response.json())
    .then(json => new Kozy.KozyDebugger().start(json));
};