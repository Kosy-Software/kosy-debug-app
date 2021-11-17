<script lang="ts">
    import { ClientInfo } from '@kosy/kosy-app-api/types';
    import * as KosyMessages from '@kosy/kosy-app-api/messages';
    import { generateClientInfo } from '../lib/generateClientInfo';
    import { DebuggerState } from '../lib/debuggerState';
    import { storeState, retrieveState } from '../lib/stateStorage';
    import { KosyClient } from '../lib/lib';
    import Setup from './Setup.svelte';
    import { default as KosyClientComponent } from './KosyClient.svelte';
    import { getContext } from 'svelte';

    //Represents "any" app client's state type
    type AppState = unknown;
    //Represents "any" app client to host message type
    type ClientToHostMessage = unknown;
    //Represents "any" app host to client message type
    type HostToClientMessage = unknown;

    let state: DebuggerState = retrieveState();
    let hostClient: KosyClient;
    let clients: KosyClient[] = [];

    //Sets up the message listener to listen for incoming messages
    //Sets up the "add-client" button for onclick events
    let addClient = () => {
        if (state["app-url"]) {
            let info = generateClientInfo (clients.map(client => client.info));
            let kosyClient: KosyClient = { info, iframe: undefined, initialized: false };
            clients = [ ...clients, kosyClient ];
            if (clients.length === 1) {
                hostClient = clients[0];
            }
        } else {
            alert ("Please select an app URL first");
        }
    }

    let receiveIncomingMessage = (eventData: KosyMessages.AppToKosyMessage<AppState, ClientToHostMessage, HostToClientMessage>, source: MessageEventSource) => {
        switch (eventData.type) {
            //If we've received the initial message
            case "ready-and-listening": {
                log("Ready and listening.");
                //Figure out which app client sent it
                let kosyClients = clients.filter(client => client.iframe.contentWindow === source);
                if (kosyClients.length === 1) {
                    let kosyClient = kosyClients[0];
                    kosyClient.initialized = false;
                    
                    if (clients.length === 1) {
                        initializeClients({
                            type: "receive-app-state",
                            clientUuids: [ kosyClient.info.clientUuid ],
                            latestMessageNumber: 0,
                            state: null
                        });
                    } else {
                        //Request the app's state from the "host"
                        sendKosyMessageToAppClient({ 
                            type: "get-app-state",
                            clientUuids: [ kosyClient.info.clientUuid ]
                        }, hostClient);
                    }
                } else {
                    //This SHOULD not occur, but, yea... javascript :D
                    throw "Could not find the message's source, this should not occur?"
                }
                break;
            }
            case "receive-app-state": {
                log("Kosy received the app's current state: ", eventData.state);
                initializeClients(eventData);
                break;
            }
            case "relay-message-to-host": {
                log("Relay message to host: ", eventData.message);
                let receiveMessage: KosyMessages.ReceiveMessageAsHost<ClientToHostMessage> = {
                    type: "receive-message-as-host",
                    message: eventData.message
                };
                sendKosyMessageToAppClient(receiveMessage, hostClient);
                break;
            }
            case "relay-message-to-clients": {
                log("Relay message to clients: ", eventData.message);
                let receiveMessage: KosyMessages.ReceiveMessageAsClient<HostToClientMessage> = {
                    type: "receive-message-as-client",
                    message: eventData.message,
                    messageNumber: eventData.messageNumber,
                    sentByClientUuid: eventData.sentByClientUuid
                };
                clients.forEach(client => sendKosyMessageToAppClient(receiveMessage, client));
                break;
            }
            case "stop-app": {
                log("Stop app");
                [ ...clients ].forEach(client => removeClient(client.info.clientUuid));
                break;
            }
            default:
                //Ignore unknown messages
                break;
        }
    }
    window.addEventListener("message", (e) => receiveIncomingMessage(e.data, e.source));

    //Removes a client from the debugger, broadcasts "client has left" and removes the client from the DOM
    let removeClient = (clientUuid: string) => {
        let removedClient = clients.find(existing => existing.info.clientUuid == clientUuid);
        clients = clients.filter(existing => existing != removedClient);
        if (hostClient?.info.clientUuid === clientUuid) {
            hostClient = clients[0];
        }
        let clientHasLeftMessage: KosyMessages.SetClientInfo = {
            type: "set-client-info",
            clients: clients.reduce((clients: { [clientUuid: string]: ClientInfo }, nextClient) => { clients[nextClient.info.clientUuid] = nextClient.info; return clients; }, {}),
            hostClientUuid: hostClient.info.clientUuid
        };
        sendKosyMessageToAppClient(clientHasLeftMessage, hostClient);
    }

    let initializeClients = (message: KosyMessages.ReceiveAppState<AppState>) => {
        //Send the app client its initial info
        clients
            .filter(client => !client.initialized)
            .forEach(client => {
                let initialInfo: KosyMessages.ReceiveInitialInfo<AppState> = {
                    type: "receive-initial-info",
                    payload: {
                        clients:
                            //starts with an empty object, then fills the object with { "client identifier": client info }
                            clients.reduce((map: { [clientUuid: string]: ClientInfo }, nextValue) => { 
                                map[nextValue.info.clientUuid] = nextValue.info;
                                return map;
                            }, {}),
                        currentClientUuid: client.info.clientUuid,
                        initializerClientUuid: clients[0].info.clientUuid,
                        currentAppState: message.state,
                        locationUuid: "Kosy_Debug_App",
                        locationName: "Kosy debug app"
                    },
                    latestMessageNumber: message.latestMessageNumber
                };
                sendKosyMessageToAppClient(initialInfo, client);
                client.initialized = true;
            });

        //Send the updated client info to the host
        let clientHasJoinedMessage: KosyMessages.SetClientInfo = {
            type: "set-client-info",
            clients: clients.reduce((clients: { [clientUuid: string]: ClientInfo }, nextClient) => { clients[nextClient.info.clientUuid] = nextClient.info; return clients; }, {}),
            hostClientUuid: hostClient?.info.clientUuid
        };
        sendKosyMessageToAppClient(clientHasJoinedMessage, hostClient);  
    }

    //Sends a message from the debugger (kosy) to an app
    let sendKosyMessageToAppClient = (message: KosyMessages.KosyToAppMessage<AppState, ClientToHostMessage, HostToClientMessage>, toClient: KosyClient) => {
        toClient?.iframe.contentWindow.postMessage(message, toClient.iframe.src);
    }

    let log = (...message: any[]) => {
        if (localStorage.getItem("trace-on") === "1") {
            console.trace("Kosy received: ", ...message);
        }else {
            console.log("Kosy received: ", ...message);
        }
    }

    let changeStateIfNecessary = (debuggerState: DebuggerState) => {
        if (debuggerState["app-url"] !== state["app-url"]) {
            clients = [];
            state["app-url"] = debuggerState["app-url"];
        }
    }

    let { open } = getContext("simple-modal");
    let showSetup = () => {
        open(
            //Component to show within modal
            Setup, 
            {
                //Component args
                appUrl: state["app-url"] 
            },
            {
                //Modal styling
                styleWindow: { "border-radius": "36px", "max-width": "530px", "background": "white" }, 
                styleContent: { "padding": "1.5rem 3rem" },
                styleBg: { "background": "rgba(29, 34, 79, 0.65)" }
            }, {
                //Events (onOpen, onOpened, onClose, onClosed)
                onClosed: () => changeStateIfNecessary(retrieveState()) 
            });
    }
    
    let clientUuidSwitchingSeat: string = null;
    let switchSeat = (clientUuid: string) => {
        if (clientUuidSwitchingSeat) {
            if (clientUuid !== clientUuidSwitchingSeat) {
                let client1 = clients.find(client => client.info.clientUuid == clientUuidSwitchingSeat);
                let client2 = clients.find(client => client.info.clientUuid == clientUuid);
                let seat1 = client1?.info.seatNumber;
                let seat2 = client2?.info.seatNumber;
                client1.info.seatNumber = seat2;
                client2.info.seatNumber = seat1;
                clients = clients;
            }            
            clientUuidSwitchingSeat = null;
        } else {
            clientUuidSwitchingSeat = clientUuid;
        }
    }
    let makeHost = (clientUuid: string) => {
        hostClient = clients.find(client => client.info.clientUuid == clientUuid);
        let hostHasChangedMessage: KosyMessages.SetClientInfo = {
            type: "set-client-info",
            clients: clients.reduce((clients: { [clientUuid: string]: ClientInfo }, nextClient) => { clients[nextClient.info.clientUuid] = nextClient.info; return clients; }, {}),
            hostClientUuid: hostClient.info.clientUuid
        };
        sendKosyMessageToAppClient(hostHasChangedMessage, hostClient);
    }
</script>

<h1>Welcome to the Kosy Debug app</h1>
<p>You can test Kosy Table Apps here. For this purpose, you can click on "Change app URL" and paste the URL of the table app in the modal. Then click "Add another client". Voila, your app is there!</p>
<p>To switch seats you need to click "Switch seat" on one client, then click "Switch seat" on another client.</p>
<div class="gutter-xs"></div>
<div class="rounded-buttons">
    <button on:click={() => showSetup()}>Change app URL</button>
    <button id="add-client" on:click={addClient}>Add another client</button>
</div>
<div class="gutter-sm"></div>
{#if state["app-url"]}
    {#each clients as client (client) }
        <KosyClientComponent 
            hostClientUuid={hostClient.info.clientUuid} 
            {client}
            {clientUuidSwitchingSeat}
            on:delete={(event) => removeClient(event.detail.clientUuid)} 
            on:switch-seat={(event) => switchSeat(event.detail.clientUuid)} 
            on:make-host={(event) => makeHost(event.detail.clientUuid)}>
            <iframe title="table-app" src={state["app-url"] + "?clientId=" + client.info.clientUuid} bind:this={client.iframe}></iframe>
        </KosyClientComponent>
    {/each}
{/if}