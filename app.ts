/// <reference path="messages.d.ts" />

module Kozy {
    class StartupParameters {
        "integration-url": string
    }

    type KosyClient = { 
        info: ClientInfo,
        iframe: HTMLIFrameElement,
        makeHostButton: HTMLButtonElement
    }

    type ClientMessage = any;

    export class KozyDebugger {
        private clients: Array<KosyClient> = [];
        private addClientButton: HTMLButtonElement;
        private clientDiv: HTMLElement;
        private defaultBuilding: Building = {
            buildingKey: "TestBuilding",
            buildingName: "TestBuilding"
        }
        private defaultFloor: Floor = {
            floorUuid: "TestFloor",
            floorName: "TestFloor"
        }
        private defaultTable: Table = {
            tableUuid: "TestTable",
            tableName: "TestTable",
            numberOfSeats: 999
        }
        private defaultRoom: Room = {
            roomUuid: "TestRoom",
            roomName: "TestRoom"
        }

        constructor () {
            this.addClientButton = document.getElementById("add-client") as HTMLButtonElement;
            this.clientDiv = document.getElementById("clients");
        }

        private findUnclaimedSeatNumber(): number {
            var maxSeatNumber = this.clients.length + 1;
            for (var client of this.clients) {
                switch (client.info.clientLocation.type) {
                    case "SeatedAtTable":
                        if (client.info.clientLocation.seatNumber > maxSeatNumber) {
                            maxSeatNumber = client.info.clientLocation.seatNumber + 1;
                        }
                        break;
                    case "InPrivateConversation":
                        break;
                    default:
                        break;
                }
            }
            return maxSeatNumber;
        }

        private createClientHasJoinedMessage (client: KosyClient): ClientHasJoined {
            return {
                type: "ClientHasJoined",
                payload: client.info
            }
        }

        private createClientHasLeftMessage (client: KosyClient): ClientHasLeft {
            return {
                type: "ClientHasLeft",
                payload: client.info
            }
        }

        private createReceiveClientInfoMessage (kosyClient: KosyClient): ReceiveClientInfo {
            return {
                type: "ReceiveClientInfo",
                payload: kosyClient.info
            }
        }

        public sendOutgoingMessage (message: ServerToClientMessage<ClientMessage>, fromClient: KosyClient) {
            fromClient.iframe.contentWindow.postMessage(message, "*");
        }

        public receiveIncomingMessage (source: MessageEventSource, message: ClientToServerMessage<ClientMessage>) {
            switch (message.type) {
                case "ReadyAndListening":
                    alert("Received: Ready and listening.");
                    let kosyClients = this.clients.filter(client => client.iframe.contentWindow == source);
                    if (kosyClients.length === 1) {
                        let kosyClient = kosyClients[0];
                        let receiveClientInfoMessage = this.createReceiveClientInfoMessage(kosyClient);
                        this.sendOutgoingMessage(receiveClientInfoMessage, kosyClient);
                        let clientHasJoinedMessage = this.createClientHasJoinedMessage(kosyClient)
                        this.clients.forEach(client => this.sendOutgoingMessage(clientHasJoinedMessage, client));
                    } else {
                        throw "Could not found the message's source, oopsy?"
                    }
                    break;
                case "RelayMessage":
                    alert("Received: Relay message.");
                    break;
            }
        }

        private unregisterClient(client: KosyClient): void {
            this.clients = this.clients.filter(existing => existing != client);
            this.sendOutgoingMessage(this.createClientHasLeftMessage (client), client);            
            client.iframe.parentElement.remove();
        }

        private registerClient(kosyClient: KosyClient): void {
            this.clients.push(kosyClient);
        }

        private generateClientInfo(): ClientInfo {
            let clientId = Date.now().toString();
            return {
                clientUuid: clientId,
                clientName: "Client: " + clientId,
                clientLocation: {
                    type: "SeatedAtTable",
                    building: this.defaultBuilding,
                    floor: this.defaultFloor,
                    room: this.defaultRoom,
                    table: this.defaultTable,
                    seatNumber: this.findUnclaimedSeatNumber()
                }
            }
        }

        private addNewClient (url: string): void {
            let iframeContainer = document.createElement("div");
            iframeContainer.style.display = "inline-grid";
            let iframe = document.createElement("iframe");
            iframe.src = url;
            let info = this.generateClientInfo();
            iframeContainer.appendChild(iframe);

            let makeHostButton = document.createElement("button");
            makeHostButton.innerHTML = "Leave the table";
            iframeContainer.appendChild(makeHostButton);
            this.clientDiv.appendChild(iframeContainer);

            let kosyClient = { info, iframe, makeHostButton }
            this.registerClient(kosyClient);
            kosyClient.makeHostButton.onclick = event => {
                this.unregisterClient(kosyClient);
            };
        }

        public start (params: StartupParameters): void {
            window.addEventListener("message", (event: MessageEvent<ClientToServerMessage<ClientMessage>>) => {
                this.receiveIncomingMessage(event.source, event.data);
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