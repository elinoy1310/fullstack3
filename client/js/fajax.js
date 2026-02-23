/*
📄 fajax.js

Role: Fake AJAX implementation.
Communicates with: network.js

Main component:
Class FXMLHttpRequest

Important methods:

open(method, url)

send(body)

onreadystatechange

status

responseText

Each request:

Creates new FXMLHttpRequest

Sends JSON string

Waits asynchronously for response
*/

class FXMLHttpRequest {

    constructor() {
        this.method = null;
        this.url = null;
        this.onreadystatechange = null;
        this.readyState = 0;
        this.status = 0;
        this.responseText = null;
    }

    open(method, url) {
        this.method = method;
        this.url = url;
    }

    send(body) {

        const request = {
            method: this.method,
            url: this.url,
            body
        };

        Network.send(request, (response) => {

            if (!response) {
                this.status = 0;
                this.responseText = JSON.stringify({ message: "Network error" });
            } else {
                this.status = response.status;
                this.responseText = response.body;
            }

            this.readyState = 4;

            if (this.onreadystatechange) {
                this.onreadystatechange();
            }
        });
    }
}