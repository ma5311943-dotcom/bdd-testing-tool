const chromeLauncher = require('chrome-launcher');

exports.analyze = async (url) => {
    let chrome;
    try {
        // Dynamic import for Lighthouse (ESM only in newer versions)
        const { default: lighthouse } = await import('lighthouse');

        chrome = await chromeLauncher.launch({
            chromeFlags: [
                '--headless',
                '--no-sandbox',
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--disable-setuid-sandbox',
                '--window-size=1920,1080',
                '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            ]
        });

        const options = {
            logLevel: 'info',
            output: 'json',
            onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
            port: chrome.port
        };

        const runnerResult = await lighthouse(url, options);
        const lhr = runnerResult.lhr;

        const categories = {
            performance: {
                score: lhr.categories.performance?.score || 0,
                title: lhr.categories.performance?.title || 'Performance'
            },
            accessibility: {
                score: lhr.categories.accessibility?.score || 0,
                title: lhr.categories.accessibility?.title || 'Accessibility'
            },
            bestPractices: {
                score: lhr.categories['best-practices']?.score || 0,
                title: lhr.categories['best-practices']?.title || 'Best Practices'
            },
            seo: {
                score: lhr.categories.seo?.score || 0,
                title: lhr.categories.seo?.title || 'SEO'
            }
        };

        const audits = {
            fcp: lhr.audits['first-contentful-paint'],
            lcp: lhr.audits['largest-contentful-paint'],
            cls: lhr.audits['cumulative-layout-shift'],
            si: lhr.audits['speed-index'],
            tbt: lhr.audits['total-blocking-time'],
            ttfb: lhr.audits['server-response-time'],
            interactive: lhr.audits['interactive'],
            totalWeight: lhr.audits['total-byte-weight'],
            domSize: lhr.audits['dom-size'],
        };

        // Extract resource items
        const resourceSummary = lhr.audits['resource-summary']?.details?.items || [];

        const screenshots = {
            full: lhr.audits['full-page-screenshot']?.details?.screenshot?.data,
            thumb: lhr.audits['screenshot-thumbnails']?.details?.items?.[0]?.data
        };

        const detailedAudits = {
            network: lhr.audits['network-requests']?.details?.items?.slice(0, 10) || [],
            bootup: lhr.audits['bootup-time']?.details?.items?.slice(0, 5) || [],
            mainthread: lhr.audits['mainthread-work-breakdown']?.details?.items?.slice(0, 5) || []
        };

        return {
            categories,
            audits,
            resourceSummary,
            screenshots,
            detailedAudits,
            finalUrl: lhr.finalUrl,
            timing: lhr.timing,
            configSettings: lhr.configSettings
        };

    } catch (error) {
        console.error('Lighthouse error:', error);
        // Fallback for specific "frame_sequence" bug if it persists, though update should fix it
        if (error.message.includes('frame_sequence')) {
            return {
                error: 'Partial Analysis Failed',
                details: 'Target site structure caused internal Lighthouse error (frame_sequence).'
            };
        }
        return {
            error: 'Lighthouse analysis failed',
            details: error.message
        };
    } finally {
        if (chrome) {
            try {
                await chrome.kill();
            } catch (err) {
                console.warn('Warning: Failed to cleanup Chrome instance (EPERM likely):', err.message);
            }
        }
    }
};
