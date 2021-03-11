export type IntegrationToKosyMessage<T> =
    | ReadyAndListening
    | RelayMessage<T>

export interface ReadyAndListening {
    type: "ready-and-listening";
    payload: any; //not known yet
}

export interface RelayMessage<T> {
    type: "relay-message"
    payload: T
}

export type KosyToIntegrationMessage<T> =
    | ReceiveInitialInfo
    | ClientHasJoined
    | ClientHasLeft
    | ReceiveMessage<T>

/// Note: this message is also used when the client info has changed (e.g. seat number or name)
export interface ReceiveInitialInfo {
    type: "receive-initial-info"
    payload: InitialInfo
}

export interface InitialInfo {
    /// Information about all clients present
    clients: { [clientUuid: string]: ClientInfo };
    /// The current client's identifier
    currentClientUuid: string;
    /// The initializing client's identifier
    initializerClientUuid: string;
}

export interface ClientInfo {
    clientUuid: string;
    clientName: string;
    clientLocation: ClientLocation;
}

export type ClientLocation =
    | SeatedAtTable
    | InPrivateConversation

export interface SeatedAtTable {
    type: "seated-at-table";
    building: Building;
    floor: Floor;
    room: Room;
    table: Table;
    seatNumber: number;
}

export interface InPrivateConversation {
    type: "in-private-conversation";
    conversationKey: string;
}

export interface Building {
    buildingKey: string;
    buildingName: string;
}

export interface Floor {
    floorUuid: string;
    floorName: string
}

export interface Room {
    roomUuid: string;
    roomName: string;
}

export interface Table {
    tableUuid: string;
    tableName: string;
    numberOfSeats: number;
}

/// Note: this message is also used when the client info has changed (e.g. seat number or name)
export interface ClientHasJoined {
    type: "client-has-joined";
    payload: ClientInfo
}

export interface ClientHasLeft {
    type: "client-has-left";
    payload: ClientInfo
}

export interface ReceiveMessage<T> {
    type: "receive-message";
    payload: T;
}