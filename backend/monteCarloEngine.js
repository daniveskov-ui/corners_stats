/*
========================================
MONTE CARLO ENGINE v1
Institutional Grade Simulation
========================================
*/

function simulate({

    bankroll = 1000,

    edge = 0.05,

    odds = 2.0,

    stakePercent = 0.02,

    simulations = 5000,

    betsPerSim = 100

}) {

    const results = [];

    let ruinCount = 0;


    for (let s = 0; s < simulations; s++) {

        let balance = bankroll;

        for (let i = 0; i < betsPerSim; i++) {

            const stake =
                balance * stakePercent;

            const winProb =
                (1 / odds) + edge;

            const rand =
                Math.random();

            if (rand < winProb) {

                balance +=
                    stake * (odds - 1);

            } else {

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

    const ruinRisk =
        (ruinCount / simulations) * 100;


    return {

        startingBankroll: bankroll,

        expectedBankroll:
            avg.toFixed(2),

        bestCase:
            max.toFixed(2),

        worstCase:
            min.toFixed(2),

        riskOfRuin:
            ruinRisk.toFixed(2) + "%",

        simulations

    };

}


module.exports = {
    simulate
};
