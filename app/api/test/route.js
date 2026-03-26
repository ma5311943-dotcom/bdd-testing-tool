import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/userInfo';
import History from '@/models/history';
import availabilityService from '@/services/availabilityService';
import securityService from '@/services/securityService';
import axeService from '@/services/axeService';
import lighthouseService from '@/services/lighthouseService';
import crawlerService from '@/services/crawlerService';
import extendedInfoService from '@/services/extendedInfoService';
import aiService from '@/services/aiService';

export async function POST(req) {
    await dbConnect();
    try {
        const body = await req.json();
        const { url, email } = body;

        if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 });

        const validUrl = url.startsWith('http') ? url : `https://${url}`;

        // 1. Check Availability
        const availability = await availabilityService.checkAvailability(validUrl);
        if (!availability.up) {
            return NextResponse.json({
                error: 'Website does not exist or is unreachable',
                details: availability.error
            }, { status: 400 });
        }

        // 2. Token Logic
        if (email) {
            const user = await User.findOne({ email });
            if (user && user.role !== 'admin') {
                if (user.normalTokens === undefined) user.normalTokens = 3;
                if (user.normalTokens <= 0) {
                    return NextResponse.json({ 
                        error: "You have used all your free normal testing tokens. Please contact admin." 
                    }, { status: 403 });
                }
                user.normalTokens -= 1;
                await user.save();
            }
        }

        // 3. Execution
        const security = await securityService.analyze(validUrl);
        const accessibility = await axeService.analyze(validUrl);
        const lighthouse = await lighthouseService.analyze(validUrl);
        const links = await crawlerService.analyze(validUrl);
        const extended = await extendedInfoService.analyze(validUrl);
        const aiSummary = await aiService.generateSummary({
            availability,
            security,
            accessibility,
            lighthouse,
            links,
            extended
        });

        const results = {
            url: validUrl,
            timestamp: new Date().toISOString(),
            availability,
            security,
            accessibility,
            lighthouse,
            links,
            extended,
            aiSummary
        };

        return NextResponse.json(results);
    } catch (err) {
        console.error("TEST ERROR:", err);
        return NextResponse.json({ 
            error: 'Test execution failed', 
            details: err.message 
        }, { status: 500 });
    }
}
