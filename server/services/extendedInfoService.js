const axios = require('axios');
const cheerio = require('cheerio');

exports.analyze = async (url) => {
    const results = {
        seoTags: {},
        socialMedia: {},
        technologies: [],
        manifest: null,
        files: {
            robots: false,
            sitemap: false
        },
        content: {
            wordCount: 0,
            imagesCount: 0,
            scriptsCount: 0,
            stylesCount: 0,
            headingStructure: {},
            imagesInfo: {
                total: 0,
                missingAlt: 0
            },
            fonts: [],
            thirdPartyScripts: [],
            metaAnalysis: {
                descriptionLength: 0,
                titleLength: 0
            }
        },
        cookies: [],
        compression: 'Unknown'
    };

    try {
        const baseUrl = new URL(url).origin;
        const response = await axios.get(url, {
            headers: {
                'Accept-Encoding': 'gzip, deflate, br',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            timeout: 10000
        });
        const $ = cheerio.load(response.data);
        const headers = response.headers;

        // 1. Files Check
        try {
            const robotsRes = await axios.head(`${baseUrl}/robots.txt`).catch(() => null);
            results.files.robots = robotsRes && robotsRes.status === 200;

            const sitemapRes = await axios.head(`${baseUrl}/sitemap.xml`).catch(() => null);
            results.files.sitemap = sitemapRes && sitemapRes.status === 200;

            const faviconRes = await axios.head(`${baseUrl}/favicon.ico`).catch(() => null);
            results.files.favicon = faviconRes && faviconRes.status === 200;

            const manifestUrl = $('link[rel="manifest"]').attr('href');
            results.manifest = manifestUrl ? 'Detected' : 'Missing';
        } catch (e) { }

        // 2. SEO Tags
        const title = $('title').text();
        const desc = $('meta[name="description"]').attr('content') || '';
        results.seoTags.title = title;
        results.seoTags.description = desc || 'Missing';
        results.seoTags.keywords = $('meta[name="keywords"]').attr('content') || 'Missing';
        results.seoTags.canonical = $('link[rel="canonical"]').attr('href') || 'Missing';

        results.content.metaAnalysis.titleLength = title.length;
        results.content.metaAnalysis.descriptionLength = desc.length;

        // 3. Social Media
        results.socialMedia.ogTitle = $('meta[property="og:title"]').attr('content');
        results.socialMedia.ogImage = $('meta[property="og:image"]').attr('content');
        results.socialMedia.twitterCard = $('meta[name="twitter:card"]').attr('content');

        // 4. Content Stats
        results.content.wordCount = $('body').text().split(/\s+/).length;
        results.content.imagesCount = $('img').length;
        results.content.scriptsCount = $('script').length;
        results.content.stylesCount = $('link[rel="stylesheet"]').length;

        // Heading Structure
        ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(h => {
            results.content.headingStructure[h] = $(h).length;
        });

        // Detailed Image Info
        const imgs = $('img');
        results.content.imagesInfo.total = imgs.length;
        imgs.each((i, el) => {
            if (!$(el).attr('alt')) results.content.imagesInfo.missingAlt++;
        });

        // Basic Font detection (from style tags)
        const fonts = new Set();
        $('style').each((i, el) => {
            const css = $(el).html();
            const matches = css.match(/font-family:\s*([^;]+)/g);
            if (matches) {
                matches.forEach(m => fonts.add(m.split(':')[1].trim().replace(/['"]/g, '')));
            }
        });
        results.content.fonts = [...fonts].slice(0, 5);

        // Detect Third Party Scripts
        const tpScripts = new Set();
        const tpTags = ['google-analytics', 'analytics.js', 'gtm.js', 'facebook.net', 'hotjar', 'intercom', 'stripe.com'];
        $('script').each((i, el) => {
            const src = $(el).attr('src') || '';
            tpTags.forEach(tag => {
                if (src.includes(tag)) tpScripts.add(tag.split('.')[0]);
            });
        });
        results.content.thirdPartyScripts = [...tpScripts];

        // 5. Tech Hints & Cookies
        if (headers['set-cookie']) {
            results.cookies = headers['set-cookie'].map(c => c.split('=')[0]);
        }

        if ($('meta[name="generator"]').attr('content')) results.technologies.push($('meta[name="generator"]').attr('content'));
        if (headers['server']) results.technologies.push(headers['server']);
        if (headers['x-powered-by']) results.technologies.push(headers['x-powered-by']);

        // 6. Compression
        results.compression = headers['content-encoding'] || 'None';

        return results;
    } catch (error) {
        return { error: 'Extended info failed', details: error.message };
    }
};
