import { Building, ClientInfo, Floor, Table, Room } from './lib/kosyclient';
import * as KosyMessages from './lib/kosymessages';

module Kosy.Debugger {
    //settings.json as a type
    interface StartupParameters {
        "integration-url": string
    }

    //Convenience interface that links a "client" to its "iframe"
    interface KosyClient { 
        info: ClientInfo,
        initialized: boolean,
        iframe: HTMLIFrameElement
    }

    //Represents "any" integration client's state type
    type IntegrationState = any;
    //Represents "any" integration client's message type
    type IntegrationMessage = any;

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
            window.addEventListener("message", (event: MessageEvent<KosyMessages.IntegrationToKosyMessage<IntegrationState, IntegrationMessage>>) => {
                this.receiveIncomingMessage(event.data, event.source);
            });
            //Sets up the "add-client" button for onclick events
            (document.getElementById("add-client") as HTMLButtonElement).onclick = event => {
                this.addNewClient (params["integration-url"]);
            }
        }

        //Receives a message from an integration to the debugger (kosy)
        public receiveIncomingMessage (message: KosyMessages.IntegrationToKosyMessage<IntegrationState, IntegrationMessage>, source: MessageEventSource) {
            switch (message.type) {
                //If we've received the initial message
                case "ready-and-listening":
                    this.log("Ready and listening.");
                    //Figure out which integration client sent it
                    let kosyClients = this.clients.filter(client => client.iframe.contentWindow === source);
                    if (kosyClients.length === 1) {
                        let kosyClient = kosyClients[0];

                        //Broadcast to others that a new integration client has joined
                        this.broadcastClientHasJoinedMessage(kosyClient);

                        //Request the integration's state from the "host"
                        this.sendKosyMessageToIntegrationClient({ 
                            type: "request-integration-state", payload: {} 
                        }, this.clients[0])
                    } else {
                        //This SHOULD not occur, but, yea... javascript :D
                        throw "Could not find the message's source, this should not occur?"
                    }
                    break;
                case "receive-integration-state":
                    this.log("Kosy received the integration's current state");
                    //Send the integration client its initial info
                    this.clients
                        .filter(client => !client.initialized)
                        .forEach(client => {
                            this.sendInitialInfoMessage(client, message.payload);
                            client.initialized = true;
                        });
                    break;
                case "relay-message":
                    //Broadcasts the message to all clients
                    this.log("Relay message: ", message.payload);
                    this.broadcastIntegrationMessage(message.payload)
                    break;
                case "end-integration":
                    this.log("End integration");
                    [ ...this.clients ].forEach(client => this.removeClient(client.info.clientUuid));
                    break;
                default:
                    //Ignore unknown messages
                    break;
            }
        }

        private renderKosyClient(clientInfo: ClientInfo, url: string) {
            let template = document.getElementById("clientRoot") as HTMLTemplateElement;
            let templateClone = template.content.firstElementChild.cloneNode(true) as HTMLElement;

            let iframe = templateClone.querySelector("iframe") as HTMLIFrameElement;
            iframe.src = url;
            iframe.id = clientInfo.clientUuid;

            let removeClientButton = templateClone.querySelector("button") as HTMLButtonElement;
            removeClientButton.onclick = event => this.removeClient(clientInfo.clientUuid);

            document.getElementById("clients").appendChild(templateClone);
            return iframe;
        }

        //Adds a new client to the debugger
        private addNewClient (url: string): void {
            let info = this.generateClientInfo();
            let iframe = this.renderKosyClient(info, url);

            let kosyClient = { info, iframe, initialized: false };
            this.clients.push(kosyClient);
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
            //Using this array as an array that starts at 1 in stead of 0 to make the logic more readable.
            let seatIsOccupied = new Array(table.numberOfSeats + 1);

            this.clients.forEach(client => {
                //If the client is seated at a table
                switch (client.info.clientLocation.type) {
                    case "seated-at-table":
                        //Sets the seat as "occupied"
                        seatIsOccupied[client.info.clientLocation.seatNumber] = true;
                        break;
                    default:
                        break;
                }
            });

            //Goes through the table's seat numbers and tries to find an unclaimed one
            for (let seatNumber = 1; seatNumber <= table.numberOfSeats; seatNumber++) {
                if (!seatIsOccupied[seatNumber]) {
                    return seatNumber;
                }
            }
            
            //If no seat was found, throw an exception?
            throw "No more available unclaimed seats...";
        }

        //Sends initialization info the kosy client
        private sendInitialInfoMessage (kosyClient: KosyClient, integrationState: IntegrationState) {
            let initialInfo: KosyMessages.ReceiveInitialInfo<IntegrationState> = {
                type: "receive-initial-info",
                payload: {
                    clients:
                        //starts with an empty object, then fills the object with { "client identifier": client info }
                        this.clients.reduce((map: { [clientUuid: string]: ClientInfo }, nextValue) => { 
                            map[nextValue.info.clientUuid] = nextValue.info;
                            return map;
                        }, {}),
                    currentClientUuid: kosyClient.info.clientUuid,
                    initializerClientUuid: this.clients[0].info.clientUuid,
                    currentIntegrationState: integrationState
                }
            }
            this.sendKosyMessageToIntegrationClient(initialInfo, kosyClient);
        }

        //Sends a message from the debugger (kosy) to an integration
        public sendKosyMessageToIntegrationClient (message: KosyMessages.KosyToIntegrationMessage<IntegrationState, IntegrationMessage>, toClient: KosyClient) {
            toClient.iframe.contentWindow.postMessage(message, toClient.iframe.src);
        }

        //Sends client has joined messages to all registered clients
        private broadcastClientHasJoinedMessage (kosyClient: KosyClient) {
            let clientHasJoinedMessage: KosyMessages.ClientHasJoined = {
                type: "client-has-joined",
                payload: kosyClient.info
            }
            this.clients.forEach(client => {
                if (client.info.clientUuid != kosyClient.info.clientUuid) { 
                    this.sendKosyMessageToIntegrationClient(clientHasJoinedMessage, client) 
                }
            });
        }

        //Broadcasts an integration's message to all clients
        private broadcastIntegrationMessage (message: IntegrationMessage) {
            let receiveMessage: KosyMessages.ReceiveMessage<IntegrationMessage> = {
                type: "receive-message",
                payload: message
            }
            this.clients.forEach(client => this.sendKosyMessageToIntegrationClient(receiveMessage, client));
        }

        //Removes a client from the debugger, broadcasts "client has left" and removes the client from the DOM
        private removeClient(clientUuid: string): void {
            let removedClient = this.clients.find(existing => existing.info.clientUuid == clientUuid);
            this.clients = this.clients.filter(existing => existing != removedClient);
            this.broadcastClientHasLefMessage(removedClient);
            removedClient.iframe.parentElement.remove();
        }

        //Broadcasts client has left message to all clients
        private broadcastClientHasLefMessage(client: KosyClient): void {
            let clientHasLeftMessage: KosyMessages.ClientHasLeft = {
                type: "client-has-left",
                payload: client.info
            }
            this.clients.forEach(client => this.sendKosyMessageToIntegrationClient(clientHasLeftMessage, client));
        }

        private log (...message: any[]) {
            console.log("Kosy received: ", ...message);
        }
    }
}

//Fetches the settings, then starts the debugger
fetch("settings.json")
.then(response => response.json())
.then(json => new Kosy.Debugger.App().start(json));