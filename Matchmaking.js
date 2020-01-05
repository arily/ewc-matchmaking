const EApi = require("EApi");
const E = new EApi();

function Matchmaking(options = {}) {
    this.options = options;
    this.players = [];
    this.timeouts = {};
}

Matchmaking.prototype.putIn = function(player) {
    this.players.push(player);
    this.timeouts[player.id] = setTimeout((player)=>this.remove(player), this.options.timeout || 1000 * 60 * 60 * 6, player);
    return true;
}
Matchmaking.prototype.remove = function(player) {
    this.players = this.players.filter(match => match.qq !== player.qq);

    if (this.timeouts[player.id] !== undefined) {
        clearTimeout(this.timeouts[player.id]);
    }

}
Matchmaking.prototype.findByQQ = function(qq) {
    return this.players.filter(match => match.qq == qq);
}
Matchmaking.prototype.list = function() {
    return JSON.parse(JSON.stringify(this.players));
}
Matchmaking.prototype.findPlayerInRange = function(player, range = 400) {
    range = {
        max: player.elo + range,
        min: player.elo - range
    }
    let suitablePlayer = this.players.filter(match => range.max >= match.elo && match.elo >= range.min && match.id !== player.id);
    return suitablePlayer;
}

module.Matchmaking = Matchmaking;
module.createPlayer = require("./Player").createPlayer