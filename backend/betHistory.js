let history = [];

function add(bet) {
    history.push(bet);
}

function getAll() {
    return history;
}

function stats() {

    let totalStake = 0;
    let totalProfit = 0;

    for (const bet of history) {

        totalStake += bet.stake;
        totalProfit += bet.potentialProfit;

    }

    return {
        totalBets: history.length,
        totalStake,
        totalPotentialProfit: totalProfit
    };
}

module.exports = {
    add,
    getAll,
    stats
};
