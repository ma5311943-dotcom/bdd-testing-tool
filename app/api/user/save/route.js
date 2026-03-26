import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/userInfo';

export async function POST(req) {
    await dbConnect();
    try {
        const { clerkId, email, role } = await req.json();

        if (!clerkId || !email) {
            return NextResponse.json({ error: "clerkId and email are required" }, { status: 400 });
        }

        // Check if user exists
        let user = await User.findOne({ clerkId });

        if (!user) {
            user = new User({ clerkId, email, role: role || 'user' });
            await user.save();
        }

        return NextResponse.json(user);
    } catch (err) {
        console.error("USER SAVE ERROR:", err.message);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
