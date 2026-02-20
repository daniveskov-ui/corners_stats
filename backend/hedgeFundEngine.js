/*
========================================
REAL HEDGE FUND ENGINE v4
Institutional Sharp Money Logic
========================================
Uses Pinnacle as sharp reference
Kelly staking
CLV edge detection
Bankroll growth optimization
========================================
*/

const SHARP_BOOK = "Pinnacle";

const MIN_EDGE = 2.0;
const MAX_EDGE = 40.0;

const KELLY_FRACTION = 0.50; // half Kelly (institutional safe)

const MIN_ODDS = 1.30;
const MAX_ODDS = 8.00;


/*
========================================
REMOVE BOOKMAKER MARGIN
========================================
*/

function removeMargin(outcomes) {

    let total = 0;

    outcomes.forEach(o => {
        total += 1 / o.odds;
    });

    return outcomes.map(o => {

        const trueProb =
            (1 / o.odds) / total;

        const trueOdds =
            1 / trueProb;

        return {
            team: o.team,
            trueProb,
            trueOdds
        };

    });

}


/*
========================================
KELLY STAKE CALCULATION
========================================
*/

function kellyStake(bankroll, edgePercent, odds) {

    const edge = edgePercent / 100;

    const b = odds - 1;

    const p = (edge / 100) + (1 / odds);

    const q = 1 - p;

    let fraction =
        ((b * p) - q) / b;

    fraction = fraction * KELLY_FRACTION;

    if (fraction < 0) fraction = 0;

    const stake =
        bankroll * fraction;

    return stake;

}


/*
========================================
FIND SHARP VALUE BETS
========================================
*/

function findBets(oddsData, bankroll) {

    const bets = [];

    if (!Array.isArray(oddsData))
        return bets;

    oddsData.forEach(game => {

        if (!game.bookmakers)
            return;

        const sharpBook =
            game.bookmakers.find(
                b => b.title.includes(SHARP_BOOK)
            );

        if (!sharpBook)
            return;

        const sharpMarket =
            sharpBook.markets.find(
                m => m.key === "h2h"
            );

        if (!sharpMarket)
            return;


        const sharpOutcomes =
            sharpMarket.outcomes.map(o => ({
                team: o.name,
                odds: o.price
            }));

        const fair =
            removeMargin(sharpOutcomes);


        game.bookmakers.forEach(book => {

            if (book.title.includes(SHARP_BOOK))
                return;

            const market =
                book.markets.find(
                    m => m.key === "h2h"
                );

            if (!market)
                return;

            market.outcomes.forEach(outcome => {

                const fairOdds =
                    fair.find(
                        f => f.team === outcome.name
                    );

                if (!fairOdds)
                    return;

                const offeredOdds =
                    outcome.price;

                if (
                    offeredOdds < MIN_ODDS ||
                    offeredOdds > MAX_ODDS
                )
                    return;

                const edge =
                    ((offeredOdds - fairOdds.trueOdds)
                        / fairOdds.trueOdds) * 100;

                if (
                    edge < MIN_EDGE ||
                    edge > MAX_EDGE
                )
                    return;


                const stake =
                    kellyStake(
                        bankroll,
                        edge,
                        offeredOdds
                    );

                if (stake < 1)
                    return;


                const expectedValue =
                    (stake * edge) / 100;


                bets.push({

                    match:
                        game.home_team +
                        " vs " +
                        game.away_team,

                    team:
                        outcome.name,

                    book:
                        book.title,

                    odds:
                        offeredOdds.toFixed(2),

                    trueOdds:
                        fairOdds.trueOdds.toFixed(2),

                    edge:
                        edge.toFixed(2) + "%",

                    stake:
                        stake.toFixed(2),

                    ev:
                        expectedValue.toFixed(2)

                });

            });

        });

    });


    bets.sort(
        (a, b) =>
            parseFloat(b.ev)
            - parseFloat(a.ev)
    );


    return bets;

}


/*
========================================
EXECUTE ENGINE
========================================
*/

function execute(bankroll, oddsData) {

    const bets =
        findBets(oddsData, bankroll);

    let totalStake = 0;
    let totalEV = 0;

    bets.forEach(b => {

        totalStake +=
            Number(b.stake);

        totalEV +=
            Number(b.ev);

    });


    return {

        bankroll,

        totalStake:
            totalStake.toFixed(2),

        expectedProfit:
            totalEV.toFixed(2),

        bets

    };

}


module.exports = {
    execute
};
