/*
==================================
HEDGE FUND PROFIT ENGINE v3
==================================
*/

const sharpEngine =
    require("./sharpEngine");


function execute(bankroll, oddsData) {

    if (!Array.isArray(oddsData)) {

        throw new Error(
            "oddsData is not array"
        );

    }

    const sharpBets =
        sharpEngine.execute(oddsData);

    const bets =
        sharpBets.slice(0, 5).map(bet => {

            const edge =
                parseFloat(bet.edge);

            /*
            Kelly fraction (conservative)
            */
            const kelly =
                Math.min(
                    edge / 100 / 2,
                    0.05
                );

            const stake =
                bankroll * kelly;

            return {

                team: bet.team,

                book: bet.book,

                odds: bet.odds,

                edge: bet.edge,

                confidence: bet.confidence,

                stake:
                    stake.toFixed(2)

            };

        });

    return {

        bankroll,

        bets,

        totalBets: bets.length

    };

}


module.exports = {
    execute
};
