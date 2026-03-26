import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/userInfo';

export async function GET() {
    await dbConnect();
    try {
        const users = await User.find({}).sort({ createdAt: -1 });
        return NextResponse.json(users);
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
