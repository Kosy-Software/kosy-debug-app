import { ClientInfo } from './lib/kosyclient';
import * as KosyMessages from './lib/kosymessages';
import { renderKosyClient } from './views/renderKosyClient';
import { generateClientInfo } from '../generateClientInfo';

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
                        let clientHasJoinedMessage: KosyMessages.ClientHasJoined = {
                            type: "client-has-joined",
                            payload: kosyClient.info
                        }
                        this.clients.forEach(client => {
                            this.sendKosyMessageToIntegrationClient(clientHasJoinedMessage, client) 
                        });

                        //Request the integration's state from the "host"
                        this.sendKosyMessageToIntegrationClient({ 
                            type: "request-integration-state",
                            payload: {} 
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
                    let receiveMessage: KosyMessages.ReceiveMessage<IntegrationMessage> = {
                        type: "receive-message",
                        payload: message
                    }
                    this.clients.forEach(client => this.sendKosyMessageToIntegrationClient(receiveMessage, client));
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

        //Adds a new client to the debugger
        private addNewClient (url: string): void {
            let info = generateClientInfo (this.clients.map(client => client.info));
            let iframe = renderKosyClient (info, url);

            let kosyClient = { info, iframe, initialized: false };
            this.clients.push(kosyClient);
        }

        //Removes a client from the debugger, broadcasts "client has left" and removes the client from the DOM
        private removeClient (clientUuid: string): void {
            let removedClient = this.clients.find(existing => existing.info.clientUuid == clientUuid);
            this.clients = this.clients.filter(existing => existing != removedClient);
            removedClient.iframe.parentElement.remove();

            let clientHasLeftMessage: KosyMessages.ClientHasLeft = {
                type: "client-has-left",
                payload: removedClient.info
            }
            this.clients.forEach(client => this.sendKosyMessageToIntegrationClient(clientHasLeftMessage, client));
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

        private log (...message: any[]) {
            console.log("Kosy received: ", ...message);
        }
    }
}

//Fetches the settings, then starts the debugger
fetch("settings.json")
.then(response => response.json())
.then(json => new Kosy.Debugger.App().start(json));