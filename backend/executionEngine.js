/*
========================================
EXECUTION ENGINE v3
INSTITUTIONAL RISK INTEGRATION
========================================
*/

const sharpEngine =
    require("./sharpEngine");

const riskCore =
    require("./riskCore");


function execute(bankroll, oddsData) {

    const sharpBets =
        sharpEngine.findSharpValue(
            oddsData
        );

    const bets = [];

    let totalStake = 0;

    let expectedProfit = 0;


    sharpBets.forEach(bet => {

        const edge =
            parseFloat(
                bet.edge.replace("%", "")
            );

        const odds =
            parseFloat(bet.odds);

        const stake =
            riskCore.calculateStake(
                edge,
                odds
            );


        if (stake <= 0)
            return;


        const profit =
            stake * (odds - 1);

        totalStake += stake;

        expectedProfit += profit;


        bets.push({

            ...bet,

            stake:
                stake.toFixed(2),

            ev:
                profit.toFixed(2)

        });

    });


    riskCore.updateFund(
        expectedProfit
    );


    return {

        bankroll:
            riskCore.getStats().bankroll,

        totalStake:
            totalStake.toFixed(2),

        expectedProfit:
            expectedProfit.toFixed(2),

        bets

    };

}


module.exports = {

    execute

};
