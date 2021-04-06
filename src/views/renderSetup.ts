import { DebuggerState } from '../lib/debuggerState';
import "tingle.js/dist/tingle.min.css";
import * as tingle from "tingle.js";

export function renderSetup (state: DebuggerState): Promise<DebuggerState> {
    let modal: tingle.modal = null;
    return new Promise((resolve, reject) => {
        const template = document.querySelector("#setupRoot") as HTMLTemplateElement;
        const copy = template.content.firstElementChild.cloneNode(true) as HTMLElement;
        const inputElement = copy.querySelector("#app-url") as HTMLInputElement;
        inputElement.value = state['app-url'] || "";

        const onClose = () => {
            const appUrl = inputElement.value;
            if (appUrl) return resolve({ "app-url": appUrl });
            return reject();
        }

        const confirmationBtn = copy.querySelector("#confirm") as HTMLButtonElement;
        confirmationBtn.onclick = (e) => onClose();
        const cancelBtn = copy.querySelector("#cancel") as HTMLButtonElement;
        cancelBtn.onclick = (e) => reject();

        modal = new tingle.modal({
            footer: false,
            closeMethods: ['overlay', 'escape'],
            closeLabel: "Close",
            onClose: () => onClose()            
        });
        modal.setContent(copy);
        modal.open();
    }).finally(() => modal?.close());
}