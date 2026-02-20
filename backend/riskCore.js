/*
========================================
INSTITUTIONAL RISK CORE v3
========================================
*/

let fundState = {

    bankroll:
        Number(process.env.BANKROLL) || 1000,

    peak:
        Number(process.env.BANKROLL) || 1000,

    drawdown: 0,

    maxDrawdown: 0,

    sessions: 0,

    totalProfit: 0

};


const MAX_RISK_PERCENT = 0.05; // 5%
const KELLY_FRACTION = 0.50;   // half Kelly safety


/*
========================================
CALCULATE SAFE STAKE
========================================
*/

function calculateStake(edgePercent, odds) {

    const edge = edgePercent / 100;

    const kelly =
        ((edge * odds) - (1 - edge))
        / odds;

    const safeKelly =
        kelly * KELLY_FRACTION;

    const stake =
        fundState.bankroll
        * safeKelly;

    const maxStake =
        fundState.bankroll
        * MAX_RISK_PERCENT;

    return Math.max(
        0,
        Math.min(stake, maxStake)
    );

}


/*
========================================
UPDATE FUND STATE
========================================
*/

function updateFund(profit) {

    fundState.sessions++;

    fundState.totalProfit += profit;

    fundState.bankroll += profit;


    if (fundState.bankroll > fundState.peak) {

        fundState.peak =
            fundState.bankroll;

    }


    fundState.drawdown =
        (
            (fundState.peak - fundState.bankroll)
            / fundState.peak
        ) * 100;


    if (fundState.drawdown >
        fundState.maxDrawdown) {

        fundState.maxDrawdown =
            fundState.drawdown;

    }

}


/*
========================================
GET STATS
========================================
*/

function getStats() {

    return {

        bankroll:
            fundState.bankroll.toFixed(2),

        peak:
            fundState.peak.toFixed(2),

        totalProfit:
            fundState.totalProfit.toFixed(2),

        drawdown:
            fundState.drawdown.toFixed(2) + "%",

        maxDrawdown:
            fundState.maxDrawdown.toFixed(2) + "%",

        sessions:
            fundState.sessions

    };

}


module.exports = {

    calculateStake,

    updateFund,

    getStats

};
