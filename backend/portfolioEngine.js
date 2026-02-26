/*
========================================
HEDGE FUND CORE v1.0
Portfolio Engine + Adaptive Weights
========================================
*/

function kellyFraction(edge, odds) {
    const b = odds - 1;
    const p = (1 / odds) + edge;
    const q = 1 - p;
    return Math.max(0, ((b * p) - q) / b);
}

function randomEdge(baseEdge) {
    const variance = (Math.random() - 0.5) * 0.03;
    return Math.max(-0.02, baseEdge + variance);
}

function normalizeWeights(strategies) {
    const total = strategies.reduce((sum, s) => sum + s.weight, 0);
    strategies.forEach(s => s.weight = s.weight / total);
}

function runPortfolioSimulation({

    bankroll = 1000,
    days = 60,
    betsPerDay = 5,
    simulations = 2000

}) {

    const baseStrategies = [
        { edge: 0.04, odds: 2.0, weight: 0.4, performance: 0 },
        { edge: 0.06, odds: 1.9, weight: 0.3, performance: 0 },
        { edge: 0.03, odds: 2.2, weight: 0.3, performance: 0 }
    ];

    const results = [];
    let ruinCount = 0;
    let globalMaxDrawdown = 0;

    for (let s = 0; s < simulations; s++) {

        let balance = bankroll;
        let peak = bankroll;

        // Deep copy strategies
        let strategies = JSON.parse(JSON.stringify(baseStrategies));

        for (let d = 0; d < days; d++) {

            normalizeWeights(strategies);

            strategies.forEach(strategy => {

                for (let b = 0; b < betsPerDay; b++) {

                    const edge = randomEdge(strategy.edge);
                    const kelly = kellyFraction(edge, strategy.odds);

                    const stake =
                        balance * strategy.weight * kelly;

                    const winProb =
                        (1 / strategy.odds) + edge;

                    let pnl = 0;

                    if (Math.random() < winProb) {
                        pnl = stake * (strategy.odds - 1);
                        balance += pnl;
                    } else {
                        pnl = -stake;
                        balance += pnl;
                    }

                    strategy.performance += pnl;

                    if (balance <= 0) {
                        ruinCount++;
                        balance = 0;
                        return;
                    }
                }
            });

            // Adaptive reweighting (daily)

            const totalPerf =
                strategies.reduce((sum, s) => sum + s.performance, 0);

            if (totalPerf !== 0) {
                strategies.forEach(s => {
                    const relativePerf =
                        s.performance / totalPerf;

                    s.weight += relativePerf * 0.05; // adjustment speed
                    s.weight = Math.max(0.05, Math.min(0.7, s.weight));
                });
            }

            peak = Math.max(peak, balance);
            const drawdown = (peak - balance) / peak;
            globalMaxDrawdown = Math.max(globalMaxDrawdown, drawdown);

            if (balance <= 0) break;
        }

        results.push(balance);
    }

    const avg =
        results.reduce((a, b) => a + b, 0) / simulations;

    const sorted =
        [...results].sort((a, b) => a - b);

    const median =
        sorted[Math.floor(simulations * 0.5)];

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
        medianBankroll: median.toFixed(2),
        riskOfRuin:
            ((ruinCount / simulations) * 100).toFixed(2) + "%",
        maxDrawdown:
            (globalMaxDrawdown * 100).toFixed(2) + "%",
        sharpeRatio:
            sharpe.toFixed(2),
        simulations,
        days,
        betsPerDay
   
