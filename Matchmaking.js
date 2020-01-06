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

Matchmaking.prototype.getCollection = function(){
    return new MatchmakingCollection(this.players);
}

MatchmakingCollection.prototype.findMatchingModeIs = function(matchingMode, collection = this.players) {
    return new MatchmakingCollection(collection.filter(user => user.matchingMode.includes(matchingMode)));
}
MatchmakingCollection.prototype.findPlayersMatchmaking = function(collection = this.players) {
    return new MatchmakingCollection( collection.filter(user => user.status == 'matchmaking'));
}
MatchmakingCollection.prototype.findPlayersPending = function(collection = this.players) {
    return new MatchmakingCollection( collection.filter(user => user.status == 'pending'));
}
MatchmakingCollection.prototype.findPlayersPlaying = function(collection = this.players) {
    return new MatchmakingCollection( collection.filter(user => user.status == 'playing'));
}
MatchmakingCollection.prototype.setPlayersMatchmaking = function(collection = this.players) {
    return new MatchmakingCollection( collection.map(user => {
        user.matchmaking();
        return user;
    }))
}
MatchmakingCollection.prototype.setPlayersPending = function(collection = this.players) {
    return new MatchmakingCollection( collection.map(user => {
        user.pending();
        return user;
    }))
}
MatchmakingCollection.prototype.setPlayersPlaying = function(collection = this.players) {
    return new MatchmakingCollection( collection.map(user => {
        user.playing();
        return user;
    }))
}
MatchmakingCollection.prototype.findRankingPlayersSuitableFor = function(player, range = 400) {
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


exports.Matchmaking = Matchmaking;
exports.Player = require("./Player")
exports.Api = require('./Api');