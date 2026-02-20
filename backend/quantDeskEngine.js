/*
========================================
QUANT DESK v7
Institutional Betting Engine
========================================
*/

const sharpEngine =
    require("./sharpEngine");

const bankrollEngine =
    require("./bankrollEngine");

const clvTracker =
    require("./clvTracker");


/*
========================================
CONFIG
========================================
*/

const MAX_PORTFOLIO_RISK = 0.12;

const KELLY_FRACTION = 0.50;

const MIN_EDGE = 2;


/*
========================================
HELPERS
========================================
*/

function calculateKellyStake(
    bankroll,
    odds,
    trueOdds
) {

    const b =
        odds - 1;

    const p =
        1 / trueOdds;

    const q =
        1 - p;

    const kelly =
        (b * p - q) / b;

    if (kelly <= 0)
        return 0;

    return bankroll
        * kelly
        * KELLY_FRACTION;

}


function detectSteamMove(
    offeredOdds,
    trueOdds
) {

    const diff =
        (
            (trueOdds - offeredOdds)
            / trueOdds
        ) * 100;

    return diff > 5;

}


/*
========================================
MAIN EXECUTION
========================================
*/

function execute(
    bankroll,
    oddsData
) {

    if (
        !Array.isArray(oddsData)
    ) {

        return {

            bankroll,

            bets: []

        };

    }

    const sharpBets =
        sharpEngine
            .findSharpValue(
                oddsData
            );

    const portfolio = [];

    let totalStake = 0;

    let expectedProfit = 0;


    sharpBets.forEach(bet => {

        const edge =
            parseFloat(
                bet.edge
            );

        if (edge < MIN_EDGE)
            return;

        const odds =
            parseFloat(
                bet.odds
            );

        const trueOdds =
            parseFloat(
                bet.trueOdds
            );

        const stake =
            calculateKellyStake(
                bankroll,
                odds,
                trueOdds
            );

        if (stake <= 0)
            return;

        if (
            totalStake + stake >
            bankroll
            * MAX_PORTFOLIO_RISK
        )
            return;


        const ev =
            stake
            * (
                (odds / trueOdds)
                - 1
            );

        const steam =
            detectSteamMove(
                odds,
                trueOdds
            );


        portfolio.push({

            team: bet.team,

            book: bet.book,

            odds:
                odds.toFixed(2),

            trueOdds:
                trueOdds.toFixed(2),

            edge:
                bet.edge,

            stake:
                stake.toFixed(2),

            ev:
                ev.toFixed(2),

            steamMove:
                steam
                    ? "YES"
                    : "NO"

        });


        totalStake += stake;

        expectedProfit += ev;


        clvTracker.record({
            odds,
            trueOdds
        });

    });


    bankroll =
        bankrollEngine.update(
            bankroll,
            expectedProfit
        );


    return {

        bankroll:
            bankroll.toFixed(2),

        totalStake:
            totalStake.toFixed(2),

        expectedProfit:
            expectedProfit.toFixed(2),

        bets:
            portfolio

    };

}


module.exports = {
    execute
};
