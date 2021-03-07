declare namespace Kozy {
    type HostHasChanged = {
        type: "HostHasChanged";
        payload: any; //not known yet
    }

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
        clientLocation: ClientLocation
    }

    type ReceiveClientInfo = {
        type: "ReceiveClientInfo"
        payload: ClientInfo
    }

    type ReceiveMessage<T> = {
        type: "ReceiveMessage";
        payload: T;
    }

    type ClientHasLeft = {
        type: "ClientHasLeft";
        payload: ClientInfo
    }

    type ClientHasJoined = {
        type: "ClientHasJoined";
        payload: ClientInfo
    }

    type ServerToClientMessage<T> =
        | ReceiveClientInfo
        | ClientHasLeft
        | ClientHasJoined
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