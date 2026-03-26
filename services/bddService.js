import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Always use project root for file paths in Next.js API routes
const PROJECT_ROOT = process.cwd();

const stripAnsi = (str) => {
    if (typeof str !== 'string') return str;
    return str.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-zARVNvpCWDJTSH]/g, "");
};

export const runBDDTest = async (testCase) => {
    const { given, when, then, featureContent: customFeatureContent } = testCase;
    const tempDir = path.join(PROJECT_ROOT, 'temp_bdd');

    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    let finalFeatureContent = "";

    if (customFeatureContent) {
        finalFeatureContent = customFeatureContent;
    } else {
        const finalGiven = given.includes('"') ? given : given.replace(/'/g, '"');
        const finalWhen = when.includes('"') ? when : when.replace(/'/g, '"');
        const finalThen = then.includes('"') ? then : then.replace(/'/g, '"');

        finalFeatureContent = [
            "Feature: Quality Analysis",
            "",
            "  Scenario: Automated Verification",
            `    Given ${finalGiven.startsWith('I am on') ? finalGiven : `"${finalGiven}"`}`,
            `    When ${finalWhen}`,
            `    Then ${finalThen}`,
            ""
        ].join('\n');
    }

    const featureFileName = `run_${Date.now()}.feature`;
    const featurePath = path.join(tempDir, featureFileName);
    fs.writeFileSync(featurePath, finalFeatureContent);

    return new Promise((resolve) => {
        const rootDir = PROJECT_ROOT;

        const spawnFeaturePath = path.resolve(featurePath);
        const spawnStepPath = path.resolve(rootDir, 'bdd', 'step_definitions.js');

        const cucumberBin = process.platform === 'win32'
            ? `"${path.join(rootDir, 'node_modules', '.bin', 'cucumber-js.cmd')}"`
            : path.join(rootDir, 'node_modules', '.bin', 'cucumber-js');

        const cucumber = spawn(cucumberBin, [
            `"${spawnFeaturePath}"`,
            '--require', `"${spawnStepPath}"`,
            '--format', 'summary'
        ], {
            cwd: rootDir,
            shell: true,
            env: { ...process.env, NODE_ENV: 'test' }
        });

        let output = "";
        let errorOutput = "";

        cucumber.stdout.on('data', (data) => {
            output += data.toString();
        });

        cucumber.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        cucumber.on('close', (code) => {
            if (fs.existsSync(featurePath)) fs.unlinkSync(featurePath);

            const combinedOutput = output + errorOutput;
            const cleanLog = stripAnsi(combinedOutput).trim();

            const zeroMatch = cleanLog.match(/0 scenarios/i) || cleanLog.includes('Undefined. Implement with');
            const success = code === 0 && !zeroMatch;

            const resultSummary = [
                "--- BEHAVIORAL INTELLIGENCE REPORT ---",
                `[SYSTEM] : AI Behavior Engine v2.1`,
                `[RESULT] : ${success ? "✅ VALIDATED" : "❌ ANOMALY DETECTED"}`,
                `[REPORT] :`,
                cleanLog || (success ? "All behavioral protocols validated successfully." : "Execution engine encountered a terminal blockage. Check target URL accessibility.")
            ].join('\n');

            resolve({
                success,
                output: resultSummary
            });
        });
    });
};

const bddService = { runBDDTest };
export default bddService;
