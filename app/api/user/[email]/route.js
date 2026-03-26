import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/userInfo';

export async function GET(req, { params }) {
    await dbConnect();
    try {
        const { email } = await params;

        if (!email) {
            return NextResponse.json({ error: "Email or ID is required" }, { status: 400 });
        }

        const user = await User.findOne({
            $or: [
                { email: email },
                { clerkId: email }
            ]
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (err) {
        console.error("GET USER ERROR:", err.message);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
