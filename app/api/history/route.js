import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import History from '@/models/history';

export async function POST(req) {
    await dbConnect();
    try {
        const { userEmail, url, result } = await req.json();

        if (!userEmail || !url || !result) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const history = new History({ userEmail, url, result });
        await history.save();

        return NextResponse.json(history);
    } catch (err) {
        console.error("HISTORY SAVE ERROR:", err.message);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
