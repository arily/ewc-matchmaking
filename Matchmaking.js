// const EApi = require("ewc-api");
// const E = new EApi();

function Matchmaking(options = {}) {
    this.options = options;
    this.players = [];
    this.timeouts = {};
}

Matchmaking.prototype.putIn = function(player) {
    this.players.push(player);
    this.timeouts[player.handle] = setTimeout((player)=>this.remove(player), this.options.timeout || 1000 * 60 * 60 * 6, player);
    return true;
}
Matchmaking.prototype.remove = function(player) {
    this.players = this.players.filter(match => match.handle !== player.handle);

    if (this.timeouts[player.handle] !== undefined) {
        clearTimeout(this.timeouts[player.handle]);
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
    if (player == undefined){
        return [];
    }
    range = {
        max: player.elo + range,
        min: player.elo - range
    }
    let suitablePlayer = this.players.filter(match => range.max >= match.elo && match.elo >= range.min && match.id !== player.id);
    return suitablePlayer;
}

exports.Matchmaking = Matchmaking;
exports.createPlayer = require("./Player")
exports.Api = require('./Api');