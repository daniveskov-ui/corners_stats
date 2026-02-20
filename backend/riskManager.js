const MAX_RISK_PER_BET = 0.02;      // 2%
const MAX_TOTAL_RISK = 0.15;        // 15%
const MAX_EXPOSURE_PER_TEAM = 0.05; // 5%

function calculateStake(bankroll, edge, odds) {

    const kelly =
        ((edge * odds) - (1 - edge)) / odds;

    const safeKelly = Math.max(0, kelly * 0.5);

    const stake =
        bankroll * Math.min(
            safeKelly,
            MAX_RISK_PER_BET
        );

    return Number(stake.toFixed(2));
}


function validatePortfolio(bankroll, bets) {

    let totalRisk = 0;

    const approved = [];

    for (const bet of bets) {

        if (totalRisk >= bankroll * MAX_TOTAL_RISK)
            break;

        totalRisk += bet.stake;

        approved.push(bet);

    }

    return approved;
}


module.exports = {
    calculateStake,
    validatePortfolio
};
