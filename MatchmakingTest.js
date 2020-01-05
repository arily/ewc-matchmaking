const Player = require("./Player");
const Matchmaking = require("./Matchmaking");



async function test() {
	const match = new Matchmaking();
    let arily = await Player({ qq: 879724291, id: 1123053, name:'arily' });
    let TiRa = await Player({ qq: 114514, id: 9697769, name:'TiRa' });
    match.putIn(arily);
    match.putIn(TiRa);
    let all = match.list();
    console.log('all players:', all);
    let suitableForArily = match.findPlayerInRange(arily,400);
    console.log('suitableForArily:',suitableForArily);
}

test();