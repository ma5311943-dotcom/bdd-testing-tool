import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/userInfo';
import History from '@/models/history';
import bddService from '@/services/bddService';

export async function POST(req) {
    try {
        const { given, when, then, featureContent, email, url } = await req.json();

        // 1. Token Verification (non-blocking — test still runs if DB is down)
        try {
            await dbConnect();
            if (email) {
                const user = await User.findOne({ email });
                if (user && user.role !== 'admin') {
                    if (user.specialTokens === undefined) user.specialTokens = 3;
                    if (user.specialTokens <= 0) {
                        return NextResponse.json({
                            message: "You have used all your free manual/scenario tokens."
                        }, { status: 403 });
                    }
                    user.specialTokens -= 1;
                    await user.save();
                }
            }
        } catch (dbErr) {
            console.warn("DB check skipped (non-fatal):", dbErr.message);
        }
        if (!featureContent && (!given || !when || !then)) {
            return NextResponse.json({
                message: "Either 'featureContent' OR Scenario fields are required"
            }, { status: 400 });
        }

        // 2. Main Logic Execution
        const result = await bddService.runBDDTest({ given, when, then, featureContent });

        // 3. Save History
        if (email && url) {
            try {
                await History.create({
                    userEmail: email,
                    url: url,
                    result: {
                        success: result.success,
                        output: result.output,
                        scenario: featureContent || `${given} ${when} ${then}`
                    }
                });
            } catch (hErr) {
                console.error("HISTORY SAVE ERROR (Non-fatal):", hErr.message);
            }
        }

        return NextResponse.json({
            message: "Instant test executed",
            success: result.success,
            output: result.output
        });

    } catch (err) {
        console.error("INSTANT RUN ERROR:", err);
        return NextResponse.json({
            message: "Error running instant test scenario",
            error: err.message
        }, { status: 500 });
    }
}
