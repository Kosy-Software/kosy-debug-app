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

export type ClientLocation =
    | SeatedAtTable
    | InPrivateConversation

export interface ClientInfo {
    clientUuid: string;
    clientName: string;
    clientLocation: ClientLocation;
}

export interface InitialInfo {
    /// Information about all clients present
    clients: { [clientUuid: string]: ClientInfo };
    /// The current client's identifier
    currentClientUuid: string;
    /// The initializing client's identifier
    initializerClientUuid: string;
}

/// Note: this message is also used when the client info has changed (e.g. seat number or name)
export interface ReceiveInitialInfo {
    type: "receive-initial-info"
    payload: InitialInfo
}

export interface ReceiveMessage<T> {
    type: "receive-message";
    payload: T;
}

export interface ClientHasLeft {
    type: "client-has-left";
    payload: ClientInfo
}

/// Note: this message is also used when the client info has changed (e.g. seat number or name)
export interface ClientHasJoined {
    type: "client-has-joined";
    payload: ClientInfo
}

export type ServerToClientMessage<T> =
    | ReceiveInitialInfo
    | ClientHasJoined
    | ClientHasLeft
    | ReceiveMessage<T>

export interface ReadyAndListening {
    type: "ready-and-listening";
    payload: any; //not known yet
}

export interface RelayMessage<T> {
    type: "relay-message"
    payload: T
}

export type ClientToServerMessage<T> =
    | ReadyAndListening
    | RelayMessage<T>