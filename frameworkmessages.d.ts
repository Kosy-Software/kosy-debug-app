declare namespace Kosy {
    type IntegrationToKosyMessage<T> =
        | ReadyAndListening
        | RelayMessage<T>

    interface ReadyAndListening {
        type: "ready-and-listening";
        payload: any; //not known yet
    }

    interface RelayMessage<T> {
        type: "relay-message"
        payload: T
    }

    type KosyToIntegrationMessage<T> =
        | ReceiveInitialInfo
        | ClientHasJoined
        | ClientHasLeft
        | ReceiveMessage<T>

    /// Note: this message is also used when the client info has changed (e.g. seat number or name)
    interface ReceiveInitialInfo {
        type: "receive-initial-info"
        payload: InitialInfo
    }

    interface InitialInfo {
        /// Information about all clients present
        clients: { [clientUuid: string]: ClientInfo };
        /// The current client's identifier
        currentClientUuid: string;
        /// The initializing client's identifier
        initializerClientUuid: string;
    }

    interface ClientInfo {
        clientUuid: string;
        clientName: string;
        clientLocation: ClientLocation;
    }

    type ClientLocation =
        | SeatedAtTable
        | InPrivateConversation

    interface SeatedAtTable {
        type: "seated-at-table";
        building: Building;
        floor: Floor;
        room: Room;
        table: Table;
        seatNumber: number;
    }

    interface InPrivateConversation {
        type: "in-private-conversation";
        conversationKey: string;
    }

    interface Building {
        buildingKey: string;
        buildingName: string;
    }

    interface Floor {
        floorUuid: string;
        floorName: string
    }

    interface Room {
        roomUuid: string;
        roomName: string;
    }

    interface Table {
        tableUuid: string;
        tableName: string;
        numberOfSeats: number;
    }

    /// Note: this message is also used when the client info has changed (e.g. seat number or name)
    interface ClientHasJoined {
        type: "client-has-joined";
        payload: ClientInfo
    }

    interface ClientHasLeft {
        type: "client-has-left";
        payload: ClientInfo
    }

    interface ReceiveMessage<T> {
        type: "receive-message";
        payload: T;
    }
}