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
    this.players = this.players.filter(user => user.handle !== player.handle);

    if (this.timeouts[player.id] !== undefined) {
        clearTimeout(this.timeouts[player.id]);
    }

}
Matchmaking.prototype.findByQQ = function(qq) {
    return this.players.filter(user => user.qq == qq);
}
Matchmaking.prototype.findById = function(id) {
    return this.players.filter(user => user.id == id);
}
Matchmaking.prototype.findByHandle = function(handle) {
    return this.players.filter(user => user.handle == handle);
}
Matchmaking.prototype.list = function() {
    return JSON.parse(JSON.stringify(this.players));
}

Matchmaking.prototype.getCollection = function() {
    return new MatchmakingCollection(this.players);
}

function MatchmakingCollection(collection) {
    this.players = collection;
}
MatchmakingCollection.prototype.findMatchingModeIs = function(matchingMode, collection = this.players) {
    return new MatchmakingCollection(collection.filter(user => user.matchingMode.includes(matchingMode)));
}
MatchmakingCollection.prototype.findMatchmaking = function(collection = this.players) {
    return new MatchmakingCollection(collection.filter(user => user.status == 'matchmaking'));
}
MatchmakingCollection.prototype.findPending = function(collection = this.players) {
    return new MatchmakingCollection(collection.filter(user => user.status == 'pending'));
}
MatchmakingCollection.prototype.findPlaying = function(collection = this.players) {
    return new MatchmakingCollection(collection.filter(user => user.status == 'playing'));
}
MatchmakingCollection.prototype.setMatchmaking = function(collection = this.players) {
    return new MatchmakingCollection(collection.map(user => {
        user.matchmaking();
        return user;
    }))
}
MatchmakingCollection.prototype.setPending = function(collection = this.players) {
    return new MatchmakingCollection(collection.map(user => {
        user.pending();
        return user;
    }))
}
MatchmakingCollection.prototype.setPlaying = function(collection = this.players) {
    return new MatchmakingCollection(collection.map(user => {
        user.playing();
        return user;
    }))
}
MatchmakingCollection.prototype.findRankingSuitableFor = function(player, range = 400) {
    if (player == undefined) {
        return [];
    }
    range = {
        max: player.elo + range,
        min: player.elo - range
    }
    let suitablePlayer = this.players.filter(user => range.max >= user.elo && user.elo >= range.min && user.id !== player.id);
    return suitablePlayer;
}
MatchmakingCollection.prototype.toArray = function(collection = this.players){
    return collection;
}
MatchmakingCollection.prototype.filter = function(func,collection = this.players){
    return new MatchmakingCollection(collection.filter(func));
}
MatchmakingCollection.prototype.sort = function(func = undefined,collection = this.players){
    collection.sort(func);
    return this;
}
MatchmakingCollection.prototype.map = function(func,collection = this.players){
    return new MatchmakingCollection(collection.map(func));
}
MatchmakingCollection.prototype.find = function(func,collection = this.players){
    return new MatchmakingCollection(collection.find(func));
}

exports.Matchmaking = Matchmaking;
exports.Player = require("./Player")
exports.Api = require('./Api');