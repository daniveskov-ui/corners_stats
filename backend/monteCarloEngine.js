/*
========================================
MONTE CARLO ENGINE V2
INSTITUTIONAL GRADE
========================================
*/

function kellyFraction(edge, odds) {
    const b = odds - 1;
    const p = (1 / odds) + edge;
    const q = 1 - p;

    const kelly = ((b * p) - q) / b;

    return Math.max(0, Math.min(kelly, 0.25));
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
    days = 30

}) {

    const results = [];
    let ruinCount = 0;
    let best = bankroll;
    let worst = bankroll;

    for (let s = 0; s < simulations; s++) {

        let balance = bankroll;

        for (let d = 0; d < days; d++) {

            for (let b = 0; b < betsPerDay; b++) {

                const edge = randomEdge(baseEdge);
                const kelly = kellyFraction(edge, odds);
                const stake = balance * kelly;
                const winProb = (1 / odds) + edge;

                if (Math.random() < winProb) {
                    balance += stake * (odds - 1);
                } else {
                    balance -= stake;
                }

                if (balance <= 0) {
                    ruinCount++;
                    balance = 0;
                    break;
                }
            }

            if (balance <= 0) break;
        }

        best = Math.max(best, balance);
        worst = Math.min(worst, balance);
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

    return {

        startingBankroll: bankroll.toFixed(2),
        expectedBankroll: avg.toFixed(2),
        medianBankroll: p50.toFixed(2),
        bestCase: best.toFixed(2),
        worstCase: worst.toFixed(2),
        percentile10: p10.toFixed(2),
        percentile90: p90.toFixed(2),

        riskOfRuin:
            ((ruinCount / simulations) * 100).toFixed(2) + "%",

        recommendedKelly:
            (kellyFraction(baseEdge, odds) * 100).toFixed(2) + "%",

        simulations,
        days,
        betsPerDay
    };
}

module.exports = {
    runSimulation
};
