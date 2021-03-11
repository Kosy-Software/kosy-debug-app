import * as KosyFrameWork from "./framework";
import { ReceiveInitialInfo, ClientHasJoined, ReceiveMessage } from './framework';

module Kosy {
    //settings.json as a type
    interface StartupParameters {
        "integration-url": string
    }

    //Convenience interface that links a "client" to its "iframe"
    interface KosyClient { 
        info: KosyFrameWork.ClientInfo,
        iframe: HTMLIFrameElement
    }

    //Represents "any" integration client's message
    type IntegrationClientMessage = any;

    const defaultBuilding: KosyFrameWork.Building = {
        buildingKey: "TestBuilding",
        buildingName: "TestBuilding"
    }
    const defaultFloor: KosyFrameWork.Floor = {
        floorUuid: "TestFloor",
        floorName: "TestFloor"
    }
    const defaultTable: KosyFrameWork.Table = {
        tableUuid: "TestTable",
        tableName: "TestTable",
        numberOfSeats: 999
    }
    const defaultRoom: KosyFrameWork.Room = {
        roomUuid: "TestRoom",
        roomName: "TestRoom"
    }

    export class KosyDebugger {
        //A collection of all clients
        private clients: Array<KosyClient> = [];

        private log (...message: any[]) {
            console.log(...message);
        }

        //This function finds an unclaimed seat at a kosy table
        private findUnclaimedSeatNumber(table: KosyFrameWork.Table): number {
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
            for (let index = 0; index < seatIsOccupied.length; index++) {
                if (!seatIsOccupied[index]) {
                    return index + 1;
                }
            }
            
            //If no seat was found, throw an exception?
            throw "No more available unclaimed seats...";
        }

        //Sends client has joined messages to all registered clients
        private sendClientHasJoinedMessages(kosyClient: KosyClient) {
            let clientHasJoinedMessage: ClientHasJoined = {
                type: "client-has-joined",
                payload: kosyClient.info
            }
            this.clients.forEach(client => this.sendMessage(clientHasJoinedMessage, client));
        }

        private createClientHasLeftMessage (kosyClient: KosyClient): KosyFrameWork.ClientHasLeft {
            return {
                type: "client-has-left",
                payload: kosyClient.info
            }
        }

        //Sends initialization info the kosy client
        private sendInitialInfoMessage (kosyClient: KosyClient) {
            let initialInfo: ReceiveInitialInfo = {
                type: "receive-initial-info",
                payload: {
                    clients:
                        //starts with an empty object, then fills the object with { "client identifier": client info }
                        this.clients.reduce((map: { [clientUuid: string]: KosyFrameWork.ClientInfo }, nextValue) => { 
                            map[nextValue.info.clientUuid] = nextValue.info;
                            return map;
                        }, {}),
                    currentClientUuid: kosyClient.info.clientUuid,
                    initializerClientUuid: this.clients[0].info.clientUuid
                }
            }
            this.sendMessage(initialInfo, kosyClient);
        }

        //Sends a message from the debugger (kosy) to an integration
        public sendMessage (message: KosyFrameWork.KosyToIntegrationMessage<IntegrationClientMessage>, fromClient: KosyClient) {
            fromClient.iframe.contentWindow.postMessage(message, "*");
        }

        //Broadcasts an integration's message to all clients
        private broadcastMessage (message: IntegrationClientMessage) {
            let receiveMessage: ReceiveMessage<IntegrationClientMessage> = {
                type: "receive-message",
                payload: message
            }
            this.clients.forEach(client => this.sendMessage(receiveMessage, client));
        }

        //Receives a message from an integration to the debugger (kosy)
        public receiveIncomingMessage (message: KosyFrameWork.IntegrationToKosyMessage<IntegrationClientMessage>, source: MessageEventSource) {
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
                        this.sendClientHasJoinedMessages(kosyClient);
                    } else {
                        //This SHOULD not occur, but, yea... javascript :D
                        throw "Could not find the message's source, this should not occur?"
                    }
                    break;
                case "relay-message":
                    //Broadcasts the message to all clients
                    this.log("Kosy received: Relay message: ", message.payload);
                    this.broadcastMessage(message.payload)
                    break;
                default:
                    //Ignore unknown messages
                    break;    
            }
        }

        //Removes a client from the debugger: 
        //-> sends "client has left" messages to all other clients and removes its iframe
        private removeClient(client: KosyClient): void {
            this.clients = this.clients.filter(existing => existing != client);
            this.clients.forEach(notRemovedClient => this.sendMessage(this.createClientHasLeftMessage (client), notRemovedClient));
            client.iframe.parentElement.remove();
        }

        //Generates a somewhat random client that is seated at the table
        private generateClientInfo(): KosyFrameWork.ClientInfo {
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

        //Starts the debugger
        public start (params: StartupParameters): void {
            //Sets up the message listener to listen for incoming messages
            window.addEventListener("message", (event: MessageEvent<KosyFrameWork.IntegrationToKosyMessage<IntegrationClientMessage>>) => {
                this.receiveIncomingMessage(event.data, event.source);
            });
            //Sets up the "add-client" button for onclick events
            (document.getElementById("add-client") as HTMLButtonElement).onclick = event => {
                this.addNewClient (params["integration-url"]);
            }
        }
    }
}

//Fetches the settings, then starts the debugger
fetch("settings.json")
.then(response => response.json())
.then(json => new Kosy.KosyDebugger().start(json));