// const EApi = require("ewc-api");
// const E = new EApi();
function MatchmakingCollection (collection){
    this.players = collection;
}
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
Matchmaking.prototype.getCollection = function(){
    return new MatchmakingCollection(this.players);
}

MatchmakingCollection.prototype.findMatchingModeIs = function(matchingMode, collection = this.players) {
    return new MatchmakingCollection(collection.filter(match => match.matchingMode.includes(matchingMode)));
}
MatchmakingCollection.prototype.findPlayersMatchmaking = function(collection = this.players) {
    return new MatchmakingCollection( collection.filter(match => match.status == 'matchmaking'));
}
MatchmakingCollection.prototype.findPlayersPending = function(collection = this.players) {
    return new MatchmakingCollection( collection.filter(match => match.status == 'pending'));
}
MatchmakingCollection.prototype.findPlayersPlaying = function(collection = this.players) {
    return new MatchmakingCollection( collection.filter(match => match.status == 'playing'));
}
MatchmakingCollection.prototype.setPlayersMatchmaking = function(collection = []) {
    return new MatchmakingCollection( collection.map(match => {
        match.matchmaking();
        return match;
    }))
}
MatchmakingCollection.prototype.setPlayersPending = function(collection = []) {
    return new MatchmakingCollection( collection.map(match => {
        match.pending();
        return match;
    }))
}
MatchmakingCollection.prototype.setPlayersPlaying = function(collection = []) {
    return new MatchmakingCollection( collection.map(match => {
        match.playing();
        return match;
    }))
}


exports.Matchmaking = Matchmaking;
exports.Player = require("./Player")
exports.Api = require('./Api');