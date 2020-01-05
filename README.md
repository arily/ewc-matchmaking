# ewc-matchmaking
matchmaking component for ewc

```
const { Matchmaking, createPlayer } = require("ewc-matchmaking")

async function test() {
    const match = new Matchmaking();
    let arily = await Player({ qq: 1919810, id: 2, name:'arily' });
    let TiRa = await Player({ qq: 114514, id: 3, name:'TiRa' });
    match.putIn(arily);
    match.putIn(TiRa);
    let all = match.list();
    console.log('all players:', all);
    let suitableForArily = match.findPlayerInRange(arily,400);
    console.log('suitableForArily:',suitableForArily);
}

test();
```
