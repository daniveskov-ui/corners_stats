function runPortfolioSimulation({
    bankroll = 1000,
    days = 60,
    betsPerDay = 5,
    simulations = 1000,
    targetVol = 0.15
}) {

    const results = [];
    let ruinCount = 0;
    let globalMaxDD = 0;

    for (let s = 0; s < simulations; s++) {

        let balance = bankroll;
        let peak = bankroll;
        let dailyReturns = [];

        for (let d = 0; d < days; d++) {

            let startDayBalance = balance;

            for (let b = 0; b < betsPerDay; b++) {

                const edge = 0.04;
                const odds = 2.0;

                const winProb = (1 / odds) + edge;
                let exposure = 0.02; // base 2%

                // ---- DRAWdown control ----
                const currentDD = (peak - balance) / peak;

                if (currentDD > 0.5) exposure *= 0.25;
                else if (currentDD > 0.3) exposure *= 0.5;

                // ---- VOL targeting ----
                if (dailyReturns.length > 10) {

                    const recent = dailyReturns.slice(-10);
                    const mean = recent.reduce((a,b)=>a+b,0)/recent.length;
                    const variance =
                        recent.map(r => Math.pow(r-mean,2))
                              .reduce((a,b)=>a+b,0)/recent.length;

                    const vol = Math.sqrt(variance);

                    if (vol > targetVol) {
                        exposure *= targetVol / vol;
                    }
                }

                const stake = balance * exposure;

                if (Math.random() < winProb) {
                    balance += stake;
                } else {
                    balance -= stake;
                }

                if (balance <= 0) {
                    ruinCount++;
                    balance = 0;
                    break;
                }
            }

            const dailyReturn =
                (balance - startDayBalance) / startDayBalance;

            dailyReturns.push(dailyReturn);

            peak = Math.max(peak, balance);
            const dd = (peak - balance) / peak;
            globalMaxDD = Math.max(globalMaxDD, dd);

            if (balance <= 0) break;
        }

        results.push(balance);
    }

    const avg = results.reduce((a,b)=>a+b,0)/simulations;

    const sorted = [...results].sort((a,b)=>a-b);
    const median = sorted[Math.floor(simulations*0.5)];

    const returns = results.map(r => (r-bankroll)/bankroll);
    const meanR = returns.reduce((a,b)=>a+b,0)/returns.length;

    const variance =
        returns.map(r=>Math.pow(r-meanR,2))
               .reduce((a,b)=>a+b,0)/returns.length;

    const sharpe =
        variance === 0 ? 0 : meanR / Math.sqrt(variance);

    return {
        startingBankroll: bankroll,
        expectedBankroll: avg.toFixed(2),
        medianBankroll: median.toFixed(2),
        riskOfRuin: ((ruinCount/simulations)*100).toFixed(2)+"%",
        maxDrawdown: (globalMaxDD*100).toFixed(2)+"%",
        sharpeRatio: sharpe.toFixed(2)
    };
}

module.exports = { runPortfolioSimulation };
