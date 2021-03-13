import { ClientInfo } from "./kosyclient"

export type IntegrationToKosyMessage<IntegrationState, IntegrationMessage> =
    | ReadyAndListening
    | RelayMessage<IntegrationMessage>
    | ReceiveIntegrationState<IntegrationState>
    | EndIntegration

export interface ReadyAndListening {
    type: "ready-and-listening";
    payload: any; //not known yet -> should probably contain an integration identifier
}

export interface ReceiveIntegrationState<IntegrationState> {
    type: "receive-integration-state";
    payload: IntegrationState
}

export interface RelayMessage<IntegrationMessage> {
    type: "relay-message";
    payload: IntegrationMessage;
}

export interface EndIntegration {
    type: "end-integration";
    payload: any; //not known yet -> should probably contain an integration identifier
}

export type KosyToIntegrationMessage<IntegrationState, IntegrationMessage> =    
    | ReceiveInitialInfo<IntegrationState>
    | RequestIntegrationState
    | ClientHasJoined
    | ClientHasLeft
    | ReceiveMessage<IntegrationMessage>

/// Note: this message is also used when the client info has changed (e.g. seat number or name)
export interface ReceiveInitialInfo<IntegrationState> {
    type: "receive-initial-info";
    payload: {
        /// Information about all clients present
        clients: { [clientUuid: string]: ClientInfo };
        /// The current client's identifier
        currentClientUuid: string;
        /// The initializing client's identifier
        initializerClientUuid: string;
        currentIntegrationState?: IntegrationState
    }
}

export interface RequestIntegrationState {
    type: "request-integration-state";
    payload: {}
}

/// Note: this message is also used when the client info has changed (e.g. seat number or name)
export interface ClientHasJoined {
    type: "client-has-joined";
    payload: ClientInfo;
}

export interface ClientHasLeft {
    type: "client-has-left";
    payload: ClientInfo;
}

export interface ReceiveMessage<IntegrationMessage> {
    type: "receive-message";
    payload: IntegrationMessage;
}