const pool = require("./db");
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const path = require("path");

const monteCarloEngine = require("./monteCarloEngine");
const kellyMonteCarloEngine = require("./kellyMonteCarloEngine");
const bankrollSimulator = require("./bankrollGrowthSimulator");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

//
// HEALTH CHECK
//
app.get("/", (req, res) => {
    res.json({
        status: "AI FUND MANAGER LIVE",
        version: "PRODUCTION v3",
        port: PORT
    });
});

//
// MONTE CARLO
//
app.get("/api/montecarlo", (req, res) => {

    try {

        const {
            bankroll = 1000,
            edge = 0.04,
            odds = 2.0,
            simulations = 5000,
            betsPerDay = 10,
            days = 30,
            kellyCap = 0.25
        } = req.query;

        const result = monteCarloEngine.runSimulation({
            bankroll: Number(bankroll),
            baseEdge: Number(edge),
            odds: Number(odds),
            simulations: Number(simulations),
            betsPerDay: Number(betsPerDay),
            days: Number(days),
            kellyCap: Number(kellyCap)
        });

        res.json(result);

    } catch (error) {

        console.error("Monte Carlo Error:", error);
        res.status(500).json({ error: error.message });

    }

});


//
// KELLY MONTE CARLO
//
app.get("/api/kelly", (req, res) => {

    const result = kellyMonteCarloEngine.runSimulation({
        bankroll: 1000,
        edge: 0.05,
        odds: 2.0,
        bets: 500
    });

    res.json(result);
});

//
// BANKROLL PROJECTION
//
app.get("/api/bankroll", (req, res) => {

    const result = bankrollSimulator.simulateGrowth({
        bankroll: 1000,
        days: 30,
        edge: 0.04
    });

    res.json(result);
});

//
// SERVE FRONTEND
//
app.use(express.static(path.join(__dirname, "../frontend")));

async function initDB() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS simulations (
                id SERIAL PRIMARY KEY,
                type VARCHAR(50),
                bankroll_start NUMERIC,
                bankroll_end NUMERIC,
                edge NUMERIC,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("Database initialized");
    } catch (err) {
        console.error("DB init error:", err);
    }
}

initDB();


//
// START SERVER
//
app.listen(PORT, () => {
    console.log("=================================");
    console.log("AI FUND MANAGER LIVE");
    console.log("PORT:", PORT);
    console.log("=================================");
});
