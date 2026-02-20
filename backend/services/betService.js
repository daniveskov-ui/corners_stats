const db = require("../db");

function placeBet({ match, stake, odds }) {

    return new Promise((resolve, reject) => {

        db.run(
            `INSERT INTO bets (match, stake, odds, result, profit)
             VALUES (?, ?, ?, ?, ?)`,
            [match, stake, odds, "pending", 0],
            function (err) {

                if (err) return reject(err);

                resolve(this.lastID);

            }
        );

    });

}


function settleBet(id, result) {

    return new Promise((resolve, reject) => {

        db.get(
            "SELECT * FROM bets WHERE id = ?",
            [id],
            (err, bet) => {

                if (err) return reject(err);

                if (!bet) return reject("Bet not found");

                let profit = 0;

                if (result === "win") {

                    profit =
                        bet.stake * (bet.odds - 1);

                } else {

                    profit = -bet.stake;

                }

                db.run(
                    `UPDATE bets
                     SET result = ?, profit = ?
                     WHERE id = ?`,
                    [result, profit, id],
                    function (err) {

                        if (err) return reject(err);

                        resolve(profit);

                    }
                );

            }
        );

    });

}

module.exports = {
    placeBet,
    settleBet
};
