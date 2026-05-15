const puppeteer = require('puppeteer');
const axeCore = require('axe-core');

exports.analyze = async (url) => {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        // 1. Load the page
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

        // 2. Inject axe-core
        // Note: Puppeteer's addScriptTag can inject local files or content.
        // We'll use the axeCore.source from the library.
        await page.evaluate(axeCore.source);

        // 3. Run axe
        const results = await page.evaluate(async () => {
            return await axe.run();
        });

        // 4. Processing results (simplifying for the frontend)
        const violations = results.violations.map(v => ({
            id: v.id,
            impact: v.impact,
            description: v.description,
            help: v.help,
            helpUrl: v.helpUrl,
            nodes: v.nodes.length
        }));

        const score = 100 - (violations.length * 5); // Simple heuristic

        return {
            score: Math.max(0, score),
            violations,
            passes: results.passes.length,
            incomplete: results.incomplete.length
        };

    } catch (error) {
        return {
            error: 'Axe analysis failed',
            details: error.message
        };
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};
