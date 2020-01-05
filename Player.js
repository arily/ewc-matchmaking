const AbortController = require('abort-controller');
const EApi = require("EApi");
const E = new EApi();

function timeoutSignal(timeout = 5) {
    const controller = new AbortController()
    const signal = controller.signal
    setTimeout(() => {
        controller.abort()
    }, timeout * 1000)
    return signal;
}

function MatchmakingPlayer() {

}
MatchmakingPlayer.prototype.init = async function(player) {
    this.qq = player.qq;
    this.id = player.id;
    this.name = player.name;
    let elo = await E.users.elo(this.id, { signal: timeoutSignal(20) })
    this.fob = (elo.code == 40004);
    this.elo = elo.elo;
    this.createdAt = new Date().getTime();
}
create = async function(player) {
    const obj = new MatchmakingPlayer();
    await obj.init(player);
    return obj;
}

module.createPlayer = create;