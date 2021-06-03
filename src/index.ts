import { ClientInfo } from '@kosy/kosy-app-api/types';
import * as KosyMessages from '@kosy/kosy-app-api/messages';
import { renderKosyClient } from './views/renderKosyClient';
import { generateClientInfo } from './generateClientInfo';
import { DebuggerState } from './lib/debuggerState';
import { renderSetup } from './views/renderSetup';
import { storeState, retrieveState } from './lib/stateStorage';

module Kosy.Debugger {
    //Convenience interface that links a "client" to its "iframe"
    interface KosyClient { 
        info: ClientInfo,
        initialized: boolean,
        iframe: HTMLIFrameElement
    }

    //Represents "any" app client's state type
    type AppState = unknown;
    //Represents "any" app client to host message type
    type ClientToHostMessage = unknown;
    //Represents "any" app host to client message type
    type HostToClientMessage = unknown;

    export class App {
        //A collection of all clients
        private state: DebuggerState
        private clients: Array<KosyClient> = [];

        //Starts the debugger
        public start (initialState: DebuggerState): void {
            this.state = initialState;
            //Sets up the message listener to listen for incoming messages
            window.addEventListener("message", (event: MessageEvent<KosyMessages.AppToKosyMessage<AppState, ClientToHostMessage, HostToClientMessage>>) => {
                this.receiveIncomingMessage(event.data, event.source);
            });
            //Sets up the "add-client" button for onclick events
            (document.getElementById("add-client") as HTMLButtonElement).onclick = event => {
                if (this.state['app-url']) {
                    this.addNewClient (this.state["app-url"]);
                } else {
                    alert ("Please select an app URL first")
                }
            }
            (document.getElementById("setup") as HTMLButtonElement).onclick = async event => {
                let newState = await renderSetup (this.state);
                this.state = newState;
                storeState(newState);
            }
        }

        //Receives a message from an app to the debugger (kosy)
        public receiveIncomingMessage (eventData: KosyMessages.AppToKosyMessage<AppState, ClientToHostMessage, HostToClientMessage>, source: MessageEventSource) {
            switch (eventData.type) {
                //If we've received the initial message
                case "ready-and-listening": {
                    this.log("Ready and listening.");
                    //Figure out which app client sent it
                    let kosyClients = this.clients.filter(client => client.iframe.contentWindow === source);
                    if (kosyClients.length === 1) {
                        let kosyClient = kosyClients[0];

                        
                        if (this.clients.length === 1) {
                            //If there's only one client at the table return an empty state
                            this.sendInitialInfoMessage(kosyClient, {
                                type: "receive-app-state",
                                clientUuids: [ kosyClient.info.clientUuid ],
                                latestMessageNumber: 0,
                                state: null
                            });

                            //Send the updated client info to the host
                            let clientHasJoinedMessage: KosyMessages.SetClientInfo = {
                                type: "set-client-info",
                                clients: this.clients.reduce((clients: { [clientUuid: string]: ClientInfo }, nextClient) => { clients[nextClient.info.clientUuid] = nextClient.info; return clients; }, {}),
                                hostClientUuid: this.clients[0].info.clientUuid
                            };
                            this.sendKosyMessageToAppClient(clientHasJoinedMessage, this.clients[0]);
                        } else {
                            //Request the app's state from the "host"
                            this.sendKosyMessageToAppClient({ 
                                type: "get-app-state",
                                clientUuids: [ kosyClient.info.clientUuid ]
                            }, this.clients[0]);
                        }
                    } else {
                        //This SHOULD not occur, but, yea... javascript :D
                        throw "Could not find the message's source, this should not occur?"
                    }
                    break;
                }
                case "receive-app-state": {
                    this.log("Kosy received the app's current state: ", eventData.state);
                    //Send the app client its initial info
                    this.clients
                        .filter(client => !client.initialized)
                        .forEach(client => {
                            this.sendInitialInfoMessage(client, eventData);
                            client.initialized = true;
                        });

                    //Send the updated client info to the host
                    let clientHasJoinedMessage: KosyMessages.SetClientInfo = {
                        type: "set-client-info",
                        clients: this.clients.reduce((clients: { [clientUuid: string]: ClientInfo }, nextClient) => { clients[nextClient.info.clientUuid] = nextClient.info; return clients; }, {}),
                        hostClientUuid: this.clients[0].info.clientUuid
                    };
                    this.sendKosyMessageToAppClient(clientHasJoinedMessage, this.clients[0]);                    
                    break;
                }
                case "relay-message-to-host": {
                    this.log("Relay message to host: ", eventData.message);
                    let receiveMessage: KosyMessages.ReceiveMessageAsHost<ClientToHostMessage> = {
                        type: "receive-message-as-host",
                        message: eventData.message
                    };
                    this.sendKosyMessageToAppClient(receiveMessage, this.clients[0]);
                    break;
                }
                case "relay-message-to-clients": {
                    this.log("Relay message to clients: ", eventData.message);
                    let receiveMessage: KosyMessages.ReceiveMessageAsClient<HostToClientMessage> = {
                        type: "receive-message-as-client",
                        message: eventData.message,
                        messageNumber: eventData.messageNumber,
                        sentByClientUuid: eventData.sentByClientUuid
                    };
                    this.clients.forEach(client => this.sendKosyMessageToAppClient(receiveMessage, client));
                    break;
                }
                case "stop-app": {
                    this.log("Stop app");
                    [ ...this.clients ].forEach(client => this.removeClient(client.info.clientUuid));
                    break;
                }
                default:
                    //Ignore unknown messages
                    break;
            }
        }

        //Adds a new client to the debugger
        private addNewClient (url: string): void {
            let info = generateClientInfo (this.clients.map(client => client.info));
            let iframe = renderKosyClient (info, url, (clientUuid) => this.removeClient(clientUuid));

            let kosyClient = { info, iframe, initialized: false };
            this.clients.push(kosyClient);
        }

        //Removes a client from the debugger, broadcasts "client has left" and removes the client from the DOM
        private removeClient (clientUuid: string): void {
            let removedClient = this.clients.find(existing => existing.info.clientUuid == clientUuid);
            this.clients = this.clients.filter(existing => existing != removedClient);
            let clientHasLeftMessage: KosyMessages.SetClientInfo = {
                type: "set-client-info",
                clients: this.clients.reduce((clients: { [clientUuid: string]: ClientInfo }, nextClient) => { clients[nextClient.info.clientUuid] = nextClient.info; return clients; }, {}),
                hostClientUuid: this.clients[0]?.info.clientUuid
            };
            this.sendKosyMessageToAppClient(clientHasLeftMessage, this.clients[0]);
            //Not the safest way to do this... but it works.
            removedClient.iframe.parentElement.remove();
        }

        //Sends initialization info the kosy client
        private sendInitialInfoMessage (kosyClient: KosyClient, receiveAppState: KosyMessages.ReceiveAppState<AppState>) {
            let initialInfo: KosyMessages.ReceiveInitialInfo<AppState> = {
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
                    currentAppState: receiveAppState.state
                },
                latestMessageNumber: receiveAppState.latestMessageNumber
            };
            this.sendKosyMessageToAppClient(initialInfo, kosyClient);
        }

        //Sends a message from the debugger (kosy) to an app
        public sendKosyMessageToAppClient (message: KosyMessages.KosyToAppMessage<AppState, ClientToHostMessage, HostToClientMessage>, toClient: KosyClient) {
            toClient?.iframe.contentWindow.postMessage(message, toClient.iframe.src);
        }

        private log (...message: any[]) {
            console.trace("Kosy received: ", ...message);
        }
    }

    new Kosy.Debugger.App().start(retrieveState());
}