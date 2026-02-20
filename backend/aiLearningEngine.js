/*
========================================
AI SELF LEARNING ENGINE v9
Adaptive Edge Optimization
========================================
*/

let performance = {

    totalBets: 0,

    totalProfit: 0,

    winRate: 0,

    avgEdge: 0,

    confidenceMultiplier: 1.0

};


let history = [];


/*
========================================
UPDATE MODEL AFTER EXECUTION
========================================
*/

function update(result) {

    if (!result || !result.bets)
        return;

    const bets = result.bets;

    performance.totalBets += bets.length;

    let totalEdge = 0;

    bets.forEach(bet => {

        const edge =
            parseFloat(
                bet.edge || 0
            );

        totalEdge += edge;

    });

    performance.avgEdge =
        totalEdge / bets.length || 0;


    performance.totalProfit +=
        Number(result.expectedProfit || 0);


    history.push({

        time: new Date(),

        profit:
            result.expectedProfit,

        bets:
            bets.length,

        avgEdge:
            performance.avgEdge

    });


    adjustConfidence();

}


/*
========================================
AI CONFIDENCE ADJUSTMENT
========================================
*/

function adjustConfidence() {

    const profit =
        performance.totalProfit;

    if (profit > 0) {

        performance.confidenceMultiplier =
            Math.min(
                2.0,
                1.0 + (profit / 1000)
            );

    }
    else {

        performance.confidenceMultiplier =
            Math.max(
                0.5,
                1.0 + (profit / 2000)
            );

    }

}


/*
========================================
GET CONFIDENCE MULTIPLIER
========================================
*/

function getConfidenceMultiplier() {

    return performance.confidenceMultiplier;

}


/*
========================================
GET STATS
========================================
*/

function getStats() {

    return {

        ...performance,

        historySize:
            history.length

    };

}


module.exports = {

    update,

    getStats,

    getConfidenceMultiplier

};
