var Kozy;
(function (Kozy) {
    class StartupParameters {
    }
    class KozyDebugger {
        constructor() {
            this.clients = [];
            this.addClientButton = document.getElementById("add-client");
            this.clientDiv = document.getElementById("clients");
        }
        sendOutgoingMessage(message, clientIdentifier) {
            let matchingClient = this.clients.find(client => client.identifier = clientIdentifier);
            if (matchingClient) {
                matchingClient.iframe.contentWindow.postMessage(message, "*");
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
        addNewClient(url) {
            let iframeContainer = document.createElement("div");
            iframeContainer.style.display = "inline-grid";
            let iframe = document.createElement("iframe");
            iframe.src = url;
            let identifier = Date.now().toString();
            if (!this.clients) {
                this.hostClientIdentifier = identifier;
            }
            iframeContainer.appendChild(iframe);
            let makeHostButton = document.createElement("button");
            makeHostButton.innerHTML = "Make kozy host";
            makeHostButton.onclick = event => {
                this.hostClientIdentifier = identifier;
                this.clients.forEach(client => {
                    this.sendOutgoingMessage({ type: "HostHasChanged", payload: {} }, identifier);
                });
            };
            iframeContainer.appendChild(makeHostButton);
            this.clientDiv.appendChild(iframeContainer);
            this.clients.push({ identifier, iframe, makeHostButton });
        }
        start(params) {
            window.addEventListener("message", (event) => {
                this.receiveIncomingMessage(event.data);
            });
            this.addClientButton.onclick = event => {
                this.addNewClient(params["integration-url"]);
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
