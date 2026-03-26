import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import History from '@/models/history';

export async function GET(req, { params }) {
    await dbConnect();
    try {
        const { email } = await params;

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const history = await History.find({ userEmail: email }).sort({ createdAt: -1 });

        return NextResponse.json(history);
    } catch (err) {
        console.error("GET HISTORY ERROR:", err.message);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
