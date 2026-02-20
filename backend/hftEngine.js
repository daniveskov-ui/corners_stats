/*
========================================
REAL HEDGE FUND ENGINE v1
COMPOUNDING + PORTFOLIO GROWTH
========================================
*/

const sharpEngine =
    require("./sharpEngine");


/*
========================================
CONFIG
========================================
*/

const MAX_RISK_PER_BET = 0.05;   // 5%
const MAX_TOTAL_RISK = 0.25;     // 25%
const KELLY_FRACTION = 0.50;     // half Kelly


/*
========================================
KELLY CALCULATION
========================================
*/

function kellyStake(
    bankroll,
    odds,
    trueOdds
) {

    const p =
        1 / trueOdds;

    const b =
        odds - 1;

    const q =
        1 - p;

    const kelly =
        ((b * p) - q) / b;

    const fraction =
        Math.max(
            0,
            kelly * KELLY_FRACTION
        );

    const stake =
        bankroll * fraction;

    return Math.min(
        stake,
        bankroll * MAX_RISK_PER_BET
    );

}


/*
========================================
EXECUTE HEDGE FUND STRATEGY
========================================
*/

function execute(
    bankroll,
    oddsData
) {

    bankroll =
        Number(bankroll);

    const sharpBets =
        sharpEngine.findSharpValue(
            oddsData
        );


    let totalStake = 0;

    let expectedProfit = 0;

    const bets = [];


    sharpBets.forEach(bet => {

        if (
            totalStake >=
            bankroll * MAX_TOTAL_RISK
        ) return;


        const odds =
            Number(bet.odds);

        const trueOdds =
            Number(bet.trueOdds);


        const stake =
            kellyStake(
                bankroll,
                odds,
                trueOdds
            );


        if (stake <= 0)
            return;


        const ev =
            stake *
            (
                (odds / trueOdds) - 1
            );


        totalStake += stake;

        expectedProfit += ev;


        bets.push({

            team:
                bet.team,

            book:
                bet.book,

            odds:
                odds.toFixed(2),

            trueOdds:
                trueOdds.toFixed(2),

            edge:
                bet.edge,

            stake:
                stake.toFixed(2),

            ev:
                ev.toFixed(2)

        });

    });


    const newBankroll =
        bankroll + expectedProfit;


    return {

        bankroll:
            bankroll.toFixed(2),

        totalStake:
            totalStake.toFixed(2),

        expectedProfit:
            expectedProfit.toFixed(2),

        projectedBankroll:
            newBankroll.toFixed(2),

        roi:
            (
                expectedProfit
                / bankroll
                * 100
            ).toFixed(2) + "%",

        bets

    };

}


module.exports = {

    execute

};
