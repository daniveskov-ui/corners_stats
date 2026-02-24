/*
========================================
INSTITUTIONAL MONTE CARLO ENGINE
========================================

Features:
• Dynamic edge
• Kelly sizing with cap
• Risk of ruin
• Max drawdown
• Sharpe ratio
• Percentiles
========================================
*/

function kellyFraction(edge, odds, kellyCap = 0.25) {

    const b = odds - 1;
    const p = (1 / odds) + edge;
    const q = 1 - p;

    const kelly = ((b * p) - q) / b;

    return Math.max(0, Math.min(kelly, kellyCap));
}

function randomEdge(baseEdge = 0.04) {
    const variance = (Math.random() - 0.5) * 0.04;
    return Math.max(-0.02, baseEdge + variance);
}

function runSimulation({

    bankroll = 1000,
    baseEdge = 0.04,
    odds = 2.0,
    simulations = 5000,
    betsPerDay = 10,
    days = 30,
    kellyCap = 0.25

}) {

    const results = [];
    let ruinCount = 0;
    let globalMaxDrawdown = 0;

    for (let s = 0; s < simulations; s++) {

        let balance = bankroll;
        let peak = bankroll;
        let maxDrawdown = 0;

        for (let d = 0; d < days; d++) {

            for (let b = 0; b < betsPerDay; b++) {

                const edge = randomEdge(baseEdge);
                const kelly = kellyFraction(edge, odds, kellyCap);
                const stake = balance * kelly;
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

        globalMaxDrawdown = Math.max(globalMaxDrawdown, maxDrawdown);
        results.push(balance);
    }

    const avg =
        results.reduce((a, b) => a + b, 0) / simulations;

    const sorted =
        [...results].sort((a, b) => a - b);

    const p10 =
        sorted[Math.floor(simulations * 0.10)];

    const p50 =
        sorted[Math.floor(simulations * 0.50)];

    const p90 =
        sorted[Math.floor(simulations * 0.90)];

    // Sharpe ratio
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

        startingBankroll: bankroll.toFixed(2),
        expectedBankroll: avg.toFixed(2),
        medianBankroll: p50.toFixed(2),
        percentile10: p10.toFixed(2),
        percentile90: p90.toFixed(2),

        riskOfRuin:
            ((ruinCount / simulations) * 100).toFixed(2) + "%",

        maxDrawdown:
            (globalMaxDrawdown * 100).toFixed(2) + "%",

        sharpeRatio:
            sharpe.toFixed(2),

        recommendedKelly:
            (kellyFraction(baseEdge, odds, kellyCap) * 100).toFixed(2) + "%",

        simulations,
        days,
        betsPerDay,
        kellyCap
    };
}

module.exports = {
    runSimulation
};
