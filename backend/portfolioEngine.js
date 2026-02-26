function runPortfolioSimulation({
    bankroll = 1000,
    days = 60,
    betsPerDay = 5,
    simulations = 1000
}) {

    function kelly(edge, odds) {
        const b = odds - 1;
        const p = (1 / odds) + edge;
        const q = 1 - p;
        return Math.max(0, ((b * p) - q) / b);
    }

    function randEdge(base) {
        return base + (Math.random() - 0.5) * 0.02;
    }

    const baseStrategies = [
        { edge: 0.04, odds: 2.0, weight: 0.4 },
        { edge: 0.06, odds: 1.9, weight: 0.3 },
        { edge: 0.03, odds: 2.2, weight: 0.3 }
    ];

    const results = [];
    let ruinCount = 0;
    let maxDD = 0;

    for (let s = 0; s < simulations; s++) {

        let balance = bankroll;
        let peak = bankroll;

        let strategies = JSON.parse(JSON.stringify(baseStrategies));

        for (let d = 0; d < days; d++) {

            strategies.forEach(strategy => {

                for (let b = 0; b < betsPerDay; b++) {

                    const edge = randEdge(strategy.edge);
                    const stakePct = kelly(edge, strategy.odds) * strategy.weight;
                    const stake = balance * stakePct;
                    const winProb = (1 / strategy.odds) + edge;

                    if (Math.random() < winProb) {
                        balance += stake * (strategy.odds - 1);
                    } else {
                        balance -= stake;
                    }

                    if (balance <= 0) {
                        ruinCount++;
                        balance = 0;
                        break;
                    }
                }
            });

            peak = Math.max(peak, balance);
            const dd = (peak - balance) / peak;
            maxDD = Math.max(maxDD, dd);

            if (balance <= 0) break;
        }

        results.push(balance);
    }

    const avg = results.reduce((a,b)=>a+b,0)/simulations;

    return {
        startingBankroll: bankroll,
        expectedBankroll: avg.toFixed(2),
        riskOfRuin: ((ruinCount/simulations)*100).toFixed(2)+"%",
        maxDrawdown: (maxDD*100).toFixed(2)+"%"
    };
}

module.exports = { runPortfolioSimulation };
