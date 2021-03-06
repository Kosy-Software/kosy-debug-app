declare namespace Kozy {
    type HostHasChanged = {
        type: "HostHasChanged"
        payload: any
    }

    type ReceiveClientInfo = {
        type: "ReceiveClientInfo"
        payload: any
    }

    type ReadyAndListening = {
        type: "ReadyAndListening"
        payload: any
    }

    type RelayToHost = {
        type: "RelayToHost"
        payload: any
    }

    type RelayToAllClients = {
        type: "RelayToAllClients"
        payload: any
    }

    type ServerToClientMessage =
        | HostHasChanged
        | ReceiveClientInfo

    type ClientToServerMessage =
        | ReadyAndListening
        | RelayToHost
        | RelayToAllClients
}