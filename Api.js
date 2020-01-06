const fetch = require('node-fetch');
const AbortController = require('abort-controller');
class EndpointServerSideError extends Error {
    constructor(res) {
        super(res.message); // (1)
        this.name = "EndpointServerSideError"; // (2)
    }
}
async function checkStatus(res, json) {
    if (res.ok) { // res.status >= 200 && res.status < 300
        return res;
    } else {
        return EndpointServerSideError(json.message);
    }
}

function EWCMatchmakingApi(server, options) {
    this.options = options;
    this.base = server;
}
EWCMatchmakingApi.prototype.apiCall = async function(endpoint, options) {
    let response = await fetch(`${this.base}/api${endpoint}`, options)
    let json = await response.json();
    checkStatus(response, json);
    return json;
}

EWCMatchmakingApi.prototype.getUser = async function({ handle }, options) {
    return this.apiCall(`/user`, options);
}
EWCMatchmakingApi.prototype.putUser = async function({ u, handle }, options) {
    return this.apiCall(`/user`, Object.assign(options, { method: "PUT" }));
}
EWCMatchmakingApi.prototype.deleteUser = async function({ handle }, options) {
    return this.apiCall(`/user`, Object.assign(options, { method: "DELETE" }));
}