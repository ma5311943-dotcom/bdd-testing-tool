const axios = require('axios');
const https = require('https');

exports.analyze = async (url) => {
    const results = {
        https: false,
        headers: {},
        issues: []
    };

    try {
        if (url.startsWith('https')) {
            results.https = true;
        }

        const response = await axios.get(url, { timeout: 10000 });
        const headers = response.headers;

        // Check for common security headers
        const securityHeaders = [
            'strict-transport-security',
            'content-security-policy',
            'x-frame-options',
            'x-content-type-options',
            'referrer-policy',
            'permissions-policy'
        ];

        securityHeaders.forEach(header => {
            if (headers[header]) {
                results.headers[header] = 'Present';
            } else {
                results.headers[header] = 'Missing';
                results.issues.push(`Missing security header: ${header}`);
            }
        });

        if (!results.https) {
            results.issues.push('Website is not using HTTPS');
        }

        return results;

    } catch (error) {
        return {
            error: 'Could not perform security analysis',
            details: error.message
        };
    }
};
