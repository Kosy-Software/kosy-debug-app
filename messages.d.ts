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
        type: "SeatedAtTable";
        building: Building;
        floor: Floor;
        room: Room;
        table: Table;
        seatNumber: number;
    }

    type InPrivateConversation = {
        type: "InPrivateConversation";
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
        /// Information about the current client
        currentClient: ClientInfo;
        /// Could be the same as the current client, in this case, the current user initialized the integration
        initializer: ClientInfo;
    }

    /// Note: this message is also used when the client info has changed (e.g. seat number or name)
    type ReceiveInitialInfo = {
        type: "ReceiveInitialInfo"
        payload: InitialInfo
    }

    type ReceiveMessage<T> = {
        type: "ReceiveMessage";
        payload: T;
    }

    type ClientHasLeft = {
        type: "ClientHasLeft";
        payload: ClientInfo
    }

    /// Note: this message is also used when the client info has changed (e.g. seat number or name)
    type ClientHasJoined = {
        type: "ClientHasJoined";
        payload: ClientInfo
    }

    type ServerToClientMessage<T> =
        | ReceiveInitialInfo
        | ClientHasJoined
        | ClientHasLeft
        | ReceiveMessage<T>

    type ReadyAndListening = {
        type: "ReadyAndListening";
        payload: any; //not known yet
    }

    type RelayMessage<T> = {
        type: "RelayMessage"
        payload: T
    }

    type ClientToServerMessage<T> =
        | ReadyAndListening
        | RelayMessage<T>
}