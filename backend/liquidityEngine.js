// liquidityEngine.js

let exposure = 0;
let maxExposurePercent = 0.25; // max 25% of bankroll exposed

let openPositions = [];


function getMaxExposure(bankroll) {

    return bankroll * maxExposurePercent;

}


function canOpenPosition(bankroll, stake) {

    const maxExposure = getMaxExposure(bankroll);

    return (exposure + stake) <= maxExposure;

}


function registerPosition(position) {

    openPositions.push(position);

    exposure += position.stake;

}


function closePosition(positionId, result) {

    const index =
        openPositions.findIndex(p => p.id === positionId);

    if (index === -1) return;

    const pos = openPositions[index];

    exposure -= pos.stake;

    openPositions.splice(index, 1);

}


function scaleStake(bankroll, requestedStake) {

    const maxExposure = getMaxExposure(bankroll);

    const remaining =
        maxExposure - exposure;

    if (remaining <= 0)
        return 0;

    return Math.min(requestedStake, remaining);

}


function getExposure() {

    return {

        currentExposure: exposure,
        openPositions: openPositions.length

    };

}


module.exports = {

    canOpenPosition,
    registerPosition,
    closePosition,
    scaleStake,
    getExposure

};
