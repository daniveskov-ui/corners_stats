const riskManager = require("./riskManager");

function estimateEdge(odds) {

    const implied = 1 / odds;

    const modelProb =
        implied * (1 + Math.random() * 0.08);

    return modelProb - implied;
}


function buildQuantPortfolio(bankroll, games) {

    const bets = [];

    for (const game of games) {

        const edgeHome =
            estimateEdge(game.homeOdds);

        if (edgeHome > 0.03) {

            const stake =
                riskManager.calculateStake(
                    bankroll,
                    edgeHome,
                    game.homeOdds
                );

            bets.push({

                game:
                    game.home + " vs " + game.away,

                side: game.home,

                odds: game.homeOdds,

                edge: edgeHome,

                stake

            });

        }

    }

    return riskManager.validatePortfolio(
        bankroll,
        bets
    );

}


module.exports = {
    buildQuantPortfolio
};
