/*
========================================
KELLY OPTIMIZED MONTE CARLO ENGINE
Finds optimal stake % automatically
========================================
*/

function kellyFraction(edge, odds) {

    const b = odds - 1;
    const p = (1 / odds) + edge;
    const q = 1 - p;

    const kelly =
        ((b * p) - q) / b;

    return Math.max(0, Math.min(kelly, 0.25));
}


function runSimulation({

    bankroll = 1000,
    edge = 0.04,
    odds = 2.0,
    simulations = 3000,
    betsPerSim = 200

}) {

    const results = [];

    let ruinCount = 0;

    const optimalKelly =
        kellyFraction(edge, odds);


    for (let s = 0; s < simulations; s++) {

        let balance = bankroll;

        for (let i = 0; i < betsPerSim; i++) {

            const stake =
                balance * optimalKelly;

            const winProb =
                (1 / odds) + edge;

            if (Math.random() < winProb) {

                balance +=
                    stake * (odds - 1);

            }
            else {

                balance -= stake;

            }

            if (balance <= 0) {

                ruinCount++;

                balance = 0;

                break;

            }

        }

        results.push(balance);

    }


    const avg =
        results.reduce((a, b) => a + b, 0)
        / simulations;

    const max =
        Math.max(...results);

    const min =
        Math.min(...results);

    return {

        optimalKelly:
            (optimalKelly * 100).toFixed(2) + "%",

        expectedBankroll:
            avg.toFixed(2),

        bestCase:
            max.toFixed(2),

        worstCase:
            min.toFixed(2),

        riskOfRuin:
            ((ruinCount / simulations) * 100).toFixed(2) + "%"

    };

}


module.exports = {
    runSimulation
};
