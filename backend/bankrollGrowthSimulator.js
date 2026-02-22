/*
========================================
REAL BANKROLL GROWTH SIMULATOR
Predicts bankroll over time
========================================
*/

function simulateGrowth({

    bankroll = 1000,
    edge = 0.04,
    odds = 2.0,
    stakePercent = 0.03,
    days = 30,
    betsPerDay = 10

}) {

    const history = [];
    let balance = bankroll;

    for (let d = 1; d <= days; d++) {

        for (let b = 0; b < betsPerDay; b++) {

            const stake = balance * stakePercent;

            const winProbability = (1 / odds) + edge;

            if (Math.random() < winProbability) {
                balance += stake * (odds - 1);
            } else {
                balance -= stake;
            }

        }

        history.push({
            day: d,
            balance: balance
        });
    }

    return {
        startBankroll: bankroll,
        finalBankroll: balance,
        days,
        history
    };
}

module.exports = {
    simulateGrowth
};
