// =============================
// HEDGE FUND INSTITUTIONAL MODE
// =============================

const MAX_SINGLE_EXPOSURE = 0.05;      // 5% max per bet
const MAX_TOTAL_EXPOSURE = 0.20;       // 20% total portfolio risk
const MIN_EDGE = 0.03;                 // 3% minimum edge
const KELLY_FRACTION = 0.25;           // 25% Kelly scaling



// Remove bookmaker margin (true probability)
function trueProbability(homeOdds, awayOdds) {

  const p1 = 1 / homeOdds;
  const p2 = 1 / awayOdds;

  const sum = p1 + p2;

  return {
    home: p1 / sum,
    away: p2 / sum
  };

}



// Kelly calculation
function kellyStake(bankroll, prob, odds) {

  const b = odds - 1;

  const kelly =
    ((prob * b) - (1 - prob)) / b;

  if (kelly <= 0) return 0;

  const scaled = kelly * KELLY_FRACTION;

  return bankroll * scaled;

}



// Build hedge fund portfolio
function buildPortfolio(bankroll, oddsList) {

  let bets = [];

  oddsList.forEach(game => {

    if (!game.homeOdds || !game.awayOdds)
      return;

    const trueProb =
      trueProbability(
        game.homeOdds,
        game.awayOdds
      );

    const impliedHome =
      1 / game.homeOdds;

    const impliedAway =
      1 / game.awayOdds;


    const homeEdge =
      trueProb.home - impliedHome;

    const awayEdge =
      trueProb.away - impliedAway;


    // FILTER BY EDGE
    if (homeEdge >= MIN_EDGE) {

      const stake =
        kellyStake(
          bankroll,
          trueProb.home,
          game.homeOdds
        );

      if (stake > 0) {

        bets.push({

          side: "HOME",

          home: game.home,
          away: game.away,

          odds: game.homeOdds,

          probability:
            Number(trueProb.home.toFixed(4)),

          edge:
            Number(homeEdge.toFixed(4)),

          stake:
            Math.min(
              stake,
              bankroll * MAX_SINGLE_EXPOSURE
            )

        });

      }

    }


    if (awayEdge >= MIN_EDGE) {

      const stake =
        kellyStake(
          bankroll,
          trueProb.away,
          game.awayOdds
        );

      if (stake > 0) {

        bets.push({

          side: "AWAY",

          home: game.home,
          away: game.away,

          odds: game.awayOdds,

          probability:
            Number(trueProb.away.toFixed(4)),

          edge:
            Number(awayEdge.toFixed(4)),

          stake:
            Math.min(
              stake,
              bankroll * MAX_SINGLE_EXPOSURE
            )

        });

      }

    }

  });


  // SORT BY EDGE DESC
  bets.sort((a,b)=>b.edge - a.edge);


  // LIMIT TOTAL PORTFOLIO RISK
  let totalStake =
    bets.reduce((s,b)=>s+b.stake,0);

  if (totalStake > bankroll * MAX_TOTAL_EXPOSURE) {

    const scale =
      (bankroll * MAX_TOTAL_EXPOSURE) /
      totalStake;

    bets = bets.map(b => {

      b.stake =
        Number(
          (b.stake * scale).toFixed(2)
        );

      return b;

    });

  }


  return bets;

}



module.exports = {
  buildPortfolio
};
