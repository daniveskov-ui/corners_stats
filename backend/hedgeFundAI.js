/*
========================================
HEDGE FUND AI v6
Quant Betting Model
========================================
*/

const sharpEngine =
    require("./sharpEngine");

const MAX_PORTFOLIO_RISK = 0.15; // max 15% total exposure
const BASE_KELLY = 0.50;

const MIN_AI_SCORE = 55;


/*
========================================
AI PROBABILITY ADJUSTMENT
========================================
*/

function aiAdjustProbability(edge, trueProb) {

    // simulate model confidence layer
    const confidenceBoost =
        (edge * 0.03);

    let adjusted =
        trueProb + (confidenceBoost / 100);

    if (adjusted > 0.95)
        adjusted = 0.95;

    return adjusted;

}


/*
========================================
VOLATILITY FILTER
========================================
*/

function volatilityCheck(odds) {

    if (odds > 6.5)
        return false;

    if (odds < 1.25)
        return false;

    return true;

}


/*
========================================
DYNAMIC KELLY
========================================
*/

function dynamicKelly(bankroll, odds, probability) {

    const b = odds - 1;

    const p = probability;

    const q = 1 - p;

    let fraction =
        ((b * p) - q) / b;

    if (fraction < 0)
        return 0;

    // dynamic scaling
    if (probability > 0.65)
        fraction *= 0.75;
    else
        fraction *= BASE_KELLY;

    return bankroll * fraction;

}


/*
========================================
AI SCORE
========================================
*/

function calculateAIScore(edge, probability) {

    const score =
        (edge * 0.6)
        + (probability * 100 * 0.4);

    return score;

}


/*
========================================
MAIN EXECUTION
========================================
*/

function execute(bankroll, oddsData) {

    const sharpBets =
        sharpEngine.findSharpValue(
            oddsData
        );

    let totalExposure = 0;

    const portfolio = [];

    sharpBets.forEach(bet => {

        const edge =
            Number(
                bet.edge.replace("%","")
            );

        const trueProb =
            1 / Number(bet.trueOdds);

        if (!volatilityCheck(
            Number(bet.odds)
        )) return;

        const adjustedProb =
            aiAdjustProbability(
                edge,
                trueProb
            );

        const stake =
            dynamicKelly(
                bankroll,
                Number(bet.odds),
                adjustedProb
            );

        if (stake <= 1)
            return;

        const aiScore =
            calculateAIScore(
                edge,
                adjustedProb
            );

        if (aiScore < MIN_AI_SCORE)
            return;

        totalExposure += stake;

        if (
            totalExposure >
            bankroll * MAX_PORTFOLIO_RISK
        )
            return;

        const ev =
            stake *
            (
                (adjustedProb *
                Number(bet.odds))
                - 1
            );

        portfolio.push({

            ...bet,

            stake:
                stake.toFixed(2),

            aiScore:
                aiScore.toFixed(2),

            adjustedProb:
                (adjustedProb*100)
                .toFixed(2)+"%",

            ev:
                ev.toFixed(2)

        });

    });

    portfolio.sort(
        (a,b)=>
            b.aiScore - a.aiScore
    );

    const expectedProfit =
        portfolio.reduce(
            (sum,b)=>
                sum + Number(b.ev),
            0
        );

    return {

        bankroll,

        exposure:
            totalExposure.toFixed(2),

        expectedProfit:
            expectedProfit.toFixed(2),

        bets: portfolio

    };

}


module.exports = {
    execute
};
