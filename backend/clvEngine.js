/*
========================
CLV TRACKER
========================
*/

let history = [];

function record(bet) {

    history.push({

        team: bet.team,

        odds: bet.odds,

        trueOdds:
            bet.trueOdds,

        time:
            new Date()

    });

}

function getStats() {

    return history;

}

module.exports = {

    record,
    getStats

};
