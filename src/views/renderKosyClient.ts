import { ClientInfo } from "../lib/kosyclient";

export function renderKosyClient (clientInfo: ClientInfo, url: string) {
    let template = document.getElementById("clientRoot") as HTMLTemplateElement;
    let templateClone = template.content.firstElementChild.cloneNode(true) as HTMLElement;

    let iframe = templateClone.querySelector("iframe") as HTMLIFrameElement;
    iframe.src = url;
    iframe.id = clientInfo.clientUuid;

    let removeClientButton = templateClone.querySelector("button") as HTMLButtonElement;
    removeClientButton.onclick = event => this.removeClient(clientInfo.clientUuid);

    document.getElementById("clients").appendChild(templateClone);
    return iframe;
}