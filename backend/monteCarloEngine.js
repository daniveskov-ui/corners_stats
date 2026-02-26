/*
========================================
STRATEGY ENGINE V3
Institutional Quant Version
========================================

Modes:
- kelly
- fractional
- flat
- adaptive
========================================
*/

function kellyFraction(edge, odds) {
    const b = odds - 1;
    const p = (1 / odds) + edge;
    const q = 1 - p;
    return ((b * p) - q) / b;
}

function randomEdge(baseEdge = 0.04) {
    const variance = (Math.random() - 0.5) * 0.04;
    return Math.max(-0.02, baseEdge + variance);
}

function runSimulation({

    bankroll = 1000,
    baseEdge = 0.04,
    odds = 2.0,
    simulations = 3000,
    betsPerDay = 10,
    days = 30,
    strategy = "kelly",
    kellyFractionMultiplier = 0.5,   // fractional mode
    flatStakePercent = 0.02          // flat mode

}) {

    const results = [];
    let ruinCount = 0;
    let globalMaxDrawdown = 0;

    for (let s = 0; s < simulations; s++) {

        let balance = bankroll;
        let peak = bankroll;
        let maxDrawdown = 0;
        let dynamicMultiplier = kellyFractionMultiplier;

        for (let d = 0; d < days; d++) {

            for (let b = 0; b < betsPerDay; b++) {

                const edge = randomEdge(baseEdge);
                const rawKelly = kellyFraction(edge, odds);

                let stakePercent = 0;

                // STRATEGY SWITCH
                if (strategy === "kelly") {
                    stakePercent = Math.max(0, Math.min(rawKelly, 0.25));
                }

                if (strategy === "fractional") {
                    stakePercent = Math.max(0, rawKelly * kellyFractionMultiplier);
                }

                if (strategy === "flat") {
                    stakePercent = flatStakePercent;
                }

                if (strategy === "adaptive") {

                    // reduce risk if drawdown grows
                    if (maxDrawdown > 0.30) {
                        dynamicMultiplier = 0.25;
                    }

                    stakePercent =
                        Math.max(0, rawKelly * dynamicMultiplier);
                }

                const stake = balance * stakePercent;
                const winProb = (1 / odds) + edge;

                if (Math.random() < winProb) {
                    balance += stake * (odds - 1);
                } else {
                    balance -= stake;
                }

                peak = Math.max(peak, balance);
                const drawdown = (peak - balance) / peak;
                maxDrawdown = Math.max(maxDrawdown, drawdown);

                if (balance <= 0) {
                    ruinCount++;
                    balance = 0;
                    break;
                }
            }

            if (balance <= 0) break;
        }

        globalMaxDrawdown =
            Math.max(globalMaxDrawdown, maxDrawdown);

        results.push(balance);
    }

    const avg =
        results.reduce((a, b) => a + b, 0) / simulations;

    const sorted =
        [...results].sort((a, b) => a - b);

    const p50 =
        sorted[Math.floor(simulations * 0.50)];

    const returns =
        results.map(r => (r - bankroll) / bankroll);

    const meanReturn =
        returns.reduce((a, b) => a + b, 0) / returns.length;

    const stdDev =
        Math.sqrt(
            returns
                .map(r => Math.pow(r - meanReturn, 2))
                .reduce((a, b) => a + b, 0) / returns.length
        );

    const sharpe =
        stdDev === 0 ? 0 : meanReturn / stdDev;

    return {
        strategy,
        startingBankroll: bankroll.toFixed(2),
        expectedBankroll: avg.toFixed(2),
        medianBankroll: p50.toFixed(2),
        riskOfRuin:
            ((ruinCount / simulations) * 100).toFixed(2) + "%",
        maxDrawdown:
            (globalMaxDrawdown * 100).toFixed(2) + "%",
        sharpeRatio:
            sharpe.toFixed(2),
        simulations,
        days,
        betsPerDay
    };
}

module.exports = {
    runSimulation
};
