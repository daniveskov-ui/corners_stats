/*
====================================
CAPITAL ENGINE
Institutional bankroll allocation
====================================
*/

const MAX_RISK = 0.03;

function allocate(bankroll, edgePercent) {

    const edge = edgePercent / 100;

    const stake =
        bankroll *
        edge *
        MAX_RISK;

    return Number(stake.toFixed(2));

}

module.exports = {
    allocate
};
