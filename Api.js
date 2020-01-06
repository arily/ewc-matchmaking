const fetch = require('node-fetch');
const AbortController = require('abort-controller');
const { URLSearchParams } = require('url');
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
    const params = new URLSearchParams();
    params.set('handle', handle);
    return this.apiCall(`/user?${params.toString()}`, options);
}
EWCMatchmakingApi.prototype.getAll = async function(options) {
    return this.apiCall(`/all`, options);
}
EWCMatchmakingApi.prototype.getSuitable = async function({ handle }, options) {
    const params = new URLSearchParams();
    params.set('handle', handle);
    return this.apiCall(`/suitable?${params.toString()}`, options);
}
EWCMatchmakingApi.prototype.putUser = async function({ u, handle }, options) {
    const params = new URLSearchParams();
    params.set('handle', handle);
    params.set('u', u);
    return this.apiCall(`/user?${params.toString()}`, Object.assign(options, { method: "PUT" }));
}
EWCMatchmakingApi.prototype.deleteUser = async function({ handle }, options) {
    const params = new URLSearchParams();
    params.set('handle', handle);
    return this.apiCall(`/user?${params.toString()}`, Object.assign(options, { method: "DELETE" }));
}

module.exports = EWCMatchmakingApi;