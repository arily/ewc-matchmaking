function PlayerNotify(){
    this.eventListener 
}
function MatchmakingPlayer(player) {
    this.handle = player.handle;
    this.id = +player.id;
    this.elo = player.elo;
    this.fob = !!player.fob;
    this.matchingMode = player.matchingMode;
    this.createdAt = new Date().getTime();
    this.status = 'matchmaking';
}

MatchmakingPlayer.prototype.matchmaking = function() {
    this.status = 'matchmaking';
}
MatchmakingPlayer.prototype.pending = function() {
    this.status = 'pending';
}
MatchmakingPlayer.prototype.playing = function() {
    this.status = 'playing';
}
// create = function(player) {
//     const obj = new MatchmakingPlayer();
//     obj.init(player);
//     return obj;
// }

module.exports = MatchmakingPlayer;