
function MatchmakingPlayer() {

}
MatchmakingPlayer.prototype.init = async function(player) {
    this.handle = player.handle;
    this.id = +player.id;
    this.elo = player.elo
    this.fob = !!player.fob
    this.createdAt = new Date().getTime();
}
create = async function(player) {
    const obj = new MatchmakingPlayer();
    await obj.init(player);
    return obj;
}

module.exports = create;