// XMLHttpRequest status codes
const UNSENT = 0;
const OPENED = 1;
const HEADERS_RECEIVED = 2; // Not used in this simulation because headers are not processed
const LOADING = 3; // Not used because the simulated response is returned in a single step
const DONE = 4;

class FXMLHttpRequest {

    constructor() {
        this.method = null;
        this.url = null;
        this.onerror = null;
        this.onreadystatechange = null;
        this.readyState = UNSENT;
        this.status = 0;
        this.responseText = null;
    }

    open(method, url) {
        this.method = method;
        this.url = url;

        this.readyState = OPENED;

        if (this.onreadystatechange) {
            this.onreadystatechange();
        }
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
                if (this.onerror) {
                    this.onerror();
                }

                return;
            } else {
                this.status = response.status;
                this.responseText = response.body;
            }

            this.readyState = DONE;

            if (this.onreadystatechange) {
                this.onreadystatechange();
            }
        });
    }
}