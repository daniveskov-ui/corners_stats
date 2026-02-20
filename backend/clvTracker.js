/*
====================================
CLV ENGINE
Tracks closing line value
====================================
*/

const history = [];

function recordBet(bet) {

    history.push({

        team: bet.team,
        openOdds: Number(bet.odds),
        timestamp: Date.now()

    });

}

function evaluateCLV(currentOddsData) {

    if (!Array.isArray(currentOddsData))
        return [];

    const results = [];

    history.forEach(bet => {

        currentOddsData.forEach(game => {

            game.bookmakers?.forEach(book => {

                const market =
                    book.markets?.find(
                        m => m.key === "h2h"
                    );

                market?.outcomes?.forEach(outcome => {

                    if (outcome.name === bet.team) {

                        const closingOdds =
                            outcome.price;

                        const clv =
                            ((bet.openOdds - closingOdds)
                            / closingOdds) * 100;

                        results.push({

                            team: bet.team,

                            openOdds: bet.openOdds,

                            closingOdds,

                            clv:
                                clv.toFixed(2) + "%"

                        });

                    }

                });

            });

        });

    });

    return results;

}

module.exports = {

    recordBet,
    evaluateCLV

};
