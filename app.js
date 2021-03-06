var Kozy;
(function (Kozy) {
    class StartupParameters {
    }
    class KozyDebugger {
        constructor() {
            this.clientClick = document.getElementById("add-client");
            this.clientDiv = document.getElementById("clients");
        }
        sendOutgoingMessage(message, clientIdentifier) {
            let matchingClient = this.clients.find(client => client.identifier = clientIdentifier);
            if (matchingClient) {
                matchingClient.window.contentWindow.postMessage(message, "*");
            }
        }
        receiveIncomingMessage(message) {
            switch (message.type) {
                case "ReadyAndListening":
                    alert("Ready and listening.");
                    break;
                case "RelayToAllClients":
                    alert("Relay to all hosts.");
                    break;
                case "RelayToHost":
                    alert("Relay to host");
                    break;
            }
        }
        start(params) {
            window.addEventListener("message", (event) => {
                this.receiveIncomingMessage(event.data);
            });
            this.clientClick.onclick = event => {
                let iframe = document.createElement("iframe");
                iframe.src = params["integration-url"];
                this.clientDiv.appendChild(iframe);
            };
        }
    }
    Kozy.KozyDebugger = KozyDebugger;
})(Kozy || (Kozy = {}));
window.onload = () => {
    fetch("settings.json")
        .then(response => response.json())
        .then(json => new Kozy.KozyDebugger().start(json));
};
