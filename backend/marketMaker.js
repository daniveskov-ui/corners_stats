const betHistory = require("./betHistory");

let openPositions = [];


function calculateFairOdds(odds) {

    const margin = 0.05;

    return odds * (1 - margin);

}


function detectEdge(game) {

    const fairHome =
        calculateFairOdds(game.homeOdds);

    const fairAway =
        calculateFairOdds(game.awayOdds);

    const homeEdge =
        game.homeOdds - fairHome;

    const awayEdge =
        game.awayOdds - fairAway;

    if (homeEdge > awayEdge) {

        return {
            side: "HOME",
            edge: homeEdge
        };

    }

    return {
        side: "AWAY",
        edge: awayEdge
    };

}


function sizePosition(bankroll, edge) {

    const kelly =
        edge / 10;

    return bankroll * kelly;

}


function executeMarketMaking(
    bankroll,
    oddsCache
) {

    let positions = [];

    for (const game of oddsCache) {

        const edge =
            detectEdge(game);

        if (edge.edge < 0.02)
            continue;

        const stake =
            sizePosition(
                bankroll,
                edge.edge
            );

        if (stake <= 0)
            continue;

        const position = {

            game:
                game.home +
                " vs " +
                game.away,

            side:
                edge.side,

            stake,

            edge:
                edge.edge,

            timestamp:
                Date.now()

        };

        positions.push(position);

        betHistory.add(position);

    }

    openPositions.push(...positions);

    return positions;

}


function getExposure() {

    return openPositions
        .reduce(
            (sum, p) =>
                sum + p.stake,
            0
        );

}


module.exports = {

    executeMarketMaking,

    getExposure

};
