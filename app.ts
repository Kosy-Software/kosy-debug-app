/// <reference path="messages.d.ts" />

module Kosy {
    class StartupParameters {
        "integration-url": string
    }

    type KosyClient = { 
        info: ClientInfo,
        iframe: HTMLIFrameElement
    }

    type ClientMessage = any;

    const defaultBuilding: Building = {
        buildingKey: "TestBuilding",
        buildingName: "TestBuilding"
    }
    const defaultFloor: Floor = {
        floorUuid: "TestFloor",
        floorName: "TestFloor"
    }
    const defaultTable: Table = {
        tableUuid: "TestTable",
        tableName: "TestTable",
        numberOfSeats: 999
    }
    const defaultRoom: Room = {
        roomUuid: "TestRoom",
        roomName: "TestRoom"
    }

    export class KosyDebugger {
        private clients: Array<KosyClient> = [];
        private addClientButton: HTMLButtonElement;
        private clientDiv: HTMLElement;

        constructor () {
            this.addClientButton = document.getElementById("add-client") as HTMLButtonElement;
            this.clientDiv = document.getElementById("clients");
        }

        private log (...message: any[]) {
            console.log(...message);
        }

        private findUnclaimedSeatNumber(table: Table): number {
            let seatsArray = new Array(table.numberOfSeats);
            this.clients.forEach(client => {
                switch (client.info.clientLocation.type) {
                    case "SeatedAtTable":
                        seatsArray[client.info.clientLocation.seatNumber - 1] = true;
                        break;
                    default:
                        break;
                }
            });
            for (let index = 0; index < seatsArray.length; index++) {
                if (!seatsArray[index]) {
                    return index + 1;
                }
            }
            throw "No more available unclaimed seats...";
        }

        private createClientHasJoinedMessage (kosyClient: KosyClient): ClientHasJoined {
            return {
                type: "ClientHasJoined",
                payload: kosyClient.info
            }
        }

        private createClientHasLeftMessage (kosyClient: KosyClient): ClientHasLeft {
            return {
                type: "ClientHasLeft",
                payload: kosyClient.info
            }
        }

        private createReceiveInitialInfoMessage (kosyClient: KosyClient, initializer: KosyClient): ReceiveInitialInfo {
            return {
                type: "ReceiveInitialInfo",
                payload: {
                    currentClient: kosyClient.info,
                    initializer: initializer.info
                }
            }
        }

        public sendOutgoingMessage (message: ServerToClientMessage<ClientMessage>, fromClient: KosyClient) {
            fromClient.iframe.contentWindow.postMessage(message, "*");
        }

        public receiveIncomingMessage (source: MessageEventSource, message: ClientToServerMessage<ClientMessage>) {
            switch (message.type) {
                case "ReadyAndListening":
                    this.log("Kosy received: Ready and listening.");
                    let kosyClients = this.clients.filter(client => client.iframe.contentWindow === source);
                    if (kosyClients.length === 1) {
                        let kosyClient = kosyClients[0];
                        let receiveClientInfoMessage = this.createReceiveInitialInfoMessage(kosyClient, this.clients[0]);
                        this.sendOutgoingMessage(receiveClientInfoMessage, kosyClient);
                        let clientHasJoinedMessage = this.createClientHasJoinedMessage(kosyClient)
                        this.clients.forEach(client => this.sendOutgoingMessage(clientHasJoinedMessage, client));
                    } else {
                        throw "Could not found the message's source, this should not occur?"
                    }
                    break;
                case "RelayMessage":
                    this.log("Kosy received: Relay message: ", message.payload);
                    break;
                default:
                    this.log("Kosy received an unexpected message: ", message);
                    break;    
            }
        }

        private unregisterClient(client: KosyClient): void {
            this.clients = this.clients.filter(existing => existing != client);
            this.clients.forEach(notRemovedClient => this.sendOutgoingMessage(this.createClientHasLeftMessage (client), notRemovedClient));
            client.iframe.parentElement.remove();
        }

        private registerClient(kosyClient: KosyClient): void {
            this.clients.push(kosyClient);
        }

        private generateClientInfo(): ClientInfo {
            let clientId = Date.now().toString();
            return {
                clientUuid: clientId,
                clientName: clientId,
                clientLocation: {
                    type: "SeatedAtTable",
                    building: defaultBuilding,
                    floor: defaultFloor,
                    room: defaultRoom,
                    table: defaultTable,
                    seatNumber: this.findUnclaimedSeatNumber(defaultTable)
                }
            }
        }

        private addNewClient (url: string): void {
            let info = this.generateClientInfo();

            let iframeContainer = document.createElement("div");
            iframeContainer.style.display = "inline-grid";
            let iframe = document.createElement("iframe");
            iframe.src = url;
            iframe.sandbox.value = "allow-scripts allow-same-origin";
            iframeContainer.appendChild(iframe);

            let removeClientButton = document.createElement("button");
            removeClientButton.innerHTML = "Leave the table";
            iframeContainer.appendChild(removeClientButton);
            this.clientDiv.appendChild(iframeContainer);

            let kosyClient = { info, iframe }
            this.registerClient(kosyClient);
            removeClientButton.onclick = event => {
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

fetch("settings.json")
.then(response => response.json())
.then(json => new Kosy.KosyDebugger().start(json));