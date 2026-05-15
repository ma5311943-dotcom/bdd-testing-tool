const axios = require('axios');
const cheerio = require('cheerio');
const URL = require('url').URL;

exports.analyze = async (targetUrl) => {
    const brokenLinks = [];
    const workingLinks = [];
    let checkedCount = 0;
    const MAX_LINKS = 20; // Limit to avoid long wait times

    try {
        const response = await axios.get(targetUrl);
        const $ = cheerio.load(response.data);
        const links = [];

        $('a').each((i, el) => {
            const href = $(el).attr('href');
            if (href) {
                try {
                    const absoluteUrl = new URL(href, targetUrl).href;
                    if (absoluteUrl.startsWith('http')) {
                        links.push(absoluteUrl);
                    }
                } catch (e) {
                    // Ignore invalid URLs
                }
            }
        });

        const uniqueLinks = [...new Set(links)];
        const linksToCheck = uniqueLinks.slice(0, MAX_LINKS);

        for (const link of linksToCheck) {
            try {
                const res = await axios.head(link, { timeout: 5000 });
                if (res.status >= 400) {
                    brokenLinks.push({ url: link, status: res.status });
                } else {
                    workingLinks.push({ url: link, status: res.status });
                }
            } catch (err) {
                brokenLinks.push({ url: link, error: err.message });
            }
            checkedCount++;
        }

        return {
            totalLinksFound: links.length,
            checkedCount,
            brokenLinks,
            workingLinksCount: workingLinks.length
        };

    } catch (error) {
        return {
            error: 'Crawler failed',
            details: error.message
        };
    }
};
