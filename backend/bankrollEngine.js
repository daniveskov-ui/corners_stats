/*
========================
BANKROLL COMPOUNDING ENGINE
========================
*/

let bankrollHistory = [];

function update(bankroll, profit) {

    const newBankroll =
        bankroll + profit;

    bankrollHistory.push({

        time:
            new Date(),

        bankroll:
            newBankroll,

        profit

    });

    return newBankroll;

}

function getHistory() {

    return bankrollHistory;

}

module.exports = {

    update,
    getHistory

};
