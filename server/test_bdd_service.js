const { runBDDTest } = require('./services/bddService');

async function test() {
    console.log("--- STARTING BDD SERVICE TEST ---");
    const testCase = {
        given: "I am on 'https://www.google.com'",
        when: "I wait for 5 seconds",
        then: "the element 'body' should be visible"
    };

    try {
        const result = await runBDDTest(testCase);
        console.log("SUCCESS:", result.success);
        console.log("OUTPUT:\n", result.output);
    } catch (error) {
        console.error("FATAL ERROR:", error);
    }
}

test();
