// const EApi = require("ewc-api");
// const E = new EApi();

function Matchmaking(options = {}) {
    this.options = options;
    this.players = [];
    // this.matchedPlayers = [];
    this.timeouts = {};
}

Matchmaking.prototype.put = Matchmaking.prototype.putIn = function(player) {

    try {
        this.players.push(player);
        this.timeouts[player.id] = setTimeout((player) => this.remove(player), this.options.timeout || 1000 * 60 * 60 * 6, player);
        return true;
    } catch (Error) {
        return false;
    }

}
Matchmaking.prototype.remove = function(player) {
    this.players = this.players.filter(match => match.handle !== player.handle);

    if (this.timeouts[player.id] !== undefined) {
        clearTimeout(this.timeouts[player.id]);
    }

}
Matchmaking.prototype.findByQQ = function(qq) {
    return this.players.filter(match => match.qq == qq);
}
Matchmaking.prototype.findById = function(id) {
    return this.players.filter(match => match.id == id);
}
Matchmaking.prototype.findByHandle = function(handle) {
    return this.players.filter(match => match.handle == handle);
}
Matchmaking.prototype.list = function() {
    return JSON.parse(JSON.stringify(this.players));
}
Matchmaking.prototype.findPlayersInRange = Matchmaking.prototype.findPlayerInRange = function(player, range = 400) {
    if (player == undefined) {
        return [];
    }
    range = {
        max: player.elo + range,
        min: player.elo - range
    }
    let suitablePlayer = this.players.filter(match => range.max >= match.elo && match.elo >= range.min && match.id !== player.id);
    return suitablePlayer;
}


Matchmaking.prototype.findMatchingModIs = function(matchingMod, collection = this.players) {
    return collection.filter(match => match.matchingMod.includes(matchingMod));
}
Matchmaking.prototype.findPlayersMatchmaking = function(collection = this.players) {
    return collection.filter(match => match.status == 'matchmaking');
}
Matchmaking.prototype.findPlayersPending = function(collection = this.players) {
    return collection.filter(match => match.status == 'pending');
}
Matchmaking.prototype.findPlayersPlaying = function(collection = this.players) {
    return collection.filter(match => match.status == 'playing');
}
Matchmaking.prototype.setPlayersMatchmaking = function(collection = []) {
    return collection.map(match => {
        match.matchmaking();
        return match;
    })
}
Matchmaking.prototype.setPlayersPending = function(collection = []) {
    return collection.map(match => {
        match.pending();
        return match;
    })
}
Matchmaking.prototype.setPlayersPlaying = function(collection = []) {
    return collection.map(match => {
        match.playing();
        return match;
    })
}


exports.Matchmaking = Matchmaking;
exports.createPlayer = require("./Player")
exports.Api = require('./Api');