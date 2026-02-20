/*
========================================
FUND MANAGER v8
AUTONOMOUS EXECUTION CORE
========================================
*/
const aiLearningEngine =
    require("./aiLearningEngine");

const profitEngine =
    require("./profitEngine");

const riskCore =
    require("./riskCore");


let history = [];

let lastExecution = null;

let totalExecutions = 0;


/*
========================================
EXECUTE CYCLE
========================================
*/

function runCycle(oddsCache) {

    if (!oddsCache || !oddsCache.length)
        return null;


    const bankroll =
        Number(
            riskCore.getStats().bankroll
        );


    const result =
        profitEngine.execute(
            bankroll,
            oddsCache
        );
    aiLearningEngine.update(result);


    lastExecution =
        new Date();

    totalExecutions++;


    history.push({

        time: lastExecution,

        bankroll:
            result.bankroll,

        profit:
            result.expectedProfit,

        bets:
            result.bets.length

    });


    if (history.length > 500)
        history.shift();


    return result;

}


/*
========================================
GET HISTORY
========================================
*/

function getHistory() {

    return history;

}


/*
========================================
GET STATUS
========================================
*/

function getStatus() {

    return {

        bankroll:
            riskCore.getStats().bankroll,

        executions:
            totalExecutions,

        lastExecution,

        historySize:
            history.length

    };

}


module.exports = {

    runCycle,

    getHistory,

    getStatus

};
