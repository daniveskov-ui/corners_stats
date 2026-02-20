/*
========================
HEDGE FUND ENGINE
========================
*/

const MAX_EXPOSURE = 0.05;
const MIN_EDGE = 0.02;

function extractMarketData(rawOdds) {

    const market = [];

    if (!rawOdds) return market;

    for (const game of rawOdds) {

        if (!game.bookmakers) continue;

        for (const book of game.bookmakers) {

            if (!book.markets) continue;

            for (const marketItem of book.markets) {

                if (!marketItem.outcomes) continue;

                for (const outcome of marketItem.outcomes) {

                    if (!outcome.price) continue;

                    market.push({

                        gameId: game.id,
                        team: outcome.name,
                        odds: outcome.price,
                        book: book.title,
                        time: game.commence_time

                    });

                }

            }

        }

    }

    return market;

}


function calculateEdge(odds) {

    const trueOdds = odds * 1.05;

    return (trueOdds / odds) - 1;

}


function kellyStake(bankroll, edge, odds) {

    const kelly = edge / (odds - 1);

    const fraction = kelly * 0.30;

    const stake = bankroll * fraction;

    if (!isFinite(stake) || stake <= 0)
        return 0;

    return stake;

}


function limitStake(bankroll, stake) {

    const max = bankroll * MAX_EXPOSURE;

    return Math.min(stake, max);

}


function execute(bankroll, rawOdds) {

    const bets = [];

    let totalStake = 0;
    let expectedProfit = 0;

    const market = extractMarketData(rawOdds);

    for (const item of market) {

        const edge = calculateEdge(item.odds);

        if (edge < MIN_EDGE) continue;

        let stake =
            kellyStake(bankroll, edge, item.odds);

        stake =
            limitStake(bankroll, stake);

        if (stake <= 0) continue;

        const ev = stake * edge;

        bets.push({

            team: item.team,
            book: item.book,

            odds: item.odds.toFixed(2),

            stake: stake.toFixed(2),

            edge:
                (edge * 100).toFixed(2) + "%",

            ev:
                ev.toFixed(2)

        });

        totalStake += stake;
        expectedProfit += ev;

    }

    return {

        bankroll,

        totalStake:
            totalStake.toFixed(2),

        expectedProfit:
            expectedProfit.toFixed(2),

        bets

    };

}


module.exports = {
    execute
};
