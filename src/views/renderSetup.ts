import { DebuggerState } from '../lib/debuggerState';
import "tingle.js/dist/tingle.min.css";
import * as tingle from "tingle.js";

export function renderSetup (state: DebuggerState): Promise<DebuggerState> {
    return new Promise((resolve, reject) => {
        let template = document.querySelector("#setupRoot") as HTMLTemplateElement;
        let copy = template.content.firstElementChild.cloneNode(true) as HTMLElement;
        let inputElement = copy.querySelector("#integration-url") as HTMLInputElement;
        inputElement.value = state['integration-url'] || "";

        let modal = new tingle.modal({
            footer: true,
            stickyFooter: false,
            closeMethods: ['overlay', 'button', 'escape'],
            closeLabel: "Close",
            cssClass: [ "rounded-buttons" ],
            onClose: () => {
                let integrationUrl = inputElement.value;
                if (integrationUrl) {
                    resolve({ "integration-url": integrationUrl });
                } else {
                    reject();
                }
            }            
        });
        modal.setContent(copy);

        modal.addFooterBtn("Save", "tingle-btn tingle-btn--primary tingle-btn--pull-right", function() {
            modal.close();
        });

        modal.addFooterBtn("Close", "tingle-btn tingle-btn--danger tingle-btn--pull-right", function() {
            inputElement.value = "";
            modal.close();
        });

        modal.open();
    })
}