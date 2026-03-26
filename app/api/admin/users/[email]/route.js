import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/userInfo';
import History from '@/models/history';

export async function GET(req, { params }) {
    await dbConnect();
    try {
        const { email } = await params;
        const history = await History.find({ userEmail: email }).sort({ createdAt: -1 });
        return NextResponse.json(history);
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    await dbConnect();
    try {
        const { email } = await params;
        const body = await req.json();
        const { action } = body; // reset-tokens or make-admin

        if (action === 'reset-tokens') {
            const user = await User.findOneAndUpdate(
                { email },
                { normalTokens: 3, specialTokens: 3 },
                { new: true }
            );
            return NextResponse.json(user);
        }

        if (action === 'make-admin') {
            const user = await User.findOneAndUpdate(
                { email },
                { role: 'admin' },
                { new: true }
            );
            return NextResponse.json(user);
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    await dbConnect();
    try {
        const { email } = await params;
        await User.findOneAndDelete({ email });
        await History.deleteMany({ userEmail: email });
        return NextResponse.json({ message: "User and their history deleted" });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
