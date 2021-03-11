/// <reference types="./frameworkmessages" />

module Kosy.Debugger {
    //settings.json as a type
    interface StartupParameters {
        "integration-url": string
    }

    //Convenience interface that links a "client" to its "iframe"
    interface KosyClient { 
        info: ClientInfo,
        iframe: HTMLIFrameElement
    }

    //Represents "any" integration client's message
    type IntegrationClientMessage = any;

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

    export class App {
        //A collection of all clients
        private clients: Array<KosyClient> = [];

        //Starts the debugger
        public start (params: StartupParameters): void {
            //Sets up the message listener to listen for incoming messages
            window.addEventListener("message", (event: MessageEvent<IntegrationToKosyMessage<IntegrationClientMessage>>) => {
                this.receiveIncomingMessage(event.data, event.source);
            });
            //Sets up the "add-client" button for onclick events
            (document.getElementById("add-client") as HTMLButtonElement).onclick = event => {
                this.addNewClient (params["integration-url"]);
            }
        }

        //Receives a message from an integration to the debugger (kosy)
        public receiveIncomingMessage (message: IntegrationToKosyMessage<IntegrationClientMessage>, source: MessageEventSource) {
            switch (message.type) {
                //If we've received the initial message
                case "ready-and-listening":
                    this.log("Kosy received: Ready and listening.");
                    //Figure out which integration client sent it
                    let kosyClients = this.clients.filter(client => client.iframe.contentWindow === source);
                    if (kosyClients.length === 1) {
                        let kosyClient = kosyClients[0];

                        //Send the integration client its initial info
                        this.sendInitialInfoMessage(kosyClient);

                        //Then send to the other integration clients that another integration client has joined
                        this.broadcastClientHasJoinedMessage(kosyClient);
                    } else {
                        //This SHOULD not occur, but, yea... javascript :D
                        throw "Could not find the message's source, this should not occur?"
                    }
                    break;
                case "relay-message":
                    //Broadcasts the message to all clients
                    this.log("Kosy received: Relay message: ", message.payload);
                    this.broadcastIntegrationMessage(message.payload)
                    break;
                default:
                    //Ignore unknown messages
                    break;    
            }
        }

        //Adds a new client to the debugger
        private addNewClient (url: string): void {
            let info = this.generateClientInfo();
            let iframeContainer = document.createElement("div");
            iframeContainer.style.display = "inline-grid";

            //TODO: use an HTML5 <template> for this
            let iframe = document.createElement("iframe");
            iframe.src = url;
            iframe.id = info.clientUuid;
            iframe.width = "700px";
            iframe.height = "400px";
            iframeContainer.appendChild(iframe);

            let kosyClient = { info, iframe };
            this.clients.push(kosyClient);

            //TODO: use an HTML5 <template> for this
            let removeClientButton = document.createElement("button");
            removeClientButton.innerHTML = "Leave the table";
            removeClientButton.onclick = event => {
                this.removeClient(kosyClient);
            };
            iframeContainer.appendChild(removeClientButton);
            (document.getElementById("clients")).appendChild(iframeContainer);
        }

        //Generates a somewhat random client that is seated at the table
        private generateClientInfo(): ClientInfo {
            let clientId = Date.now().toString();
            return {
                clientUuid: clientId,
                clientName: clientId,
                clientLocation: {
                    type: "seated-at-table",
                    building: defaultBuilding,
                    floor: defaultFloor,
                    room: defaultRoom,
                    table: defaultTable,
                    seatNumber: this.findUnclaimedSeatNumber(defaultTable)
                }
            }
        }

        //This function finds an unclaimed seat at a kosy table
        private findUnclaimedSeatNumber(table: Table): number {
            let seatIsOccupied = new Array(table.numberOfSeats);

            this.clients.forEach(client => {
                //If the client is seated at a table
                switch (client.info.clientLocation.type) {
                    case "seated-at-table":
                        //Sets the seat as "occupied"
                        seatIsOccupied[client.info.clientLocation.seatNumber - 1] = true;
                        break;
                    default:
                        break;
                }
            });

            //Goes through the table's seats and tries to find an unclaimed one
            for (let seatNumber = 0; seatNumber < table.numberOfSeats; seatNumber++) {
                if (!seatIsOccupied[seatNumber]) {
                    return seatNumber + 1;
                }
            }
            
            //If no seat was found, throw an exception?
            throw "No more available unclaimed seats...";
        }

        //Sends initialization info the kosy client
        private sendInitialInfoMessage (kosyClient: KosyClient) {
            let initialInfo: ReceiveInitialInfo = {
                type: "receive-initial-info",
                payload: {
                    clients:
                        //starts with an empty object, then fills the object with { "client identifier": client info }
                        this.clients.reduce((map: { [clientUuid: string]: ClientInfo }, nextValue) => { 
                            map[nextValue.info.clientUuid] = nextValue.info;
                            return map;
                        }, {}),
                    currentClientUuid: kosyClient.info.clientUuid,
                    initializerClientUuid: this.clients[0].info.clientUuid
                }
            }
            this.sendKosyMessageToIntegrationClient(initialInfo, kosyClient);
        }

        //Sends a message from the debugger (kosy) to an integration
        public sendKosyMessageToIntegrationClient (message: KosyToIntegrationMessage<IntegrationClientMessage>, toClient: KosyClient) {
            toClient.iframe.contentWindow.postMessage(message, toClient.iframe.src);
        }

        //Sends client has joined messages to all registered clients
        private broadcastClientHasJoinedMessage (kosyClient: KosyClient) {
            let clientHasJoinedMessage: ClientHasJoined = {
                type: "client-has-joined",
                payload: kosyClient.info
            }
            this.clients.forEach(client => this.sendKosyMessageToIntegrationClient(clientHasJoinedMessage, client));
        }

        //Broadcasts an integration's message to all clients
        private broadcastIntegrationMessage (message: IntegrationClientMessage) {
            let receiveMessage: ReceiveMessage<IntegrationClientMessage> = {
                type: "receive-message",
                payload: message
            }
            this.clients.forEach(client => this.sendKosyMessageToIntegrationClient(receiveMessage, client));
        }

        //Removes a client from the debugger, broadcasts "client has left" and removes the client from the DOM
        private removeClient(client: KosyClient): void {
            this.clients = this.clients.filter(existing => existing != client);
            this.broadcastClientHasLefMessage(client);
            client.iframe.parentElement.remove();
        }

        //Broadcasts client has left message to all clients
        private broadcastClientHasLefMessage(client: KosyClient): void {
            let clientHasLeftMessage: ClientHasLeft = {
                type: "client-has-left",
                payload: client.info
            }
            this.clients.forEach(client => this.sendKosyMessageToIntegrationClient(clientHasLeftMessage, client));
        }

        private log (...message: any[]) {
            console.log(...message);
        }
    }
}

//Fetches the settings, then starts the debugger
fetch("settings.json")
.then(response => response.json())
.then(json => new Kosy.Debugger.App().start(json));