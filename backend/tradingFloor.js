const betHistory = require("./betHistory");
const clvTracker = require("./clvTracker");

let openPositions = [];

function executeTrades(bankroll, bets) {

    let remaining = bankroll;

    const executed = [];

    for (const bet of bets) {

        if (remaining < bet.stake)
            continue;

        remaining -= bet.stake;

        openPositions.push(bet);

        betHistory.add(bet);

        clvTracker.record(bet);

        executed.push(bet);

    }

    return {
        remainingBankroll: remaining,
        executed
    };

}


function getOpenPositions() {

    return openPositions;

}


module.exports = {
    executeTrades,
    getOpenPositions
};
