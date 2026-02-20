const model = require("./model");


// Kelly formula
function kellyStake(bankroll, odds, probability) {

  const edge =
    (probability * odds) - 1;

  const kelly =
    edge / (odds - 1);

  const fraction =
    Number(process.env.KELLY_FRACTION) || 0.25;

  const stake =
    bankroll * kelly * fraction;

  return stake > 0 ? stake : 0;

}



// BUILD PORTFOLIO
function buildPortfolio(bankroll, oddsList) {

  const bets = [];

  oddsList.forEach(game => {

    const homeProb =
      model.calculateProbability(game.homeOdds);

    const awayProb =
      model.calculateProbability(game.awayOdds);


    const homeStake =
      kellyStake(
        bankroll,
        game.homeOdds,
        homeProb
      );

    const awayStake =
      kellyStake(
        bankroll,
        game.awayOdds,
        awayProb
      );


    if (homeStake > 0) {

      bets.push({

        side: "HOME",

        home: game.home,
        away: game.away,

        odds: game.homeOdds,

        stake:
          Number(homeStake.toFixed(2)),

        expectedProfit:
          Number(
            (homeStake *
            (game.homeOdds - 1) *
            homeProb).toFixed(2)
          )

      });

    }


    if (awayStake > 0) {

      bets.push({

        side: "AWAY",

        home: game.home,
        away: game.away,

        odds: game.awayOdds,

        stake:
          Number(awayStake.toFixed(2)),

        expectedProfit:
          Number(
            (awayStake *
            (game.awayOdds - 1) *
            awayProb).toFixed(2)
          )

      });

    }


  });

  return bets;

}



// EXPORT
module.exports = {

  buildPortfolio

};
