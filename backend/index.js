require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;


/*
==============================
HEALTH CHECK
==============================
*/

app.get("/", (req, res) => {

    res.json({
        status: "HEDGE FUND AI RUNNING",
        timestamp: new Date(),
        uptime: process.uptime()
    });

});


/*
==============================
STATUS
==============================
*/

app.get("/api/status", (req, res) => {

    res.json({

        system: "ONLINE",

        bankroll:
            process.env.BANKROLL || 1000,

        environment:
            process.env.NODE_ENV || "production",

        timestamp:
            new Date()

    });

});


/*
==============================
TEST AUTO PROFIT
==============================
*/

app.get("/api/auto-profit", (req, res) => {

    const bankroll =
        Number(process.env.BANKROLL) || 1000;

    res.json({

        bankroll,

        expectedProfit:
            (bankroll * 0.12).toFixed(2),

        roi: "12%",

        bets: [

            {
                team: "Demo Bet",
                edge: "8.5%",
                odds: 2.10,
                stake: (bankroll * 0.02).toFixed(2)
            }

        ]

    });

});


/*
==============================
START SERVER
==============================
*/

app.listen(PORT, () => {

    console.log("=================================");
    console.log("HEDGE FUND AI DEPLOYED");
    console.log("PORT:", PORT);
    console.log("=================================");

});
