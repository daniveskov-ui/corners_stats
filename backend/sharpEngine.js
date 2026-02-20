/*
==================================
ULTRA SHARP ENGINE v3
INSTITUTIONAL GRADE
==================================
*/

const MIN_EDGE_PERCENT = 3;
const MIN_ODDS = 1.40;
const MAX_ODDS = 6.00;
const SHARP_BOOK_KEYWORD = "Pinnacle";


/*
==================================
REMOVE BOOKMAKER MARGIN
==================================
*/
function removeMargin(outcomes) {

    let totalProb = 0;

    outcomes.forEach(o => {
        totalProb += 1 / o.odds;
    });

    return outcomes.map(o => {

        const fairProb =
            (1 / o.odds) / totalProb;

        return {
            ...o,
            trueProb: fairProb,
            trueOdds: 1 / fairProb
        };

    });

}


/*
==================================
CONFIDENCE SCORE
==================================
*/
function confidenceScore(edge, trueProb) {

    const probWeight = trueProb * 100;

    const score =
        (edge * 0.7) +
        (probWeight * 0.3);

    return score.toFixed(2);

}


/*
==================================
FIND SHARP VALUE
==================================
*/
function findSharpValue(oddsData) {

    const sharpBets = [];

    if (!oddsData) return sharpBets;

    oddsData.forEach(game => {

        if (!game.bookmakers) return;

        const sharpBook =
            game.bookmakers.find(b =>
                b.title.includes(SHARP_BOOK_KEYWORD)
            );

        if (!sharpBook) return;

        const sharpMarket =
            sharpBook.markets.find(m =>
                m.key === "h2h"
            );

        if (!sharpMarket) return;

        const sharpOutcomes =
            sharpMarket.outcomes.map(o => ({
                team: o.name,
                odds: o.price
            }));

        const fairPrices =
            removeMargin(sharpOutcomes);


        game.bookmakers.forEach(book => {

            if (book.title.includes(SHARP_BOOK_KEYWORD))
                return;

            const market =
                book.markets.find(m =>
                    m.key === "h2h"
                );

            if (!market) return;

            market.outcomes.forEach(outcome => {

                const fair =
                    fairPrices.find(f =>
                        f.team === outcome.name
                    );

                if (!fair) return;

                const offeredOdds =
                    outcome.price;

                if (
                    offeredOdds < MIN_ODDS ||
                    offeredOdds > MAX_ODDS
                ) return;

                const edge =
                    ((offeredOdds - fair.trueOdds)
                        / fair.trueOdds) * 100;

                if (edge >= MIN_EDGE_PERCENT) {

                    const score =
                        confidenceScore(
                            edge,
                            fair.trueProb
                        );

                    sharpBets.push({

                        team: outcome.name,

                        book: book.title,

                        sharpReference: SHARP_BOOK_KEYWORD,

                        odds: offeredOdds.toFixed(2),

                        trueOdds: fair.trueOdds.toFixed(2),

                        edge: edge.toFixed(2) + "%",

                        confidence: score

                    });

                }

            });

        });

    });

    sharpBets.sort(
        (a, b) =>
            parseFloat(b.confidence)
            - parseFloat(a.confidence)
    );

    return sharpBets;

}


/*
==================================
EXECUTE FUNCTION (REQUIRED)
==================================
*/
function execute(oddsData) {

    return findSharpValue(oddsData);

}


/*
==================================
EXPORTS
==================================
*/
module.exports = {

    execute,
    findSharpValue

};
