// ==============================
// FULL QUANT DESK ENGINE
// ==============================

const MAX_SINGLE = 0.04;     // 4%
const MAX_TOTAL = 0.25;      // 25%
const MIN_EDGE = 0.025;     // 2.5%
const KELLY_SCALE = 0.30;



// remove vig
function removeVig(homeOdds, awayOdds) {

    const p1 = 1/homeOdds;
    const p2 = 1/awayOdds;

    const sum = p1+p2;

    return {
        home: p1/sum,
        away: p2/sum
    };
}



// kelly
function kelly(bankroll, prob, odds) {

    const b = odds-1;

    const k =
        ((prob*b)-(1-prob))/b;

    if(k<=0) return 0;

    return bankroll*k*KELLY_SCALE;
}



// CLV projection score
function clvScore(edge, odds) {

    return edge * odds;
}



// bet quality score
function betScore(edge, prob, odds) {

    return (
        edge * 0.6 +
        prob * 0.3 +
        (1/odds) * 0.1
    );
}



// build portfolio
function buildQuantPortfolio(bankroll, games) {

    let bets = [];

    games.forEach(game=>{

        if(!game.homeOdds || !game.awayOdds)
            return;

        const trueProb =
            removeVig(
                game.homeOdds,
                game.awayOdds
            );

        const impHome = 1/game.homeOdds;
        const impAway = 1/game.awayOdds;

        const edgeHome =
            trueProb.home - impHome;

        const edgeAway =
            trueProb.away - impAway;



        // HOME
        if(edgeHome >= MIN_EDGE){

            const stake =
                kelly(
                    bankroll,
                    trueProb.home,
                    game.homeOdds
                );

            if(stake>0){

                bets.push({

                    team: game.home,
                    vs: game.away,

                    side: "HOME",

                    odds: game.homeOdds,

                    probability:
                        Number(trueProb.home.toFixed(4)),

                    edge:
                        Number(edgeHome.toFixed(4)),

                    stake:
                        Math.min(
                            stake,
                            bankroll*MAX_SINGLE
                        ),

                    score:
                        betScore(
                            edgeHome,
                            trueProb.home,
                            game.homeOdds
                        ),

                    clv:
                        clvScore(
                            edgeHome,
                            game.homeOdds
                        )

                });

            }

        }



        // AWAY
        if(edgeAway >= MIN_EDGE){

            const stake =
                kelly(
                    bankroll,
                    trueProb.away,
                    game.awayOdds
                );

            if(stake>0){

                bets.push({

                    team: game.away,
                    vs: game.home,

                    side: "AWAY",

                    odds: game.awayOdds,

                    probability:
                        Number(trueProb.away.toFixed(4)),

                    edge:
                        Number(edgeAway.toFixed(4)),

                    stake:
                        Math.min(
                            stake,
                            bankroll*MAX_SINGLE
                        ),

                    score:
                        betScore(
                            edgeAway,
                            trueProb.away,
                            game.awayOdds
                        ),

                    clv:
                        clvScore(
                            edgeAway,
                            game.awayOdds
                        )

                });

            }

        }

    });



    // sort by score
    bets.sort((a,b)=>b.score-a.score);



    // risk control
    let total =
        bets.reduce((s,b)=>s+b.stake,0);

    if(total > bankroll*MAX_TOTAL){

        const scale =
            (bankroll*MAX_TOTAL)/total;

        bets = bets.map(b=>{

            b.stake =
                Number(
                    (b.stake*scale).toFixed(2)
                );

            return b;

        });

    }



    const totalStake =
        bets.reduce((s,b)=>s+b.stake,0);

    const expectedProfit =
        bets.reduce((s,b)=>
            s+(b.stake*b.edge*b.odds)
        ,0);



    return {

        bankroll,

        bets,

        totalStake:
            Number(totalStake.toFixed(2)),

        expectedProfit:
            Number(expectedProfit.toFixed(2)),

        roi:
            totalStake>0
                ? Number(
                    (expectedProfit/totalStake)
                    .toFixed(3)
                )
                : 0

    };

}



module.exports = {
    buildQuantPortfolio
};
