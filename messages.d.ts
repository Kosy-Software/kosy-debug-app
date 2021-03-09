declare namespace Kosy {
    type Building = {
        buildingKey: string;
        buildingName: string;
    }

    type Floor = {
        floorUuid: string;
        floorName: string
    }

    type Room = {
        roomUuid: string;
        roomName: string;
    }

    type Table = {
        tableUuid: string;
        tableName: string;
        numberOfSeats: number;
    }

    type SeatedAtTable = {
        type: "seated-at-table";
        building: Building;
        floor: Floor;
        room: Room;
        table: Table;
        seatNumber: number;
    }

    type InPrivateConversation = {
        type: "in-private-conversation";
        conversationKey: string;
    }

    type ClientLocation =
        | SeatedAtTable
        | InPrivateConversation

    type ClientInfo = {
        clientUuid: string;
        clientName: string;
        clientLocation: ClientLocation;
    }

    type InitialInfo = {
        /// Information about all clients present
        clients: { [clientUuid: string]: ClientInfo };
        /// The current client's identifier
        currentClientUuid: string;
        /// The initializing client's identifier
        initializerClientUuid: string;
    }

    /// Note: this message is also used when the client info has changed (e.g. seat number or name)
    type ReceiveInitialInfo = {
        type: "receive-initial-info"
        payload: InitialInfo
    }

    type ReceiveMessage<T> = {
        type: "receive-message";
        payload: T;
    }

    type ClientHasLeft = {
        type: "client-has-left";
        payload: ClientInfo
    }

    /// Note: this message is also used when the client info has changed (e.g. seat number or name)
    type ClientHasJoined = {
        type: "client-has-joined";
        payload: ClientInfo
    }

    type ServerToClientMessage<T> =
        | ReceiveInitialInfo
        | ClientHasJoined
        | ClientHasLeft
        | ReceiveMessage<T>

    type ReadyAndListening = {
        type: "ready-and-listening";
        payload: any; //not known yet
    }

    type RelayMessage<T> = {
        type: "relay-message"
        payload: T
    }

    type ClientToServerMessage<T> =
        | ReadyAndListening
        | RelayMessage<T>
}