const db = require("../db");

function getBankroll() {

    return new Promise((resolve, reject) => {

        db.get(
            "SELECT bankroll FROM fund WHERE id = 1",
            (err, row) => {

                if (err) return reject(err);

                if (!row) {

                    db.run(
                        "INSERT INTO fund (id, bankroll) VALUES (1, 1000)"
                    );

                    return resolve(1000);
                }

                resolve(row.bankroll);

            }
        );

    });

}


function updateBankroll(amount) {

    return new Promise((resolve, reject) => {

        db.run(
            "UPDATE fund SET bankroll = ? WHERE id = 1",
            [amount],
            function (err) {

                if (err) return reject(err);

                resolve(true);

            }
        );

    });

}

module.exports = {
    getBankroll,
    updateBankroll
};
