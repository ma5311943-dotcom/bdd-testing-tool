const axios = require('axios');
const dns = require('dns').promises;
const { URL } = require('url');

// ===== checkAvailability =====
exports.checkAvailability = async (url) => {
    const start = Date.now();

    // ===== Regex Validation =====
    const regex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/i;
    if (!regex.test(url)) {
        return { up: false, error: 'Invalid URL format', responseTime: Date.now() - start };
    }

    // ===== Parse hostname =====
    let hostname;
    try {
        hostname = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
    } catch {
        return { up: false, error: 'Invalid URL', responseTime: Date.now() - start };
    }

    // ===== DNS Lookup =====
    try {
        const look = await dns.lookup(hostname);
        if (!look.address || look.address === '0.0.0.0' || look.address === '127.0.0.1') {
            return { up: false, error: 'Website not resolvable', responseTime: Date.now() - start };
        }
    } catch {
        return { up: false, error: 'DNS lookup failed', responseTime: Date.now() - start };
    }

    // ===== Quick HTTP check =====
    try {
        await axios.head(url.startsWith('http') ? url : `https://${url}`, { timeout: 5000 });
        return { up: true, responseTime: Date.now() - start };
    } catch {
        return { up: false, error: 'Website not reachable', responseTime: Date.now() - start };
    }
};
