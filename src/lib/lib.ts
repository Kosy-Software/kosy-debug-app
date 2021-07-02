import { ClientInfo } from '@kosy/kosy-app-api/types';
import { AppToKosyMessage } from '@kosy/kosy-app-api/messages'

//Convenience interface that links a "client" to its "iframe"
export interface KosyClient { 
    info: ClientInfo;
    initialized: boolean;
    iframe: HTMLIFrameElement;
}

export type KosyClientEvent<AppState, ClientToHostMessage, HostToClientMessage> = {
    "delete": { clientUuid: string };
    "switch-seat": {clientUuid: string};
    "make-host": {clientUuid: string};
    "receive-incoming-message": { clientUuid: string, message: AppToKosyMessage<AppState, ClientToHostMessage, HostToClientMessage> }
}