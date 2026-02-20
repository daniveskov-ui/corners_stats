/*
====================================
RISK TIER ENGINE
====================================
*/

function getTier(edge) {

    edge = Number(edge);

    if (edge >= 15)
        return "ULTRA";

    if (edge >= 10)
        return "HIGH";

    if (edge >= 5)
        return "MEDIUM";

    return "LOW";

}

module.exports = {
    getTier
};
