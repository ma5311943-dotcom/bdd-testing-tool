import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/userInfo';
import History from '@/models/history';

export async function GET() {
    await dbConnect();
    try {
        const users = await User.countDocuments();
        const totalScans = await History.countDocuments();

        return NextResponse.json({
            users,
            totalScans
        });

    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
