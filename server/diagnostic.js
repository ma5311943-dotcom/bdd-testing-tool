const { runBDDTest } = require('./services/bddService');

async function debug() {
    console.log("--- BDD LIVE TEST START ---");
    const testCase = {
        given: "I am on 'https://www.google.com'",
        when: "I wait for 1 seconds",
        then: "the element 'input, [role=\"combobox\"]' should be visible"
    };

    try {
        const result = await runBDDTest(testCase);
        console.log("SUCCESS:", result.success);
        console.log("LOGS:\n", result.output);
    } catch (err) {
        console.error("CRITICAL ERROR:", err);
    }
}

debug();
