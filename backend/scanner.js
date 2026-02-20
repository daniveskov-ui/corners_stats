require("dotenv").config();

const axios = require("axios");

const { calculateProbability } = require("./model");
const { calculateStake } = require("./bankroll");

const API_KEY = process.env.ODDS_API_KEY;
const MIN_EV = Number(process.env.MIN_EV || 0.05);


async function scanOdds() {

  const response = await axios.get(
    "https://api.the-odds-api.com/v4/sports/soccer/odds",
    {
      params: {
        apiKey: API_KEY,
        regions: "eu",
        markets: "h2h",
        oddsFormat: "decimal"
      }
    }
  );

  const valueBets = [];

  response.data.forEach(match => {

    const bookmaker = match.bookmakers?.[0];
    const market = bookmaker?.markets?.[0];

    if (!market) return;

    market.outcomes.forEach(outcome => {

      const odds = outcome.price;

      if (!odds || odds <= 1) return;

      const probability = calculateProbability(odds);

      const ev = (probability * odds) - 1;

      if (ev > MIN_EV) {

        const stake = calculateStake(probability, odds);

        valueBets.push({

          match: match.home_team + " vs " + match.away_team,
          bet: outcome.name,
          odds,
          probability: Number(probability.toFixed(3)),
          EV: Number(ev.toFixed(3)),
          stake: Number(stake.toFixed(2)),
          bookmaker: bookmaker.title

        });

      }

    });

  });

  return valueBets.sort((a, b) => b.EV - a.EV);

}


module.exports = {
  scanOdds
};
