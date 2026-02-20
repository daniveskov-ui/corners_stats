require("dotenv").config();

const BANKROLL = Number(process.env.BANKROLL || 1000);
const KELLY_FRACTION = Number(process.env.KELLY_FRACTION || 0.25);

function calculateStake(prob, odds) {

  const edge = (prob * odds) - 1;

  const kelly = edge / (odds - 1);

  const stake = BANKROLL * kelly * KELLY_FRACTION;

  return Math.max(0, stake);
}

module.exports = {
  calculateStake
};
