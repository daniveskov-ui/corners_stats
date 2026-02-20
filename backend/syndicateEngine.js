/*
====================================
SYNDICATE CORE v5
====================================
*/

const sharpEngine =
    require("./sharpEngine");

const capitalEngine =
    require("./capitalEngine");

const riskTierEngine =
    require("./riskTierEngine");

const clvEngine =
    require("./clvEngine");


function execute(bankroll, oddsData) {

    const sharpBets =
        sharpEngine.findSharpValue(
            oddsData
        );

    const finalBets = [];

    sharpBets.forEach(bet => {

        const edge =
            Number(bet.edge.replace("%", ""));

        const stake =
            capitalEngine.allocate(
                bankroll,
                edge
            );

        const tier =
            riskTierEngine.getTier(edge);

        clvEngine.recordBet(bet);

        finalBets.push({

            ...bet,

            stake,

            tier

        });

    });

    const totalStake =
        finalBets.reduce(
            (sum, b) => sum + b.stake,
            0
        );

    const expectedProfit =
        finalBets.reduce(
            (sum, b) =>
                sum + (b.stake * Number(b.edge.replace("%","")) / 100),
            0
        );

    return {

        bankroll,

        bets: finalBets,

        totalStake:
            totalStake.toFixed(2),

        expectedProfit:
            expectedProfit.toFixed(2)

    };

}

module.exports = {
    execute
};
